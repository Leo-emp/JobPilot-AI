/* ============================================================
   BATCH MATCHING — Persist match results to the database
   ============================================================
   Two main flows:
   1. matchRoleToAllCandidates — When a role is published,
      score all open-to-work candidates and persist matches.
   2. matchCandidateToAllRoles — When a candidate updates
      preferences, re-score against all active roles.

   Both use the core calculateMatchScore engine and write
   CandidateMatch records with upsert (idempotent).
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import {
  calculateMatchScore,
  parseSkills,
  type CandidateProfile,
  type RoleProfile,
} from "@/lib/matching-engine";

/* # Minimum score to persist a match (below this is noise) */
const MIN_MATCH_SCORE = 15;

/* # Build a RoleProfile from a Prisma Role record */
function buildRoleProfile(role: {
  title: string;
  skills: string | null;
  niceToHaveSkills: string | null;
  locationType: string;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  experienceMin: number | null;
  experienceMax: number | null;
  employmentType: string;
  industry: string | null;
}): RoleProfile {
  return {
    title: role.title,
    requiredSkills: parseSkills(role.skills),
    niceToHaveSkills: parseSkills(role.niceToHaveSkills),
    locationType: role.locationType,
    location: role.location,
    salaryMin: role.salaryMin,
    salaryMax: role.salaryMax,
    salaryCurrency: role.salaryCurrency,
    experienceMin: role.experienceMin,
    experienceMax: role.experienceMax,
    employmentType: role.employmentType,
    industry: role.industry,
  };
}

/* # Build a CandidateProfile from a Prisma CandidatePreference */
function buildCandidateProfile(pref: {
  desiredSkills: string | null;
  desiredTitle: string | null;
  locationPref: string;
  locations: string | null;
  salaryMin: number | null;
  salaryCurrency: string;
  employmentType: string;
  industries: string | null;
}): CandidateProfile {
  return {
    skills: parseSkills(pref.desiredSkills),
    desiredTitle: pref.desiredTitle,
    locationPref: pref.locationPref,
    locations: parseSkills(pref.locations),
    salaryMin: pref.salaryMin,
    salaryCurrency: pref.salaryCurrency,
    employmentType: pref.employmentType,
    industries: parseSkills(pref.industries),
    experienceYears: null, // # Phase 5+: extract from resume
  };
}

/* # Match a role against all open-to-work candidates and persist results */
export async function matchRoleToAllCandidates(roleId: string): Promise<{
  matched: number;
  skipped: number;
}> {
  /* # Fetch the role */
  const role = await dbRetry(() =>
    prisma.role.findUnique({ where: { id: roleId } })
  );
  if (!role) return { matched: 0, skipped: 0 };

  const roleProfile = buildRoleProfile(role);

  /* # Fetch all open-to-work candidates with at least one resume */
  const candidates = await dbRetry(() =>
    prisma.candidatePreference.findMany({
      where: { openToWork: true },
      include: {
        user: {
          select: {
            id: true,
            _count: { select: { resumes: true } },
          },
        },
      },
    })
  );

  /* # Only candidates with at least 1 resume */
  const active = candidates.filter(c => c.user._count.resumes > 0);

  let matched = 0;
  let skipped = 0;

  /* # Score and persist each match */
  for (const pref of active) {
    const candidateProfile = buildCandidateProfile(pref);
    const result = calculateMatchScore(candidateProfile, roleProfile);

    if (result.total < MIN_MATCH_SCORE) {
      skipped++;
      continue;
    }

    /* # Upsert — updates score if match already exists */
    await dbRetry(() =>
      prisma.candidateMatch.upsert({
        where: {
          candidateId_roleId: {
            candidateId: pref.user.id,
            roleId: role.id,
          },
        },
        create: {
          candidateId: pref.user.id,
          roleId: role.id,
          prefId: pref.id,
          score: result.total,
          breakdown: JSON.stringify(result.breakdown),
          matchedSkills: JSON.stringify(result.matchedSkills),
          missingSkills: JSON.stringify(result.missingSkills),
        },
        update: {
          score: result.total,
          breakdown: JSON.stringify(result.breakdown),
          matchedSkills: JSON.stringify(result.matchedSkills),
          missingSkills: JSON.stringify(result.missingSkills),
          prefId: pref.id,
        },
      })
    );
    matched++;
  }

  return { matched, skipped };
}

/* # Match a candidate against all active roles and persist results */
export async function matchCandidateToAllRoles(userId: string): Promise<{
  matched: number;
  skipped: number;
}> {
  /* # Fetch candidate preferences */
  const pref = await dbRetry(() =>
    prisma.candidatePreference.findUnique({
      where: { userId },
    })
  );
  if (!pref || !pref.openToWork) return { matched: 0, skipped: 0 };

  const candidateProfile = buildCandidateProfile(pref);

  /* # Fetch all active roles */
  const roles = await dbRetry(() =>
    prisma.role.findMany({
      where: { status: "active" },
    })
  );

  let matched = 0;
  let skipped = 0;

  for (const role of roles) {
    const roleProfile = buildRoleProfile(role);
    const result = calculateMatchScore(candidateProfile, roleProfile);

    if (result.total < MIN_MATCH_SCORE) {
      skipped++;
      continue;
    }

    await dbRetry(() =>
      prisma.candidateMatch.upsert({
        where: {
          candidateId_roleId: {
            candidateId: userId,
            roleId: role.id,
          },
        },
        create: {
          candidateId: userId,
          roleId: role.id,
          prefId: pref.id,
          score: result.total,
          breakdown: JSON.stringify(result.breakdown),
          matchedSkills: JSON.stringify(result.matchedSkills),
          missingSkills: JSON.stringify(result.missingSkills),
        },
        update: {
          score: result.total,
          breakdown: JSON.stringify(result.breakdown),
          matchedSkills: JSON.stringify(result.matchedSkills),
          missingSkills: JSON.stringify(result.missingSkills),
          prefId: pref.id,
        },
      })
    );
    matched++;
  }

  return { matched, skipped };
}
