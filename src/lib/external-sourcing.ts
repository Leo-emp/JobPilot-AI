/* ============================================================
   EXTERNAL SOURCING — Orchestrator for finding external candidates
   ============================================================
   Coordinates GitHub, Stack Overflow, and portfolio sourcing
   for a given role. The flow:

   1. Check if role has enough internal matches (score >= 70)
   2. If not, generate search queries from role requirements
   3. Fetch profiles from each source in parallel
   4. Deduplicate against existing ExternalCandidate records
   5. Score each profile against the role
   6. Persist top matches as ExternalCandidate + CandidateMatch

   Called by:
   - /api/cron/source-external (batch — all active roles)
   - /api/employer/[empId]/roles/[roleId]/sourcing (on-demand)
   ============================================================ */

import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { parseSkills } from "@/lib/matching-engine";
import {
  buildGitHubSearchQuery,
  searchGitHubUsers,
  type GitHubProfile,
} from "@/lib/github-sourcing";
import {
  searchStackOverflowUsers,
  type StackOverflowProfile,
} from "@/lib/stackoverflow-sourcing";
import {
  findPortfolioCandidates,
  type PortfolioProfile,
} from "@/lib/portfolio-sourcing";
import {
  scoreGitHubCandidate,
  scoreSOCandidate,
  scorePortfolioCandidate,
  buildRoleProfileForScoring,
} from "@/lib/external-scoring";

/* # Minimum internal matches (score >= 70) before external sourcing triggers */
const MIN_QUALITY_MATCHES = 5;

/* # Minimum score to persist an external match */
const MIN_EXTERNAL_SCORE = 30;

/* # Maximum external candidates to store per role per source */
const MAX_PER_SOURCE = 10;

/* # Result of a sourcing run for a single role */
export interface SourcingResult {
  roleId: string;
  roleTitle: string;
  internalMatches: number;
  externalFound: {
    github: number;
    stackoverflow: number;
    portfolio: number;
  };
  totalPersisted: number;
  skippedDuplicate: number;
}

/* # Check if a role needs external sourcing */
export async function roleNeedsExternalSourcing(
  roleId: string,
): Promise<boolean> {
  /* # Count internal matches with score >= 70 */
  const qualityMatches = await dbRetry(() =>
    prisma.candidateMatch.count({
      where: {
        roleId,
        score: { gte: 70 },
        source: "internal",
      },
    })
  );

  return qualityMatches < MIN_QUALITY_MATCHES;
}

/* # Run external sourcing for a single role */
export async function sourceExternalCandidates(
  roleId: string,
): Promise<SourcingResult> {
  /* # Fetch the role with all fields needed for scoring */
  const role = await dbRetry(() =>
    prisma.role.findUnique({ where: { id: roleId } })
  );

  if (!role || role.status !== "active") {
    return {
      roleId,
      roleTitle: role?.title ?? "Unknown",
      internalMatches: 0,
      externalFound: { github: 0, stackoverflow: 0, portfolio: 0 },
      totalPersisted: 0,
      skippedDuplicate: 0,
    };
  }

  const roleProfile = buildRoleProfileForScoring(role);
  const skills = parseSkills(role.skills);

  /* # Count existing internal matches for the result */
  const internalMatches = await dbRetry(() =>
    prisma.candidateMatch.count({
      where: { roleId, source: "internal", score: { gte: 70 } },
    })
  );

  /* # Fetch from all sources in parallel */
  const [githubProfiles, soProfiles, portfolioProfiles] = await Promise.all([
    searchGitHubUsers(
      buildGitHubSearchQuery(skills, role.location),
      MAX_PER_SOURCE * 2,
    ).catch(() => [] as GitHubProfile[]),
    searchStackOverflowUsers(skills, MAX_PER_SOURCE * 2).catch(
      () => [] as StackOverflowProfile[],
    ),
    findPortfolioCandidates(
      role.title,
      skills,
      role.location,
      MAX_PER_SOURCE,
    ).catch(() => [] as PortfolioProfile[]),
  ]);

  let totalPersisted = 0;
  let skippedDuplicate = 0;

  /* # Process GitHub profiles */
  const githubPersisted = await processGitHubProfiles(
    githubProfiles,
    roleId,
    roleProfile,
  );
  totalPersisted += githubPersisted.persisted;
  skippedDuplicate += githubPersisted.duplicates;

  /* # Process Stack Overflow profiles */
  const soPersisted = await processSOProfiles(
    soProfiles,
    roleId,
    roleProfile,
  );
  totalPersisted += soPersisted.persisted;
  skippedDuplicate += soPersisted.duplicates;

  /* # Process portfolio profiles */
  const portfolioPersisted = await processPortfolioProfiles(
    portfolioProfiles,
    roleId,
    roleProfile,
  );
  totalPersisted += portfolioPersisted.persisted;
  skippedDuplicate += portfolioPersisted.duplicates;

  return {
    roleId,
    roleTitle: role.title,
    internalMatches,
    externalFound: {
      github: githubProfiles.length,
      stackoverflow: soProfiles.length,
      portfolio: portfolioProfiles.length,
    },
    totalPersisted,
    skippedDuplicate,
  };
}

