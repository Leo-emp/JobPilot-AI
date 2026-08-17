/* ============================================================
   ORG VALIDATION TESTS — Schema validation for org routes
   ============================================================ */

import { describe, it, expect } from "vitest";
import { createOrgSchema, updateOrgSchema, bulkInviteSchema, acceptInviteSchema } from "@/lib/org-validations";

describe("createOrgSchema", () => {
  it("rejects org with invalid slug", () => {
    /* # Slugs must be lowercase alphanumeric with hyphens only */
    const result = createOrgSchema.safeParse({
      name: "Test Bootcamp",
      slug: "Invalid Slug!",
      billingEmail: "admin@test.com",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid org creation", () => {
    const result = createOrgSchema.safeParse({
      name: "Northcoders",
      slug: "northcoders",
      type: "bootcamp",
      billingEmail: "admin@northcoders.com",
      seatLimit: 50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    /* # Name and slug are required */
    const result = createOrgSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("defaults type to agency", () => {
    const result = createOrgSchema.safeParse({
      name: "Acme Recruiting",
      slug: "acme-recruiting",
      billingEmail: "billing@acme.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("agency");
    }
  });
});

describe("bulkInviteSchema", () => {
  it("rejects empty invites array", () => {
    const result = bulkInviteSchema.safeParse({ invites: [] });
    expect(result.success).toBe(false);
  });

  it("rejects bulk invite over 500", () => {
    /* # 500 is the max to prevent abuse */
    const invites = Array.from({ length: 501 }, (_, i) => ({
      email: `user${i}@example.com`,
    }));
    const result = bulkInviteSchema.safeParse({ invites });
    expect(result.success).toBe(false);
  });

  it("accepts valid bulk invite", () => {
    const result = bulkInviteSchema.safeParse({
      invites: [
        { email: "alice@example.com", role: "candidate", cohort: "March 2027" },
        { email: "bob@example.com" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("lowercases invite emails", () => {
    const result = bulkInviteSchema.safeParse({
      invites: [{ email: "Alice@Example.COM" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.invites[0].email).toBe("alice@example.com");
    }
  });
});

describe("acceptInviteSchema", () => {
  it("rejects empty token", () => {
    const result = acceptInviteSchema.safeParse({ token: "" });
    expect(result.success).toBe(false);
  });

  it("accepts valid token", () => {
    const result = acceptInviteSchema.safeParse({ token: "abc123def456" });
    expect(result.success).toBe(true);
  });
});
