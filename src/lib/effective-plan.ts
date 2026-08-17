/* ============================================================
   EFFECTIVE PLAN — Resolves a user's plan considering org sponsorship
   ============================================================
   A user's effective plan = their own paid plan, OR "pro" if any of
   their organizations has an active B2B subscription.

   Used by AI routes to determine quota limits. Cached under
   "effectivePlan:{userId}" key for 60s to avoid DB hits on
   every AI request.

   Usage:
     const plan = await getEffectivePlan(userId);
     const limit = PLAN_LIMITS[plan];
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { cacheGet, cacheSet } from "@/lib/redis";

/* # Resolve user's effective plan — own plan or org-sponsored pro */
export async function getEffectivePlan(userId: string): Promise<"free" | "pro"> {
  /* # Check cache first — avoid DB hit on every AI request */
  const cached = await cacheGet<string>(`effectivePlan:${userId}`);
  if (cached === "pro" || cached === "free") return cached;

  /* # Look up user's own plan */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  /* # If user already has a paid plan, they're pro */
  if (user?.plan === "pro" || user?.plan === "enterprise") {
    await cacheSet(`effectivePlan:${userId}`, "pro", 60);
    return "pro";
  }

  /* # Check if any org sponsorship grants pro entitlements */
  const sponsorship = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        deletedAt: null,
        plan: { not: "pilot" }, // # Only paid org plans (team, business) grant pro
      },
    },
    select: { organization: { select: { plan: true } } },
  });

  /* # Active org membership with paid plan → pro */
  const effective = sponsorship ? "pro" : "free";
  await cacheSet(`effectivePlan:${userId}`, effective, 60);
  return effective;
}
