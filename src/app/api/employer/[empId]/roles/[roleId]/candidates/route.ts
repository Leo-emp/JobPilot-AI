/* ============================================================
   MATCHED CANDIDATES — GET/PATCH /api/employer/[empId]/roles/[roleId]/candidates
   ============================================================
   GET: Returns candidates ranked by match score from persisted
   CandidateMatch records. Falls back to on-the-fly scoring if
   no persisted matches exist yet (e.g. role published before
   batch matching was deployed).

   PATCH: Update match status (shortlist, reject, contact) or
   provide feedback (thumbs up/down). Updates happen on individual
   matches identified by candidateId in the body.

   Results are anonymized — employers see match score, skill
   overlap, and preference summary, NOT name/email until consent.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employerHandler } from "@/lib/employer-handler";
import { dbRetry } from "@/lib/db-retry";
import { matchRoleToAllCandidates } from "@/lib/batch-matching";
import { parseSkills } from "@/lib/matching-engine";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";
import { audit, getClientIp } from "@/lib/audit";

/* # Validation for PATCH — status/feedback updates */
const updateMatchSchema = z.object({
  candidateId: z.string().min(1),
  status: z.enum(["new", "shortlisted", "rejected", "contacted", "hired"]).optional(),
  feedback: z.enum(["thumbs_up", "thumbs_down"]).nullable().optional(),
  feedbackNote: z.string().max(500).optional(),
});

export const GET = employerHandler(async (req, _session, membership, params) => {
  const roleId = params.roleId;

  /* # Verify role belongs to this employer */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: {
        id: roleId,
        employerId: membership.employerId,
      },
      select: { id: true, title: true, status: true },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  /* # Pagination + filter params */
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const minScore = parseInt(url.searchParams.get("minScore") || "0", 10);
  const statusFilter = url.searchParams.get("status") || null;

  /* # Check for persisted matches */
  const matchCount = await dbRetry(() =>
    prisma.candidateMatch.count({ where: { roleId: role.id } })
  );

  /* # If no persisted matches, trigger batch matching now */
  if (matchCount === 0) {
    await matchRoleToAllCandidates(role.id);
  }

  /* # Build query filter */
  const where: Record<string, unknown> = {
    roleId: role.id,
    score: { gte: minScore },
  };
  if (statusFilter) {
    where.status = statusFilter;
  }

  /* # Fetch persisted matches with candidate preference data */
  const [matches, total] = await Promise.all([
    dbRetry(() =>
      prisma.candidateMatch.findMany({
        where,
        orderBy: { score: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          preference: {
            select: {
              desiredTitle: true,
              locationPref: true,
              employmentType: true,
              openToWork: true,
              user: {
                select: {
                  id: true,
                  _count: {
                    select: { resumes: true, aiResults: true },
                  },
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

  /* # Shape response — anonymized */
  const candidates = matches.map(m => ({
    candidateId: m.candidateId,
    matchId: m.id,
    score: {
      total: m.score,
      breakdown: JSON.parse(m.breakdown),
      matchedSkills: parseSkills(m.matchedSkills),
      missingSkills: parseSkills(m.missingSkills),
    },
    status: m.status,
    feedback: m.feedback,
    feedbackNote: m.feedbackNote,
    preferences: m.preference ? {
      desiredTitle: m.preference.desiredTitle,
      locationPref: m.preference.locationPref,
      employmentType: m.preference.employmentType,
      openToWork: m.preference.openToWork,
    } : null,
    activity: m.preference ? {
      resumeCount: m.preference.user._count.resumes,
      aiCallCount: m.preference.user._count.aiResults,
    } : null,
  }));

  /* # Aggregate stats (across all matches, not just current page) */
  const allScores = await dbRetry(() =>
    prisma.candidateMatch.aggregate({
      where: { roleId: role.id, score: { gte: minScore } },
      _avg: { score: true },
      _max: { score: true },
      _count: true,
    })
  );

  return NextResponse.json({
    candidates,
    role: { id: role.id, title: role.title, status: role.status },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    stats: {
      totalCandidates: allScores._count,
      averageScore: Math.round(allScores._avg.score || 0),
      topScore: allScores._max.score || 0,
    },
  });
}, "recruiter");

/* # PATCH: update match status or feedback — recruiter+ */
export const PATCH = employerHandler(async (req: NextRequest, session, membership, params) => {
  const body = await req.json();
  const parsed = updateMatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { candidateId, status, feedback, feedbackNote } = parsed.data;

  /* # Verify the match exists and belongs to this employer's role */
  const match = await dbRetry(() =>
    prisma.candidateMatch.findFirst({
      where: {
        candidateId,
        roleId: params.roleId,
        role: { employerId: membership.employerId },
      },
    })
  );

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  /* # Build update data — only set provided fields */
  const updateData: Record<string, unknown> = {};
  if (status !== undefined) updateData.status = status;
  if (feedback !== undefined) updateData.feedback = feedback;
  if (feedbackNote !== undefined) updateData.feedbackNote = feedbackNote;

  const updated = await dbRetry(() =>
    prisma.candidateMatch.update({
      where: { id: match.id },
      data: updateData,
    })
  );

  /* # Audit status changes */
  if (status) {
    audit("employer.candidate.status_changed", {
      userId: session.user.id,
      detail: `Changed candidate ${candidateId} to ${status} for role ${params.roleId}`,
      ip: getClientIp(req.headers),
    });
  }

  return NextResponse.json({ match: updated });
}, "recruiter");
