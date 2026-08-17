/* ============================================================
   ADMIN B2B METRICS — GET /api/admin/b2b-metrics
   ============================================================
   Returns B2B-specific analytics for the admin dashboard:
   - Employer counts by plan tier
   - Pool size (open-to-work candidates)
   - Match rates and outreach stats
   - Monthly usage aggregates
   - Revenue indicators

   Protected: only admin users can access this.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeHandler } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { getB2BMetrics } from "@/lib/employer-usage";
import { isB2BEnabled } from "@/lib/b2b-gate";

export const GET = safeHandler(async () => {
  /* # B2B gate */
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* # Admin gate */
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* # Check cache (5min TTL — B2B metrics don't need real-time) */
  const cacheKey = "admin:b2b-metrics";
  const cached = await cacheGet<string>(cacheKey);
  if (cached) {
    try {
      return NextResponse.json(JSON.parse(cached));
    } catch {
      /* # Invalid cache — fall through */
    }
  }

  /* # Compute metrics */
  const metrics = await getB2BMetrics();

  /* # Compute match rate (matches / roles) */
  const matchRate = metrics.activeRoles > 0
    ? Math.round((metrics.totalMatches / metrics.activeRoles) * 10) / 10
    : 0;

  /* # Compute outreach response rate */
  const responseRate = metrics.totalOutreach > 0
    ? Math.round((metrics.month.candidatesContacted / metrics.totalOutreach) * 100)
    : 0;

  const result = {
    employers: {
      total: metrics.totalEmployers,
      active: metrics.activeEmployers,
      plans: metrics.plans,
    },
    roles: {
      total: metrics.totalRoles,
      active: metrics.activeRoles,
    },
    candidatePool: {
      openToWork: metrics.poolSize,
    },
    matching: {
      totalMatches: metrics.totalMatches,
      avgMatchesPerRole: matchRate,
    },
    outreach: {
      totalSent: metrics.totalOutreach,
      responseRate,
    },
    monthlyUsage: metrics.month,
  };

  /* # Cache for 5 minutes */
  await cacheSet(cacheKey, JSON.stringify(result), 300);

  return NextResponse.json(result);
});
