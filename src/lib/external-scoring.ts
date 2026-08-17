/* ============================================================
   EXTERNAL CANDIDATE SCORING — Score external profiles
   ============================================================
   Adapts the core matching engine to score external candidates
   (GitHub, Stack Overflow, portfolio) against role requirements.

   External candidates don't have CandidatePreference records,
   so we build a synthetic CandidateProfile from their extracted
   profile data and run it through the same calculateMatchScore.
   ============================================================ */

import {
  calculateMatchScore,
  type CandidateProfile,
  type RoleProfile,
  type MatchScore,
  parseSkills,
} from "@/lib/matching-engine";
import type { GitHubProfile } from "@/lib/github-sourcing";
import type { StackOverflowProfile } from "@/lib/stackoverflow-sourcing";
import type { PortfolioProfile } from "@/lib/portfolio-sourcing";

/* # Build a CandidateProfile from a GitHub profile */
export function buildGitHubCandidateProfile(
  profile: GitHubProfile,
): CandidateProfile {
  /* # Map GitHub languages + bio keywords to skills */
  const skills = [
    ...profile.languages.map((l) => l.toLowerCase()),
  ];

  /* # Extract additional skills from top repo descriptions */
  const repoKeywords = profile.topRepos
    .flatMap((r) => {
      const words: string[] = [];
      if (r.language) words.push(r.language.toLowerCase());
      if (r.description) {
        /* # Look for common tech keywords in repo descriptions */
        const matches = r.description.match(
          /\b(react|vue|angular|next\.?js|express|django|flask|fastapi|spring|docker|kubernetes|aws|gcp|azure|node\.?js|graphql|rest|mongodb|postgres|redis|tailwind|svelte)\b/gi,
        );
        if (matches) words.push(...matches.map((m) => m.toLowerCase()));
      }
      return words;
    });

  /* # Deduplicate skills */
  const allSkills = [...new Set([...skills, ...repoKeywords])];

  return {
    skills: allSkills,
    desiredTitle: null,
    locationPref: profile.location ? "any" : "remote",
    locations: profile.location ? [profile.location] : [],
    salaryMin: null,
    salaryCurrency: "USD",
    employmentType: "full-time",
    industries: [],
    experienceYears: null,
  };
}

/* # Build a CandidateProfile from a Stack Overflow profile */
export function buildSOCandidateProfile(
  profile: StackOverflowProfile,
): CandidateProfile {
  return {
    skills: profile.topTags.map((t) => t.toLowerCase()),
    desiredTitle: null,
    locationPref: profile.location ? "any" : "remote",
    locations: profile.location ? [profile.location] : [],
    salaryMin: null,
    salaryCurrency: "USD",
    employmentType: "full-time",
    industries: [],
    experienceYears: null,
  };
}

/* # Build a CandidateProfile from a portfolio profile */
export function buildPortfolioCandidateProfile(
  profile: PortfolioProfile,
): CandidateProfile {
  /* # Combine direct skills + project technologies */
  const projectSkills = profile.projects.flatMap((p) =>
    p.technologies.map((t) => t.toLowerCase()),
  );
  const allSkills = [...new Set([
    ...profile.skills.map((s) => s.toLowerCase()),
    ...projectSkills,
  ])];

  return {
    skills: allSkills,
    desiredTitle: null,
    locationPref: profile.location ? "any" : "remote",
    locations: profile.location ? [profile.location] : [],
    salaryMin: null,
    salaryCurrency: "USD",
    employmentType: "full-time",
    industries: [],
    experienceYears: null,
  };
}

/* # Build a RoleProfile from a Prisma Role record */
export function buildRoleProfileForScoring(role: {
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

/* # Score a GitHub profile against a role */
export function scoreGitHubCandidate(
  profile: GitHubProfile,
  roleProfile: RoleProfile,
): MatchScore {
  const candidateProfile = buildGitHubCandidateProfile(profile);
  return calculateMatchScore(candidateProfile, roleProfile);
}

/* # Score a Stack Overflow profile against a role */
export function scoreSOCandidate(
  profile: StackOverflowProfile,
  roleProfile: RoleProfile,
): MatchScore {
  const candidateProfile = buildSOCandidateProfile(profile);
  return calculateMatchScore(candidateProfile, roleProfile);
}

/* # Score a portfolio profile against a role */
export function scorePortfolioCandidate(
  profile: PortfolioProfile,
  roleProfile: RoleProfile,
): MatchScore {
  const candidateProfile = buildPortfolioCandidateProfile(profile);
  return calculateMatchScore(candidateProfile, roleProfile);
}
