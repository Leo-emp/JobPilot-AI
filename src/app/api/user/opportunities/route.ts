/* ============================================================
   CANDIDATE OPPORTUNITIES — GET/PATCH /api/user/opportunities
   ============================================================
   GET: Returns roles the candidate has been matched with,
   along with their match score, status, and role details.
   Only shows matches where candidateVisible = true and
   candidateHidden = false.

   PATCH: Allows candidate to withdraw from or hide a match.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";
import { parseSkills } from "@/lib/matching-engine";
import { isCandidateVisible, CANDIDATE_STATUS_LABELS } from "@/lib/match-pipeline";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";
import type { MatchStatus } from "@/lib/match-pipeline";

/* # Validation for PATCH — hide or withdraw */
const updateOpportunitySchema = z.object({
  matchId: z.string().min(1),
  action: z.enum(["hide", "withdraw"]),
});

/* # GET: list candidate's matched opportunities */
export const GET = authHandler(async (req, session) => {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const statusFilter = url.searchParams.get("status") || null;

  /* # Build query — only visible, not hidden matches */
  const where: Record<string, unknown> = {
    candidateId: session.user.id,
    candidateVisible: true,
    candidateHidden: false,
  };

  /* # Filter by candidate-visible statuses only */
  if (statusFilter) {
    where.status = statusFilter;
  }

  const [matches, total] = await Promise.all([
    dbRetry(() =>
      prisma.candidateMatch.findMany({
        where,
        orderBy: { score: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          role: {
            select: {
              id: true,
              title: true,
              description: true,
              locationType: true,
              location: true,
              employmentType: true,
              salaryMin: true,
              salaryMax: true,
              salaryCurrency: true,
              industry: true,
              status: true,
              publishedAt: true,
              employer: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  industry: true,
                  size: true,
                  logoUrl: true,
                  remoteFriendly: true,
                },
              },
            },
          },
        },
      })
    ),
    dbRetry(() =>
      prisma.candidateMatch.count({ where })
    ),
  ]);

  /* # Shape response with candidate-facing status labels */
  const opportunities = matches
    .filter(m => isCandidateVisible(m.status as MatchStatus))
    .map(m => ({
      matchId: m.id,
      score: m.score,
      breakdown: JSON.parse(m.breakdown),
      matchedSkills: parseSkills(m.matchedSkills),
      missingSkills: parseSkills(m.missingSkills),
      status: m.status,
      statusLabel: CANDIDATE_STATUS_LABELS[m.status as MatchStatus] || m.status,
      matchedAt: m.createdAt,
      role: {
        id: m.role.id,
        title: m.role.title,
        description: m.role.description?.substring(0, 200),
        locationType: m.role.locationType,
        location: m.role.location,
        employmentType: m.role.employmentType,
        salaryMin: m.role.salaryMin,
        salaryMax: m.role.salaryMax,
        salaryCurrency: m.role.salaryCurrency,
        industry: m.role.industry,
        isActive: m.role.status === "active",
      },
      employer: {
        name: m.role.employer.name,
        slug: m.role.employer.slug,
        industry: m.role.employer.industry,
        size: m.role.employer.size,
        logoUrl: m.role.employer.logoUrl,
        remoteFriendly: m.role.employer.remoteFriendly,
      },
    }));

  return NextResponse.json({
    opportunities,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/* # PATCH: hide or withdraw from a match */
export const PATCH = authHandler(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = updateOpportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { matchId, action } = parsed.data;

  /* # Verify match belongs to this candidate */
  const match = await dbRetry(() =>
    prisma.candidateMatch.findFirst({
      where: {
        id: matchId,
        candidateId: session.user.id,
      },
    })
  );

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  if (action === "hide") {
    /* # Hide — removes from candidate's view but doesn't affect employer */
    await dbRetry(() =>
      prisma.candidateMatch.update({
        where: { id: matchId },
        data: { candidateHidden: true },
      })
    );
  } else if (action === "withdraw") {
    /* # Withdraw — sets status to withdrawn, visible to employer too */
    await dbRetry(() =>
      prisma.candidateMatch.update({
        where: { id: matchId },
        data: { status: "withdrawn" },
      })
    );
  }

  return NextResponse.json({ success: true });
});
