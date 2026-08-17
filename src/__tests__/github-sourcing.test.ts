/* ============================================================
   GITHUB SOURCING — Unit tests
   ============================================================
   Tests search query generation logic.
   ============================================================ */

import { describe, it, expect } from "vitest";
import { buildGitHubSearchQuery } from "@/lib/github-sourcing";

describe("buildGitHubSearchQuery", () => {
  it("includes language filter for known programming languages", () => {
    const query = buildGitHubSearchQuery(["TypeScript", "React"]);
    expect(query).toContain("language:typescript");
  });

  it("adds non-language skills as keyword search", () => {
    const query = buildGitHubSearchQuery(["React", "Next.js", "TypeScript"]);
    /* # React and Next.js are not in the language map, so they become keywords */
    expect(query).toContain("React");
  });

  it("includes location filter when provided", () => {
    const query = buildGitHubSearchQuery(["Python"], "San Francisco");
    expect(query).toContain("location:San Francisco");
  });

  it("always includes minimum followers and repos filter", () => {
    const query = buildGitHubSearchQuery(["Go"]);
    expect(query).toContain("followers:>5");
    expect(query).toContain("repos:>3");
  });

  it("limits to first 3 skills for language matching", () => {
    const query = buildGitHubSearchQuery([
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
    ]);
    /* # Only first matched language should be in query */
    expect(query).toContain("language:javascript");
    /* # Should not have multiple language filters */
    const languageCount = (query.match(/language:/g) ?? []).length;
    expect(languageCount).toBe(1);
  });

  it("handles empty skills array", () => {
    const query = buildGitHubSearchQuery([]);
    /* # Should still have the base filters */
    expect(query).toContain("followers:>5");
    expect(query).toContain("repos:>3");
  });
});
