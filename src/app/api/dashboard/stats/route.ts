/* ============================================================
   DASHBOARD STATS API — Comprehensive Overview Data
   ============================================================
   GET /api/dashboard/stats
   Returns counts, recent activity, application pipeline, and
   AI usage for the authenticated user. Powers the dashboard
   home page with a single efficient request.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";

export const GET = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  /* # Fetch all data in parallel for speed */
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

  /* # Build application pipeline object */
  const pipeline: Record<string, number> = {};
  for (const row of applicationsByStatus) {
    pipeline[row.status] = row._count.status;
  }

  /* # AI usage limits by plan */
  const planLimits: Record<string, number> = { free: 20, pro: 100, enterprise: 9999 };
  const plan = user?.plan || "free";
  const aiLimit = planLimits[plan] || 20;
  const aiUsed = user?.aiUsageCount || 0;

  return NextResponse.json(
    {
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
    },
    { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
  );
});
