/* ============================================================
   EXTERNAL SCORING — Unit tests
   ============================================================
   Tests that external candidate profiles are correctly
   converted to CandidateProfile format for scoring.
   ============================================================ */

import { describe, it, expect } from "vitest";
import {
  buildGitHubCandidateProfile,
  buildSOCandidateProfile,
  buildPortfolioCandidateProfile,
} from "@/lib/external-scoring";
import type { GitHubProfile } from "@/lib/github-sourcing";
import type { StackOverflowProfile } from "@/lib/stackoverflow-sourcing";
import type { PortfolioProfile } from "@/lib/portfolio-sourcing";

describe("buildGitHubCandidateProfile", () => {
  const baseProfile: GitHubProfile = {
    login: "devuser",
    name: "Dev User",
    email: "dev@example.com",
    bio: "Full-stack developer",
    location: "San Francisco, CA",
    publicRepos: 42,
    followers: 150,
    profileUrl: "https://github.com/devuser",
    languages: ["TypeScript", "Python", "Go"],
    topRepos: [
      {
        name: "awesome-app",
        description: "A React and Node.js application",
        language: "TypeScript",
        stars: 200,
        forks: 30,
      },
      {
        name: "ml-toolkit",
        description: "Machine learning utilities with Django backend",
        language: "Python",
        stars: 50,
        forks: 10,
      },
    ],
  };

  it("maps languages to lowercase skills", () => {
    const profile = buildGitHubCandidateProfile(baseProfile);
    expect(profile.skills).toContain("typescript");
    expect(profile.skills).toContain("python");
    expect(profile.skills).toContain("go");
  });

  it("extracts tech keywords from repo descriptions", () => {
    const profile = buildGitHubCandidateProfile(baseProfile);
    /* # Should find react and node.js from repo descriptions */
    expect(profile.skills).toContain("react");
    expect(profile.skills).toContain("django");
  });

  it("deduplicates skills", () => {
    const profile = buildGitHubCandidateProfile(baseProfile);
    /* # TypeScript appears as language AND repo language — should only be once */
    const tsCount = profile.skills.filter((s) => s === "typescript").length;
    expect(tsCount).toBe(1);
  });

  it("uses location when available", () => {
    const profile = buildGitHubCandidateProfile(baseProfile);
    expect(profile.locations).toContain("San Francisco, CA");
    expect(profile.locationPref).toBe("any");
  });

  it("defaults to remote when no location", () => {
    const noLocation = { ...baseProfile, location: null };
    const profile = buildGitHubCandidateProfile(noLocation);
    expect(profile.locationPref).toBe("remote");
    expect(profile.locations).toEqual([]);
  });
});

describe("buildSOCandidateProfile", () => {
  const baseProfile: StackOverflowProfile = {
    userId: 12345,
    displayName: "SO Expert",
    profileUrl: "https://stackoverflow.com/users/12345",
    websiteUrl: "https://expert.dev",
    location: "London, UK",
    reputation: 15000,
    topTags: ["javascript", "react", "css", "html", "node.js"],
    answerCount: 200,
    questionCount: 10,
  };

  it("maps top tags to skills", () => {
    const profile = buildSOCandidateProfile(baseProfile);
    expect(profile.skills).toContain("javascript");
    expect(profile.skills).toContain("react");
    expect(profile.skills).toContain("node.js");
  });

  it("includes location from SO profile", () => {
    const profile = buildSOCandidateProfile(baseProfile);
    expect(profile.locations).toContain("London, UK");
  });
});

describe("buildPortfolioCandidateProfile", () => {
  const baseProfile: PortfolioProfile = {
    name: "Portfolio Dev",
    email: "dev@portfolio.dev",
    portfolioUrl: "https://portfolio.dev",
    skills: ["React", "TypeScript", "Tailwind"],
    bio: "Frontend developer",
    projects: [
      {
        name: "Dashboard",
        description: "Analytics dashboard",
        technologies: ["Next.js", "D3.js", "PostgreSQL"],
      },
    ],
    location: "Berlin, Germany",
  };

  it("combines direct skills and project technologies", () => {
    const profile = buildPortfolioCandidateProfile(baseProfile);
    expect(profile.skills).toContain("react");
    expect(profile.skills).toContain("typescript");
    expect(profile.skills).toContain("next.js");
    expect(profile.skills).toContain("d3.js");
    expect(profile.skills).toContain("postgresql");
  });

  it("deduplicates across skills and project technologies", () => {
    const withOverlap: PortfolioProfile = {
      ...baseProfile,
      skills: ["React", "Next.js"],
      projects: [
        {
          name: "App",
          description: "An app",
          technologies: ["React", "Next.js"],
        },
      ],
    };
    const profile = buildPortfolioCandidateProfile(withOverlap);
    const reactCount = profile.skills.filter((s) => s === "react").length;
    expect(reactCount).toBe(1);
  });
});
