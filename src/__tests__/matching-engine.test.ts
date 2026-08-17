/* ============================================================
   MATCHING ENGINE — Unit tests
   ============================================================
   Tests the core matching algorithm: skill scoring, location,
   salary, experience, employment type, and industry matching.
   ============================================================ */

import { describe, it, expect } from "vitest";
import {
  calculateMatchScore,
  parseSkills,
  type CandidateProfile,
  type RoleProfile,
} from "@/lib/matching-engine";

/* # Helper to build a base candidate profile */
function makeCandidate(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
  return {
    skills: ["JavaScript", "React", "Node.js"],
    desiredTitle: "Frontend Developer",
    locationPref: "remote",
    locations: [],
    salaryMin: 80000,
    salaryCurrency: "USD",
    employmentType: "full-time",
    industries: ["Technology"],
    experienceYears: 5,
    ...overrides,
  };
}

/* # Helper to build a base role profile */
function makeRole(overrides: Partial<RoleProfile> = {}): RoleProfile {
  return {
    title: "Frontend Engineer",
    requiredSkills: ["JavaScript", "React", "TypeScript"],
    niceToHaveSkills: ["Next.js", "Tailwind"],
    locationType: "remote",
    location: null,
    salaryMin: 70000,
    salaryMax: 120000,
    salaryCurrency: "USD",
    experienceMin: 3,
    experienceMax: 7,
    employmentType: "full-time",
    industry: "Technology",
    ...overrides,
  };
}

/* ============================================================
   parseSkills
   ============================================================ */

describe("parseSkills", () => {
  it("parses valid JSON array", () => {
    expect(parseSkills('["React","Node.js"]')).toEqual(["React", "Node.js"]);
  });

  it("returns empty array for null", () => {
    expect(parseSkills(null)).toEqual([]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseSkills("not json")).toEqual([]);
  });

  it("returns empty array for non-array JSON", () => {
    expect(parseSkills('{"key":"val"}')).toEqual([]);
  });

  it("coerces numbers to strings", () => {
    expect(parseSkills("[1,2,3]")).toEqual(["1", "2", "3"]);
  });
});

/* ============================================================
   calculateMatchScore — Overall
   ============================================================ */