/* # Process and persist GitHub profiles */
async function processGitHubProfiles(
  profiles: GitHubProfile[],
  roleId: string,
  roleProfile: ReturnType<typeof buildRoleProfileForScoring>,
): Promise<{ persisted: number; duplicates: number }> {
  let persisted = 0;
  let duplicates = 0;

  for (const profile of profiles.slice(0, MAX_PER_SOURCE)) {
    const score = scoreGitHubCandidate(profile, roleProfile);
    if (score.total < MIN_EXTERNAL_SCORE) continue;

    /* # Check for existing User with same email (skip if already internal) */
    if (profile.email) {
      const existingUser = await prisma.user.findFirst({
        where: { email: profile.email },
      });
      if (existingUser) {
        duplicates++;
        continue;
      }
    }

    /* # Upsert ExternalCandidate — dedup by source + profileUrl */
    const external = await dbRetry(() =>
      prisma.externalCandidate.upsert({
        where: {
          source_profileUrl: {
            source: "github",
            profileUrl: profile.profileUrl,
          },
        },
        create: {
          name: profile.name ?? profile.login,
          email: profile.email,
          profileUrl: profile.profileUrl,
          source: "github",
          skills: JSON.stringify(profile.languages),
          experience: JSON.stringify({
            repos: profile.publicRepos,
            followers: profile.followers,
            bio: profile.bio,
          }),
          rawData: JSON.stringify(profile),
        },
        update: {
          /* # Update skills/experience on re-fetch */
          skills: JSON.stringify(profile.languages),
          experience: JSON.stringify({
            repos: profile.publicRepos,
            followers: profile.followers,
            bio: profile.bio,
          }),
        },
      })
    );

    /* # Create CandidateMatch for this role + external candidate */
    await upsertExternalMatch(external.id, roleId, score, "github");
    persisted++;
  }

  return { persisted, duplicates };
}

/* # Process and persist Stack Overflow profiles */
async function processSOProfiles(
  profiles: StackOverflowProfile[],
  roleId: string,
  roleProfile: ReturnType<typeof buildRoleProfileForScoring>,
): Promise<{ persisted: number; duplicates: number }> {
  let persisted = 0;
  let duplicates = 0;

  for (const profile of profiles.slice(0, MAX_PER_SOURCE)) {
    const score = scoreSOCandidate(profile, roleProfile);
    if (score.total < MIN_EXTERNAL_SCORE) continue;

    /* # Upsert ExternalCandidate */
    const external = await dbRetry(() =>
      prisma.externalCandidate.upsert({
        where: {
          source_profileUrl: {
            source: "stackoverflow",
            profileUrl: profile.profileUrl,
          },
        },
        create: {
          name: profile.displayName,
          email: null,
          profileUrl: profile.profileUrl,
          source: "stackoverflow",
          skills: JSON.stringify(profile.topTags),
          experience: JSON.stringify({
            reputation: profile.reputation,
            answers: profile.answerCount,
            questions: profile.questionCount,
          }),
          rawData: JSON.stringify(profile),
        },
        update: {
          skills: JSON.stringify(profile.topTags),
          experience: JSON.stringify({
            reputation: profile.reputation,
            answers: profile.answerCount,
          }),
        },
      })
    );

    await upsertExternalMatch(external.id, roleId, score, "stackoverflow");
    persisted++;
  }

  return { persisted, duplicates };
}

/* # Process and persist portfolio profiles */
async function processPortfolioProfiles(
  profiles: PortfolioProfile[],
  roleId: string,
  roleProfile: ReturnType<typeof buildRoleProfileForScoring>,
): Promise<{ persisted: number; duplicates: number }> {
  let persisted = 0;
  let duplicates = 0;

  for (const profile of profiles.slice(0, MAX_PER_SOURCE)) {
    const score = scorePortfolioCandidate(profile, roleProfile);
    if (score.total < MIN_EXTERNAL_SCORE) continue;

    /* # Check for existing User with same email */
    if (profile.email) {
      const existingUser = await prisma.user.findFirst({
        where: { email: profile.email },
      });
      if (existingUser) {
        duplicates++;
        continue;
      }
    }

    /* # Upsert ExternalCandidate */
    const external = await dbRetry(() =>
      prisma.externalCandidate.upsert({
        where: {
          source_profileUrl: {
            source: "portfolio",
            profileUrl: profile.portfolioUrl,
          },
        },
        create: {
          name: profile.name,
          email: profile.email,
          profileUrl: profile.portfolioUrl,
          source: "portfolio",
          skills: JSON.stringify(profile.skills),
          experience: JSON.stringify({
            bio: profile.bio,
            projects: profile.projects,
            location: profile.location,
          }),
          rawData: JSON.stringify(profile),
        },
        update: {
          skills: JSON.stringify(profile.skills),
          experience: JSON.stringify({
            bio: profile.bio,
            projects: profile.projects,
          }),
        },
      })
    );

    await upsertExternalMatch(external.id, roleId, score, "portfolio");
    persisted++;
  }

  return { persisted, duplicates };
}

/* # Upsert a CandidateMatch record for an external candidate */
async function upsertExternalMatch(
  externalId: string,
  roleId: string,
  score: ReturnType<typeof scoreGitHubCandidate>,
  source: string,
): Promise<void> {
  /* # Check if match already exists — can't use upsert with nullable compound key */
  const existing = await dbRetry(() =>
    prisma.candidateMatch.findFirst({
      where: { roleId, externalId },
    })
  );

  if (existing) {
    /* # Update the score if it changed */
    await dbRetry(() =>
      prisma.candidateMatch.update({
        where: { id: existing.id },
        data: {
          score: score.total,
          breakdown: JSON.stringify(score.breakdown),
          matchedSkills: JSON.stringify(score.matchedSkills),
          missingSkills: JSON.stringify(score.missingSkills),
        },
      })
    );
  } else {
    /* # Create new external match */
    await dbRetry(() =>
      prisma.candidateMatch.create({
        data: {
          externalId,
          roleId,
          candidateId: null,
          prefId: null,
          score: score.total,
          breakdown: JSON.stringify(score.breakdown),
          matchedSkills: JSON.stringify(score.matchedSkills),
          missingSkills: JSON.stringify(score.missingSkills),
          source,
        },
      })
    );
  }
}
