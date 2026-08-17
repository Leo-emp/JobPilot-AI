/* ============================================================
   SHORTLIST — Manage candidate shortlists for employers
   ============================================================
   Shortlists are the "deliverable" of the recruiting pipeline.
   Employers get a curated list of candidates ranked by score
   with AI summaries and response status.

   Operations:
   - Create a shortlist for a role
   - Add/remove entries (by CandidateMatch ID)
   - Deliver (mark as delivered + notify employer)
   - Export to JSON (CSV/PDF generation done on frontend)
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

/* # Create a new shortlist for a role */
export async function createShortlist(
  roleId: string,
  employerId: string,
  name: string = "Shortlist",
): Promise<{ id: string }> {
  const shortlist = await dbRetry(() =>
    prisma.shortlist.create({
      data: { roleId, employerId, name },
    })
  );

  audit("shortlist.created", {
    detail: `role:${roleId} employer:${employerId} shortlist:${shortlist.id}`,
  });

  return { id: shortlist.id };
}

/* # Add a candidate match to a shortlist */
export async function addToShortlist(
  shortlistId: string,
  candidateMatchId: string,
  employerNote?: string,
): Promise<boolean> {
  /* # Get the next position number */
  const lastEntry = await dbRetry(() =>
    prisma.shortlistEntry.findFirst({
      where: { shortlistId },
      orderBy: { position: "desc" },
      select: { position: true },
    })
  );

  const nextPosition = (lastEntry?.position ?? 0) + 1;

  try {
    await dbRetry(() =>
      prisma.shortlistEntry.create({
        data: {
          shortlistId,
          candidateMatchId,
          position: nextPosition,
          employerNote: employerNote ?? null,
        },
      })
    );

    /* # Update candidate match status to shortlisted */
    await prisma.candidateMatch.updateMany({
      where: { id: candidateMatchId, status: { in: ["new", "matched"] } },
      data: { status: "shortlisted" },
    }).catch(() => {});

    audit("shortlist.entry.added", {
      detail: `shortlist:${shortlistId} match:${candidateMatchId}`,
    });

    return true;
  } catch {
    /* # Unique constraint violation — already in shortlist */
    return false;
  }
}

/* # Remove a candidate match from a shortlist */
export async function removeFromShortlist(
  shortlistId: string,
  candidateMatchId: string,
): Promise<boolean> {
  const result = await dbRetry(() =>
    prisma.shortlistEntry.deleteMany({
      where: { shortlistId, candidateMatchId },
    })
  );

  if (result.count > 0) {
    audit("shortlist.entry.removed", {
      detail: `shortlist:${shortlistId} match:${candidateMatchId}`,
    });
  }

  return result.count > 0;
}

/* # Deliver a shortlist — mark as delivered and notify employer */
export async function deliverShortlist(
  shortlistId: string,
): Promise<boolean> {
  const shortlist = await dbRetry(() =>
    prisma.shortlist.findUnique({
      where: { id: shortlistId },
      include: {
        entries: { include: { shortlist: true } },
        role: { select: { title: true, employerId: true } },
      },
    })
  );

  if (!shortlist) return false;

  /* # Update status */
  await dbRetry(() =>
    prisma.shortlist.update({
      where: { id: shortlistId },
      data: { status: "delivered", deliveredAt: new Date() },
    })
  );

  audit("shortlist.delivered", {
    detail: `shortlist:${shortlistId} role:${shortlist.roleId} entries:${shortlist.entries.length}`,
  });

  /* # Notify all employer members */
  const members = await prisma.employerMember.findMany({
    where: { employerId: shortlist.role.employerId },
    select: { userId: true },
  });

  for (const member of members) {
    await notify(
      member.userId,
      "match",
      `Shortlist delivered for "${shortlist.role.title}"`,
      {
        body: `${shortlist.entries.length} candidates ready for review.`,
        linkUrl: `/employer/${shortlist.role.employerId}/roles`,
      },
    ).catch(() => {});
  }

  return true;
}

/* # Get a shortlist with full candidate details for export */
export async function getShortlistForExport(shortlistId: string) {
  const shortlist = await dbRetry(() =>
    prisma.shortlist.findUnique({
      where: { id: shortlistId },
      include: {
        role: {
          select: { title: true, employerId: true },
        },
        entries: {
          orderBy: { position: "asc" },
        },
      },
    })
  );

  if (!shortlist) return null;

  /* # Fetch candidate match details for each entry */
  const matchIds = shortlist.entries.map((e) => e.candidateMatchId);
  const matches = await dbRetry(() =>
    prisma.candidateMatch.findMany({
      where: { id: { in: matchIds } },
      include: {
        externalCandidate: {
          select: {
            name: true,
            email: true,
            profileUrl: true,
            source: true,
            skills: true,
          },
        },
      },
    })
  );

  const matchMap = Object.fromEntries(matches.map((m) => [m.id, m]));

  /* # Build export data */
  const entries = shortlist.entries.map((entry) => {
    const match = matchMap[entry.candidateMatchId];
    return {
      position: entry.position,
      employerNote: entry.employerNote,
      score: match?.score ?? 0,
      source: match?.source ?? "unknown",
      status: match?.status ?? "unknown",
      breakdown: match?.breakdown ? JSON.parse(match.breakdown) : null,
      matchedSkills: match?.matchedSkills ? JSON.parse(match.matchedSkills) : [],
      missingSkills: match?.missingSkills ? JSON.parse(match.missingSkills) : [],
      candidate: match?.candidateId
        ? { type: "internal", id: match.candidateId }
        : match?.externalCandidate
          ? {
              type: "external",
              name: match.externalCandidate.name,
              email: match.externalCandidate.email,
              profileUrl: match.externalCandidate.profileUrl,
              source: match.externalCandidate.source,
              skills: match.externalCandidate.skills
                ? JSON.parse(match.externalCandidate.skills)
                : [],
            }
          : null,
    };
  });

  return {
    id: shortlist.id,
    name: shortlist.name,
    roleTitle: shortlist.role.title,
    status: shortlist.status,
    deliveredAt: shortlist.deliveredAt,
    createdAt: shortlist.createdAt,
    entries,
  };
}
