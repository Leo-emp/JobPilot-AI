/* ============================================================
   ADMIN STATS API — /api/admin/stats
   ============================================================
   Returns platform-wide analytics for the admin dashboard.
   Protected: only admin users can access this endpoint.
   Stats are computed via DB queries (accurate at any scale).
   User list is paginated to keep response size manageable.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

export const GET = safeHandler(async (req: NextRequest) => {
  /* ---- Auth + admin gate ---- */
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* ---- Pagination for user list ---- */
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  /* ---- Date boundaries for signup stats ---- */
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  /* ---- Fetch all stats in parallel (DB queries scale to any user count) ---- */
  const [
    totalUsers,
    freeUsers,
    proUsers,
    totalResumes,
    totalJobs,
    totalApplications,
    totalCoverLetters,
    totalContacts,
    totalCompanies,
    recentSignups,
    monthlySignups,
    totalAICallsResult,
    users,
  ] = await dbRetry(() => Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "free" } }),
    prisma.user.count({ where: { plan: "pro" } }),
    prisma.resume.count(),
    prisma.savedJob.count(),
    prisma.application.count(),
    prisma.coverLetter.count(),
    prisma.contact.count(),
    prisma.company.count(),
    /* Signup counts via DB — accurate regardless of user list size */
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    /* Sum AI usage across all users */
    prisma.user.aggregate({ _sum: { aiUsageCount: true } }),
    /* Paginated user list (most recent first) */
    prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        aiUsageCount: true,
        usageResetDate: true,
        createdAt: true,
        _count: {
          select: {
            resumes: true,
            jobs: true,
            applications: true,
            coverLetters: true,
            contacts: true,
          },
        },
      },
    }),
  ]));

  const totalAICalls = totalAICallsResult._sum.aiUsageCount || 0;

  /* ---- Revenue Metrics (estimated from plan data) ---- */
  const monthlyPrice = 10;
  const annualMonthlyPrice = 8;
  const estimatedMRR = proUsers * monthlyPrice;
  const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0.0";
  const avgAICallsPerUser = totalUsers > 0 ? Math.round(totalAICalls / totalUsers) : 0;

  /* ---- Growth: signups per week for last 8 weeks (via DB counts) ---- */
  const weeklyGrowth: { week: string; signups: number }[] = [];
  const weekPromises = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
    weekPromises.push(
      dbRetry(() => prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }))
        .then(count => ({
          week: start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          signups: count,
        }))
    );
  }
  weeklyGrowth.push(...await Promise.all(weekPromises));

  return NextResponse.json({
    overview: {
      totalUsers,
      freeUsers,
      proUsers,
      recentSignups,
      monthlySignups,
      totalAICalls,
    },
    revenue: {
      estimatedMRR,
      conversionRate,
      avgAICallsPerUser,
      monthlyPrice,
      annualMonthlyPrice,
    },
    growth: weeklyGrowth,
    content: {
      totalResumes,
      totalJobs,
      totalApplications,
      totalCoverLetters,
      totalContacts,
      totalCompanies,
    },
    users,
    pagination: {
      page,
      pageSize,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
    },
  });
});
