/* ============================================================
   MEMBER ACTIVITY — GET /api/org/[orgId]/members/[userId]/activity
   ============================================================
   Coach+ role. Returns per-candidate activity metrics.
   Gated by dataVisibility:
     "metrics" → counts only (applications, resumes, AI calls)
     "full" → includes resume content and AI output text
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { dbRetry } from "@/lib/db-retry";

/* # GET: candidate activity for coach dashboard — coach+ role */
export const GET = orgHandler(async (_req, _session, membership, params) => {
  const targetUserId = params.userId;

  /* # Look up the target member to check dataVisibility */
  const member = await dbRetry(() =>
    prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: membership.organizationId,
          userId: targetUserId,
        },
      },
      select: { dataVisibility: true },
    })
  );

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  /* # Always fetch counts — available regardless of visibility setting */
  const [applicationsByStatus, aiByAction, resumeCount, coverLetterCount] = await Promise.all([
    /* # Application pipeline breakdown */
    dbRetry(() =>
      prisma.application.groupBy({
        by: ["status"],
        where: { userId: targetUserId },
        _count: true,
      })
    ),
    /* # AI usage by action type */
    dbRetry(() =>
      prisma.aiResult.groupBy({
        by: ["action"],
        where: { userId: targetUserId },
        _count: true,
      })
    ),
    /* # Total resumes uploaded */
    dbRetry(() =>
      prisma.resume.count({ where: { userId: targetUserId } })
    ),
    /* # Total cover letters generated */
    dbRetry(() =>
      prisma.coverLetter.count({ where: { userId: targetUserId } })
    ),
  ]);

  /* # Format application pipeline */
  const pipeline: Record<string, number> = {};
  for (const row of applicationsByStatus) {
    pipeline[row.status] = row._count;
  }

  /* # Format AI usage */
  const aiUsage: Record<string, number> = {};
  for (const row of aiByAction) {
    aiUsage[row.action] = row._count;
  }

  /* # Base metrics response — always returned */
  const activity: Record<string, unknown> = {
    applicationPipeline: pipeline,
    totalApplications: Object.values(pipeline).reduce((sum, c) => sum + c, 0),
    aiUsageByAction: aiUsage,
    totalAiCalls: Object.values(aiUsage).reduce((sum, c) => sum + c, 0),
    resumeCount,
    coverLetterCount,
  };

  /* # If full visibility is enabled, include recent activity details */
  if (member.dataVisibility === "full") {
    const [recentApplications, recentAiResults] = await Promise.all([
      dbRetry(() =>
        prisma.application.findMany({
          where: { userId: targetUserId },
          select: {
            id: true,
            jobTitle: true,
            company: true,
            status: true,
            appliedDate: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 20,
        })
      ),
      dbRetry(() =>
        prisma.aiResult.findMany({
          where: { userId: targetUserId },
          select: {
            id: true,
            action: true,
            title: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      ),
    ]);

    activity.recentApplications = recentApplications;
    activity.recentAiResults = recentAiResults;
  }

  return NextResponse.json({ activity });
}, "coach");