describe("calculateMatchScore", () => {
  it("returns a score between 0 and 100", () => {
    const result = calculateMatchScore(makeCandidate(), makeRole());
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("returns breakdown with all dimensions", () => {
    const result = calculateMatchScore(makeCandidate(), makeRole());
    expect(result.breakdown).toHaveProperty("skills");
    expect(result.breakdown).toHaveProperty("bonusSkills");
    expect(result.breakdown).toHaveProperty("location");
    expect(result.breakdown).toHaveProperty("salary");
    expect(result.breakdown).toHaveProperty("experience");
    expect(result.breakdown).toHaveProperty("employmentType");
    expect(result.breakdown).toHaveProperty("industry");
  });

  it("returns matched and missing skills arrays", () => {
    const result = calculateMatchScore(makeCandidate(), makeRole());
    expect(Array.isArray(result.matchedSkills)).toBe(true);
    expect(Array.isArray(result.missingSkills)).toBe(true);
  });

  /* # Perfect match should score very high */
  it("scores high for a strong match", () => {
    const candidate = makeCandidate({
      skills: ["JavaScript", "React", "TypeScript", "Next.js", "Tailwind"],
      experienceYears: 5,
    });
    const role = makeRole();
    const result = calculateMatchScore(candidate, role);
    expect(result.total).toBeGreaterThanOrEqual(85);
  });

  /* # Complete mismatch should score low */
  it("scores low for a poor match", () => {
    const candidate = makeCandidate({
      skills: ["Python", "Django"],
      locationPref: "onsite",
      locations: ["Tokyo"],
      salaryMin: 200000,
      employmentType: "contract",
      industries: ["Agriculture"],
      experienceYears: 0,
    });
    const role = makeRole({
      locationType: "onsite",
      location: "New York",
    });
    const result = calculateMatchScore(candidate, role);
    expect(result.total).toBeLessThan(30);
  });
});

/* ============================================================
   Skills scoring
   ============================================================ */

describe("skills scoring", () => {
  it("gives full required skill score when all match", () => {
    const candidate = makeCandidate({
      skills: ["JavaScript", "React", "TypeScript"],
    });
    const result = calculateMatchScore(candidate, makeRole());
    expect(result.breakdown.skills).toBe(30);
    expect(result.missingSkills).toHaveLength(0);
  });

  it("gives partial required skill score when some match", () => {
    const candidate = makeCandidate({
      skills: ["JavaScript"],
    });
    const result = calculateMatchScore(candidate, makeRole());
    expect(result.breakdown.skills).toBeGreaterThan(0);
    expect(result.breakdown.skills).toBeLessThan(30);
    expect(result.missingSkills.length).toBeGreaterThan(0);
  });

  it("gives zero for no skill overlap", () => {
    const candidate = makeCandidate({ skills: ["Python", "Django"] });
    const result = calculateMatchScore(candidate, makeRole());
    expect(result.breakdown.skills).toBe(0);
  });

  it("gives full score when role has no required skills", () => {
    const role = makeRole({ requiredSkills: [] });
    const result = calculateMatchScore(makeCandidate(), role);
    expect(result.breakdown.skills).toBe(30);
  });

  /* # Partial text matching (e.g. "React" matches "React.js") */
  it("matches skills by substring", () => {
    const candidate = makeCandidate({ skills: ["React.js"] });
    const role = makeRole({ requiredSkills: ["React"] });
    const result = calculateMatchScore(candidate, role);
    expect(result.breakdown.skills).toBe(30);
    expect(result.matchedSkills).toContain("React");
  });

  /* # Case insensitive matching */
  it("matches skills case-insensitively", () => {
    const candidate = makeCandidate({ skills: ["javascript", "REACT", "typescript"] });
    const result = calculateMatchScore(candidate, makeRole());
    expect(result.breakdown.skills).toBe(30);
  });

  /* # Bonus skills */
  it("scores bonus skills independently", () => {
    const candidate = makeCandidate({ skills: ["Next.js", "Tailwind"] });
    const result = calculateMatchScore(candidate, makeRole());
    expect(result.breakdown.bonusSkills).toBe(10);
  });
});

/* ============================================================
   Location scoring
   ============================================================ */

describe("location scoring", () => {
  it("gives full score when candidate wants remote and role is remote", () => {
    const result = calculateMatchScore(
      makeCandidate({ locationPref: "remote" }),
      makeRole({ locationType: "remote" })
    );
    expect(result.breakdown.location).toBe(20);
  });

  it("gives full score when candidate pref is 'any'", () => {
    const result = calculateMatchScore(
      makeCandidate({ locationPref: "any" }),
      makeRole({ locationType: "onsite", location: "NYC" })
    );
    expect(result.breakdown.location).toBe(20);
  });

  it("gives partial when candidate wants remote but role is hybrid", () => {
    const result = calculateMatchScore(
      makeCandidate({ locationPref: "remote" }),
      makeRole({ locationType: "hybrid" })
    );
    expect(result.breakdown.location).toBeLessThan(20);
    expect(result.breakdown.location).toBeGreaterThan(0);
  });

  it("gives zero for complete location mismatch", () => {
    const result = calculateMatchScore(
      makeCandidate({ locationPref: "onsite", locations: [] }),
      makeRole({ locationType: "hybrid" })
    );
    expect(result.breakdown.location).toBe(0);
  });
});

/* ============================================================
   Salary scoring
   ============================================================ */

describe("salary scoring", () => {
  it("gives full score when salary within range", () => {
    const result = calculateMatchScore(
      makeCandidate({ salaryMin: 90000 }),
      makeRole({ salaryMin: 70000, salaryMax: 120000 })
    );
    expect(result.breakdown.salary).toBe(15);
  });

  it("gives full score when candidate expects below role range", () => {
    const result = calculateMatchScore(
      makeCandidate({ salaryMin: 50000 }),
      makeRole({ salaryMin: 70000, salaryMax: 120000 })
    );
    expect(result.breakdown.salary).toBe(15);
  });

  it("gives low score when candidate expects way above range", () => {
    const result = calculateMatchScore(
      makeCandidate({ salaryMin: 200000 }),
      makeRole({ salaryMin: 70000, salaryMax: 90000 })
    );
    expect(result.breakdown.salary).toBeLessThan(8);
  });

  it("gives neutral score when no salary data", () => {
    const result = calculateMatchScore(
      makeCandidate({ salaryMin: null }),
      makeRole({ salaryMin: null, salaryMax: null })
    );
    expect(result.breakdown.salary).toBeGreaterThan(0);
  });
});

/* ============================================================
   Experience scoring
   ============================================================ */

describe("experience scoring", () => {
  it("gives full score when experience in range", () => {
    const result = calculateMatchScore(
      makeCandidate({ experienceYears: 5 }),
      makeRole({ experienceMin: 3, experienceMax: 7 })
    );
    expect(result.breakdown.experience).toBe(15);
  });

  it("gives partial for slightly under minimum", () => {
    const result = calculateMatchScore(
      makeCandidate({ experienceYears: 2 }),
      makeRole({ experienceMin: 3, experienceMax: 7 })
    );
    expect(result.breakdown.experience).toBeGreaterThan(0);
    expect(result.breakdown.experience).toBeLessThan(15);
  });

  it("gives partial for overqualified", () => {
    const result = calculateMatchScore(
      makeCandidate({ experienceYears: 15 }),
      makeRole({ experienceMin: 3, experienceMax: 7 })
    );
    expect(result.breakdown.experience).toBeGreaterThan(0);
    expect(result.breakdown.experience).toBeLessThan(15);
  });

  it("gives neutral for unknown experience", () => {
    const result = calculateMatchScore(
      makeCandidate({ experienceYears: null }),
      makeRole()
    );
    expect(result.breakdown.experience).toBeGreaterThan(0);
  });
});

/* ============================================================
   Employment type scoring
   ============================================================ */

describe("employment type scoring", () => {
  it("gives full score for exact match", () => {
    const result = calculateMatchScore(
      makeCandidate({ employmentType: "full-time" }),
      makeRole({ employmentType: "full-time" })
    );
    expect(result.breakdown.employmentType).toBe(5);
  });

  it("gives full score when candidate pref is 'any'", () => {
    const result = calculateMatchScore(
      makeCandidate({ employmentType: "any" }),
      makeRole({ employmentType: "contract" })
    );
    expect(result.breakdown.employmentType).toBe(5);
  });

  it("gives zero for mismatch", () => {
    const result = calculateMatchScore(
      makeCandidate({ employmentType: "contract" }),
      makeRole({ employmentType: "full-time" })
    );
    expect(result.breakdown.employmentType).toBe(0);
  });
});

/* ============================================================
   Industry scoring
   ============================================================ */

describe("industry scoring", () => {
  it("gives full score when industries match", () => {
    const result = calculateMatchScore(
      makeCandidate({ industries: ["Technology"] }),
      makeRole({ industry: "Technology" })
    );
    expect(result.breakdown.industry).toBe(5);
  });

  it("gives low score for complete industry mismatch", () => {
    const result = calculateMatchScore(
      makeCandidate({ industries: ["Agriculture"] }),
      makeRole({ industry: "Technology" })
    );
    expect(result.breakdown.industry).toBe(1);
  });

  it("gives partial when no role industry specified", () => {
    const result = calculateMatchScore(
      makeCandidate({ industries: ["Technology"] }),
      makeRole({ industry: null })
    );
    expect(result.breakdown.industry).toBe(3);
  });
});
