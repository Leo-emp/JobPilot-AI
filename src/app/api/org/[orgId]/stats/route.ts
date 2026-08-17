/* ============================================================
   ORG STATS — GET /api/org/[orgId]/stats
   ============================================================
   Coach+ role. Returns aggregate stats for the coach dashboard.
   Supports ?cohort= filter to scope stats to a specific group.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { dbRetry } from "@/lib/db-retry";

/* # GET: org-wide aggregate stats — coach+ role */
export const GET = orgHandler(async (req: NextRequest, _session, membership) => {
  const url = new URL(req.url);
  const cohort = url.searchParams.get("cohort") || undefined;

  /* # Get all member user IDs (optionally filtered by cohort) */
  const members = await dbRetry(() =>
    prisma.organizationMember.findMany({
      where: {
        organizationId: membership.organizationId,
        ...(cohort ? { cohort } : {}),
      },
      select: { userId: true, joinedAt: true },
    })
  );

  const userIds = members.map((m) => m.userId);

  if (userIds.length === 0) {
    return NextResponse.json({
      stats: {
        totalMembers: 0,
        activeThisWeek: 0,
        resumesCreated: 0,
        applicationsTotal: 0,
        applicationsByStatus: {},
        aiCallsTotal: 0,
      },
    });
  }

  /* # Parallel aggregate queries for performance */
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    resumeCount,
    applicationsByStatus,
    aiCallCount,
    activeUsers,
  ] = await Promise.all([
    /* # Total resumes across all members */
    dbRetry(() =>
      prisma.resume.count({
        where: { userId: { in: userIds } },
      })
    ),
    /* # Applications grouped by status */
    dbRetry(() =>
      prisma.application.groupBy({
        by: ["status"],
        where: { userId: { in: userIds } },
        _count: true,
      })
    ),
    /* # Total AI calls */
    dbRetry(() =>
      prisma.aiResult.count({
        where: { userId: { in: userIds } },
      })
    ),
    /* # Users active in the last 7 days (had any AI call or application update) */
    dbRetry(() =>
      prisma.aiResult.findMany({
        where: {
          userId: { in: userIds },
          createdAt: { gte: oneWeekAgo },
        },
        select: { userId: true },
        distinct: ["userId"],
      })
    ),
  ]);

  /* # Format application pipeline */
  const pipeline: Record<string, number> = {};
  let applicationsTotal = 0;
  for (const row of applicationsByStatus) {
    pipeline[row.status] = row._count;
    applicationsTotal += row._count;
  }

  return NextResponse.json({
    stats: {
      totalMembers: userIds.length,
      activeThisWeek: activeUsers.length,
      resumesCreated: resumeCount,
      applicationsTotal,
      applicationsByStatus: pipeline,
      aiCallsTotal: aiCallCount,
    },
  });
}, "coach");
