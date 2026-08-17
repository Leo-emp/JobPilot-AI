/* ============================================================
   EMPLOYER VALIDATION TESTS — Schema validation for employer routes
   ============================================================ */

import { describe, it, expect } from "vitest";
import { createEmployerSchema, createRoleSchema, candidatePreferenceSchema } from "@/lib/employer-validations";

describe("createEmployerSchema", () => {
  it("rejects employer with invalid slug", () => {
    /* # Slugs must be lowercase alphanumeric with hyphens */
    const result = createEmployerSchema.safeParse({
      name: "Acme Corp",
      slug: "Acme Corp!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid employer", () => {
    const result = createEmployerSchema.safeParse({
      name: "Acme Corp",
      slug: "acme-corp",
      industry: "Technology",
      size: "startup",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing company name", () => {
    const result = createEmployerSchema.safeParse({
      slug: "acme-corp",
    });
    expect(result.success).toBe(false);
  });
});

describe("createRoleSchema", () => {
  it("rejects salary min > max", () => {
    /* # Salary range must be valid */
    const result = createRoleSchema.safeParse({
      title: "Engineer",
      description: "Build things",
      salaryMin: 200000,
      salaryMax: 100000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects experience min > max", () => {
    const result = createRoleSchema.safeParse({
      title: "Senior Engineer",
      description: "Build things",
      experienceMin: 10,
      experienceMax: 3,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid role", () => {
    const result = createRoleSchema.safeParse({
      title: "Senior Software Engineer",
      description: "Build scalable systems",
      salaryMin: 120000,
      salaryMax: 180000,
      locationType: "remote",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = createRoleSchema.safeParse({
      description: "Build things",
    });
    expect(result.success).toBe(false);
  });
});

describe("candidatePreferenceSchema", () => {
  it("accepts minimal preferences", () => {
    const result = candidatePreferenceSchema.safeParse({
      openToWork: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts full preferences", () => {
    const result = candidatePreferenceSchema.safeParse({
      openToWork: true,
      desiredTitle: "Software Engineer",
      locationPref: "remote",
      salaryMin: 100000,
      salaryCurrency: "USD",
      employmentType: "full-time",
    });
    expect(result.success).toBe(true);
  });

  it("defaults openToWork to true", () => {
    const result = candidatePreferenceSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.openToWork).toBe(true);
    }
  });
});
