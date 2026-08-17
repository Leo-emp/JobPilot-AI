/* ============================================================
   EMPLOYER USAGE — Monthly usage tracking + plan limit checks
   ============================================================
   Tracks employer activity per month for billing analytics and
   plan limit enforcement. Each employer gets one row per month.

   Usage:
     await incrementUsage(employerId, "rolesPosted");
     const usage = await getUsage(employerId);
     const allowed = await checkLimit(employerId, "rolesPosted");
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { EMPLOYER_PLAN_LIMITS, type EmployerPlanTier } from "@/lib/stripe";

/* # Current month key in "2026-08" format */
function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* # Get or create the usage record for this employer + month */
export async function getUsage(employerId: string) {
  const month = currentMonth();

  /* # Upsert: get existing or create with zeroed counters */
  return dbRetry(() =>
    prisma.employerUsage.upsert({
      where: { employerId_month: { employerId, month } },
      create: { employerId, month },
      update: {},
    })
  );
}

/* # Increment a specific counter (atomic) */
export async function incrementUsage(
  employerId: string,
  field: "rolesPosted" | "candidatesContacted" | "matchesViewed" | "bookmarksUsed" | "shortlistsDelivered",
  amount: number = 1,
) {
  const month = currentMonth();

  /* # Upsert + increment in one query */
  return dbRetry(() =>
    prisma.employerUsage.upsert({
      where: { employerId_month: { employerId, month } },
      create: { employerId, month, [field]: amount },
      update: { [field]: { increment: amount } },
    })
  );
}

/* # Check if an employer has exceeded a plan limit for a given metric */
export async function checkLimit(
  employerId: string,
  metric: "activeRoles" | "bookmarksPerMonth",
): Promise<{ allowed: boolean; current: number; limit: number }> {
  /* # Get employer plan */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: employerId },
      select: { plan: true },
    })
  );

  const plan = (employer?.plan ?? "free") as EmployerPlanTier;
  const limits = EMPLOYER_PLAN_LIMITS[plan] ?? EMPLOYER_PLAN_LIMITS.free;

  if (metric === "activeRoles") {
    /* # Count currently active roles */
    const activeCount = await dbRetry(() =>
      prisma.role.count({
        where: { employerId, status: "active" },
      })
    );
    return {
      allowed: activeCount < limits.activeRoles,
      current: activeCount,
      limit: limits.activeRoles === Infinity ? -1 : limits.activeRoles,
    };
  }

  if (metric === "bookmarksPerMonth") {
    const usage = await getUsage(employerId);
    return {
      allowed: usage.bookmarksUsed < limits.bookmarksPerMonth,
      current: usage.bookmarksUsed,
      limit: limits.bookmarksPerMonth === Infinity ? -1 : limits.bookmarksPerMonth,
    };
  }

  return { allowed: true, current: 0, limit: -1 };
}

/* # Get usage summary for admin B2B metrics */
export async function getB2BMetrics() {
  const month = currentMonth();

  /* # Aggregate across all employers for this month */
  const [
    totalEmployers,
    activeEmployers,
    totalRoles,
    activeRoles,
    totalMatches,
    totalOutreach,
    planDistribution,
    monthlyUsage,
  ] = await Promise.all([
    prisma.employer.count({ where: { deletedAt: null } }),
    prisma.employer.count({
      where: { deletedAt: null, roles: { some: { status: "active" } } },
    }),
    prisma.role.count(),
    prisma.role.count({ where: { status: "active" } }),
    prisma.candidateMatch.count(),
    prisma.outreach.count({ where: { status: "sent" } }),
    /* # Group employers by plan */
    prisma.employer.groupBy({
      by: ["plan"],
      _count: true,
      where: { deletedAt: null },
    }),
    /* # This month's aggregate usage */
    prisma.employerUsage.findMany({
      where: { month },
    }),
  ]);

  /* # Calculate aggregate monthly stats */
  interface UsageAgg {
    rolesPosted: number;
    candidatesContacted: number;
    matchesViewed: number;
    bookmarksUsed: number;
    shortlistsDelivered: number;
  }
  const initial: UsageAgg = { rolesPosted: 0, candidatesContacted: 0, matchesViewed: 0, bookmarksUsed: 0, shortlistsDelivered: 0 };
  const monthAgg = monthlyUsage.reduce<UsageAgg>(
    (acc, u) => ({
      rolesPosted: acc.rolesPosted + u.rolesPosted,
      candidatesContacted: acc.candidatesContacted + u.candidatesContacted,
      matchesViewed: acc.matchesViewed + u.matchesViewed,
      bookmarksUsed: acc.bookmarksUsed + u.bookmarksUsed,
      shortlistsDelivered: acc.shortlistsDelivered + u.shortlistsDelivered,
    }),
    initial,
  );

  /* # Build plan distribution map */
  const plans: Record<string, number> = {};
  for (const p of planDistribution) {
    plans[p.plan] = typeof p._count === "number" ? p._count : (p._count as { _all: number })._all;
  }

  /* # Pool size = candidates with openToWork */
  const poolSize = await prisma.candidatePreference.count({
    where: { openToWork: true },
  });

  return {
    totalEmployers,
    activeEmployers,
    totalRoles,
    activeRoles,
    totalMatches,
    totalOutreach,
    poolSize,
    plans,
    month: monthAgg,
  };
}
