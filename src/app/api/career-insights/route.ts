/* ============================================================
   CAREER INSIGHTS API
   ============================================================
   GET /api/career-insights
   Returns personalized career intelligence: skill gaps, success
   patterns, recommendations — all computed from the user's
   cross-feature data (resumes, jobs, applications, browsing).
   ============================================================ */

import { NextResponse } from "next/server";
import { computeCareerInsights, refreshUserSkills, extractAndStoreJobSkills } from "@/lib/career-intelligence";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";

/* # GET — return computed career insights */
export const GET = authHandler(async (_req, session) => {

  /* # Cache for 10 minutes — insights don't change rapidly */
  const cacheKey = `career:insights:${session.user.id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const insights = await dbRetry(() =>
      computeCareerInsights(session.user.id)
    );

    await cacheSet(cacheKey, insights, 600);

    return NextResponse.json(insights);
  } catch (err) {
    console.error("[career-insights] Error:", err);
    return NextResponse.json({ error: "Failed to compute insights" }, { status: 500 });
  }
});

/* # POST — refresh skills cache and backfill job skills */
export const POST = authHandler(async (_req, session) => {

  try {
    /* Re-extract skills from latest resume */
    const skills = await refreshUserSkills(session.user.id);

    /* Backfill requiredSkills on saved jobs that don't have them yet */
    const jobs = await dbRetry(() =>
      prisma.savedJob.findMany({
        where: { userId: session.user.id, requiredSkills: null },
        select: { id: true, description: true },
        take: 20,
      })
    );

    let backfilled = 0;
    for (const job of jobs) {
      if (job.description) {
        await extractAndStoreJobSkills(job.id, job.description);
        backfilled++;
      }
    }

    return NextResponse.json({
      skills,
      backfilledJobs: backfilled,
    });
  } catch (err) {
    console.error("[career-insights] Refresh error:", err);
    return NextResponse.json({ error: "Failed to refresh insights" }, { status: 500 });
  }
});
