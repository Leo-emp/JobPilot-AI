/* ============================================================
   USER PLAN API - Get Current Plan & Usage (Cached)
   ============================================================
   GET /api/user/plan
   Returns the user's current plan, AI usage count, and
   usage reset date. Used by the settings page and dashboard.

   Redis cache: 60 seconds TTL — reduces DB load from repeated
   dashboard refreshes. Cache is invalidated on plan changes.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { cacheGet, cacheSet } from "@/lib/redis";
import { safeHandler } from "@/lib/api-handler";

/* # Cache key prefix for user plan data */
const PLAN_CACHE_PREFIX = "plan";
/* # Cache TTL: 60 seconds — fresh enough for usage display */
const PLAN_CACHE_TTL = 60;

export const GET = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Try cache first */
  const cacheKey = `${PLAN_CACHE_PREFIX}:${session.user.id}`;
  const cached = await cacheGet<{ plan: string; aiUsageCount: number; usageResetDate: string }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  /* # Cache miss — query the database */
  const user = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        aiUsageCount: true,
        usageResetDate: true,
        weeklyDigest: true,
      },
    })
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  /* # Cache the result for 60 seconds */
  const planData = {
    plan: user.plan,
    aiUsageCount: user.aiUsageCount,
    usageResetDate: user.usageResetDate.toISOString(),
    weeklyDigest: user.weeklyDigest,
  };
  await cacheSet(cacheKey, planData, PLAN_CACHE_TTL);

  return NextResponse.json(planData, {
    headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=30" },
  });
});
