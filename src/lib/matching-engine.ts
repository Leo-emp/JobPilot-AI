/* ============================================================
   AI MATCHING ENGINE — Core candidate-to-role matching logic
   ============================================================
   Scores candidates against roles using multiple signals:
   - Skills overlap (required + nice-to-have)
   - Location compatibility
   - Salary alignment
   - Experience fit
   - Employment type match
   - Industry relevance

   Returns a normalized 0-100 score with breakdown.
   ============================================================ */

/* # Match result for a single candidate-role pair */
export interface MatchScore {
  total: number;                  // # 0-100 overall fit score
  breakdown: {
    skills: number;               // # 0-30 — required skills overlap
    bonusSkills: number;          // # 0-10 — nice-to-have skills overlap
    location: number;             // # 0-20 — location type compatibility
    salary: number;               // # 0-15 — salary expectations alignment
    experience: number;           // # 0-15 — experience range fit
    employmentType: number;       // # 0-5 — employment type match
    industry: number;             // # 0-5 — industry relevance
  };
  matchedSkills: string[];        // # Skills that matched
  missingSkills: string[];        // # Required skills the candidate lacks
}

/* # Candidate data needed for matching */
export interface CandidateProfile {
  skills: string[];               // # From resume analysis or manual input
  desiredTitle: string | null;
  locationPref: string;           // # remote, hybrid, onsite, any
  locations: string[];            // # Specific locations if applicable
  salaryMin: number | null;
  salaryCurrency: string;
  employmentType: string;         // # full-time, part-time, contract, any
  industries: string[];           // # Preferred industries
  experienceYears: number | null; // # Estimated from resume
}

/* # Role data needed for matching */
export interface RoleProfile {
  title: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  locationType: string;           // # remote, hybrid, onsite
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  experienceMin: number | null;
  experienceMax: number | null;
  employmentType: string;
  industry: string | null;
}

/* # Normalize a string for comparison (lowercase, trim, collapse whitespace) */
function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

