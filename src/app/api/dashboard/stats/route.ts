/* ============================================================
   DASHBOARD STATS API — Comprehensive Overview Data
   ============================================================
   GET /api/dashboard/stats
   Returns counts, recent activity, application pipeline, and
   AI usage for the authenticated user. Powers the dashboard
   home page with a single efficient request.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export const GET = authHandler(async (_req, session) => {
  const userId = session.user.id;

  /* # 5-second cache — feels real-time but protects DB at scale.
     Invalidated on plan changes via cacheDel in AI/payment routes. */
  const cacheKey = `dashboard:stats:${userId}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "private, no-cache" },
    });
  }

  /* # All queries run in parallel for speed */
  const [
    resumeCount,
    jobCount,
    applicationCount,
    coverLetterCount,
    contactCount,
    aiResultCount,
    user,
    recentActivity,
    applicationsByStatus,
    upcomingInterviews,
    upcomingFollowUps,
  ] = await dbRetry(() =>
    Promise.all([
      prisma.resume.count({ where: { userId } }),
      prisma.savedJob.count({ where: { userId } }),
      prisma.application.count({ where: { userId } }),
      prisma.coverLetter.count({ where: { userId } }),
      prisma.contact.count({ where: { userId } }),
      prisma.aiResult.count({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, aiUsageCount: true, usageResetDate: true },
      }),
      prisma.aiResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, action: true, title: true, createdAt: true },
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      prisma.application.findMany({
        where: {
          userId,
          interviewDate: { gte: new Date() },
        },
        orderBy: { interviewDate: "asc" },
        take: 3,
        select: { id: true, jobTitle: true, company: true, interviewDate: true },
      }),
      prisma.contact.findMany({
        where: {
          userId,
          nextFollowUp: { gte: new Date() },
        },
        orderBy: { nextFollowUp: "asc" },
        take: 3,
        select: { id: true, name: true, company: true, role: true, nextFollowUp: true },
      }),
    ])
  );

  /* # Follow-up query uses new column — gracefully degrade if migration not yet applied */
  let dueFollowUps: { id: string; jobTitle: string; company: string; followUpDate: Date | null; appliedDate: Date | null; status: string }[] = [];
  try {
    dueFollowUps = await dbRetry(() =>
      prisma.application.findMany({
        where: {
          userId,
          followUpDate: { lte: new Date() },
          status: { notIn: ["Offer", "Rejected"] },
        },
        orderBy: { followUpDate: "asc" },
        take: 5,
        select: { id: true, jobTitle: true, company: true, followUpDate: true, appliedDate: true, status: true },
      })
    );
  } catch { /* # Column doesn't exist yet in production — return empty */ }

  /* # Build application pipeline object */
  const pipeline: Record<string, number> = {};
  for (const row of applicationsByStatus) {
    pipeline[row.status] = row._count.status;
  }

  /* # AI usage limits from single source of truth */
  const plan = user?.plan || "free";
  const aiLimit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const aiUsed = user?.aiUsageCount || 0;

  const result = {
    resumeCount,
    jobCount,
    applicationCount,
    coverLetterCount,
    contactCount,
    aiResultCount,
    aiUsage: { used: aiUsed, limit: aiLimit, plan },
    recentActivity,
    pipeline,
    upcomingInterviews,
    upcomingFollowUps,
    dueFollowUps,
  };

  /* # Cache for 5 seconds — near real-time, scales to thousands of users */
  await cacheSet(cacheKey, result, 5);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, no-cache" },
  });
});