/* # Parse a JSON string array safely */
export function parseSkills(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/* # Calculate skills overlap score */
function scoreSkills(
  candidateSkills: string[],
  requiredSkills: string[],
  maxPoints: number
): { score: number; matched: string[]; missing: string[] } {
  if (requiredSkills.length === 0) return { score: maxPoints, matched: [], missing: [] };

  const candidateSet = new Set(candidateSkills.map(normalize));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    const normalizedSkill = normalize(skill);
    /* # Check for exact match or partial containment */
    const found = candidateSet.has(normalizedSkill) ||
      [...candidateSet].some(cs =>
        cs.includes(normalizedSkill) || normalizedSkill.includes(cs)
      );

    if (found) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const ratio = matched.length / requiredSkills.length;
  return {
    score: Math.round(ratio * maxPoints),
    matched,
    missing,
  };
}

/* # Score location compatibility */
function scoreLocation(
  candidatePref: string,
  candidateLocations: string[],
  roleType: string,
  roleLocation: string | null
): number {
  const MAX = 20;

  /* # "any" preference always scores full */
  if (candidatePref === "any") return MAX;

  /* # Remote role matches everything */
  if (roleType === "remote") return MAX;

  /* # Direct preference match */
  if (candidatePref === roleType) {
    /* # If onsite/hybrid, check location overlap */
    if (roleLocation && candidateLocations.length > 0) {
      const roleLoc = normalize(roleLocation);
      const locationMatch = candidateLocations.some(cl =>
        normalize(cl).includes(roleLoc) || roleLoc.includes(normalize(cl))
      );
      return locationMatch ? MAX : Math.round(MAX * 0.5);
    }
    return MAX;
  }

  /* # Partial match: candidate wants remote but role is hybrid */
  if (candidatePref === "remote" && roleType === "hybrid") return Math.round(MAX * 0.4);

  /* # Candidate wants hybrid, role is onsite — partial */
  if (candidatePref === "hybrid" && roleType === "onsite") return Math.round(MAX * 0.3);

  /* # No match */
  return 0;
}

/* # Score salary alignment */
function scoreSalary(
  candidateMin: number | null,
  roleMin: number | null,
  roleMax: number | null
): number {
  const MAX = 15;

  /* # No salary data on either side — neutral */
  if (!candidateMin || (!roleMin && !roleMax)) return Math.round(MAX * 0.5);

  /* # Role max is below candidate minimum — poor fit */
  if (roleMax && candidateMin > roleMax) {
    const gap = (candidateMin - roleMax) / candidateMin;
    if (gap > 0.3) return 0;
    return Math.round(MAX * (1 - gap) * 0.5);
  }

  /* # Candidate expectation within role range — great fit */
  if (roleMin && roleMax && candidateMin >= roleMin && candidateMin <= roleMax) return MAX;

  /* # Candidate below role range — they'd be happy */
  if (roleMin && candidateMin < roleMin) return MAX;

  /* # Some overlap */
  return Math.round(MAX * 0.7);
}

/* # Score experience fit */
function scoreExperience(
  candidateYears: number | null,
  roleMin: number | null,
  roleMax: number | null
): number {
  const MAX = 15;

  if (candidateYears === null || (roleMin === null && roleMax === null)) {
    return Math.round(MAX * 0.5);
  }

  /* # Within range — perfect */
  if (
    (roleMin === null || candidateYears >= roleMin) &&
    (roleMax === null || candidateYears <= roleMax)
  ) {
    return MAX;
  }

  /* # Slightly under minimum — still viable */
  if (roleMin !== null && candidateYears < roleMin) {
    const gap = roleMin - candidateYears;
    if (gap <= 1) return Math.round(MAX * 0.8);
    if (gap <= 2) return Math.round(MAX * 0.5);
    return Math.round(MAX * 0.2);
  }

  /* # Over maximum — overqualified but may still work */
  if (roleMax !== null && candidateYears > roleMax) {
    const gap = candidateYears - roleMax;
    if (gap <= 2) return Math.round(MAX * 0.7);
    if (gap <= 5) return Math.round(MAX * 0.4);
    return Math.round(MAX * 0.2);
  }

  return Math.round(MAX * 0.5);
}

/* # Score employment type match */
function scoreEmploymentType(
  candidatePref: string,
  roleType: string
): number {
  if (candidatePref === "any" || candidatePref === roleType) return 5;
  return 0;
}

/* # Score industry relevance */
function scoreIndustry(
  candidateIndustries: string[],
  roleIndustry: string | null
): number {
  if (!roleIndustry || candidateIndustries.length === 0) return 3;

  const normalizedRole = normalize(roleIndustry);
  const match = candidateIndustries.some(ci =>
    normalize(ci).includes(normalizedRole) || normalizedRole.includes(normalize(ci))
  );

  return match ? 5 : 1;
}

/* # Main matching function — calculate overall fit score */
export function calculateMatchScore(
  candidate: CandidateProfile,
  role: RoleProfile
): MatchScore {
  /* # Score each dimension */
  const skillsResult = scoreSkills(candidate.skills, role.requiredSkills, 30);
  const bonusResult = scoreSkills(candidate.skills, role.niceToHaveSkills, 10);

  const locationScore = scoreLocation(
    candidate.locationPref,
    candidate.locations,
    role.locationType,
    role.location
  );

  const salaryScore = scoreSalary(
    candidate.salaryMin,
    role.salaryMin,
    role.salaryMax
  );

  const experienceScore = scoreExperience(
    candidate.experienceYears,
    role.experienceMin,
    role.experienceMax
  );

  const employmentScore = scoreEmploymentType(
    candidate.employmentType,
    role.employmentType
  );

  const industryScore = scoreIndustry(
    candidate.industries,
    role.industry
  );

  /* # Sum all scores */
  const total = skillsResult.score + bonusResult.score + locationScore +
    salaryScore + experienceScore + employmentScore + industryScore;

  return {
    total: Math.min(100, total),
    breakdown: {
      skills: skillsResult.score,
      bonusSkills: bonusResult.score,
      location: locationScore,
      salary: salaryScore,
      experience: experienceScore,
      employmentType: employmentScore,
      industry: industryScore,
    },
    matchedSkills: [...skillsResult.matched, ...bonusResult.matched],
    missingSkills: skillsResult.missing,
  };
}
