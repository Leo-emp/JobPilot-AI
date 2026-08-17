/* ============================================================
   EMPLOYER BILLING — Unit tests
   ============================================================
   Tests Stripe employer plan resolution, plan limits, and
   usage tracking logic.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma with inline fns to avoid hoisting issues */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    employerUsage: {
      upsert: vi.fn(() => Promise.resolve({
        id: "eu-1",
        employerId: "emp-1",
        month: "2026-08",
        rolesPosted: 0,
        candidatesContacted: 0,
        matchesViewed: 0,
        bookmarksUsed: 0,
        shortlistsDelivered: 0,
      })),
    },
    employer: {
      findUnique: vi.fn(() => Promise.resolve({ plan: "free" })),
    },
    role: {
      count: vi.fn(() => Promise.resolve(0)),
    },
  },
}));

vi.mock("@/lib/db-retry", () => ({
  dbRetry: (fn: () => Promise<unknown>) => fn(),
}));

import { resolveEmployerPlan, EMPLOYER_PLAN_LIMITS } from "@/lib/stripe";
import { getUsage, incrementUsage, checkLimit } from "@/lib/employer-usage";
import { prisma } from "@/lib/prisma";

/* # Cast for test control */
const mockUsageUpsert = prisma.employerUsage.upsert as ReturnType<typeof vi.fn>;
const mockEmployerFind = prisma.employer.findUnique as ReturnType<typeof vi.fn>;
const mockRoleCount = prisma.role.count as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("resolveEmployerPlan", () => {
  it("returns null for unknown price IDs", () => {
    /* # EMPLOYER_PRICE_IDS are read at module-load time from env,
       so we test the null case (no env set = empty strings = no match) */
    expect(resolveEmployerPlan("price_unknown")).toBeNull();
    expect(resolveEmployerPlan("")).toBeNull();
  });

  it("returns null when env vars are not configured", () => {
    /* # With no STRIPE_EMPLOYER_*_PRICE_ID env vars, all IDs default to "" */
    expect(resolveEmployerPlan("price_pro_monthly")).toBeNull();
    expect(resolveEmployerPlan("price_ent_monthly")).toBeNull();
  });
});

describe("EMPLOYER_PLAN_LIMITS", () => {
  it("has limits for all three tiers", () => {
    expect(EMPLOYER_PLAN_LIMITS.free).toBeDefined();
    expect(EMPLOYER_PLAN_LIMITS.pro).toBeDefined();
    expect(EMPLOYER_PLAN_LIMITS.enterprise).toBeDefined();
  });

  it("free plan has the most restrictive limits", () => {
    expect(EMPLOYER_PLAN_LIMITS.free.activeRoles).toBe(1);
    expect(EMPLOYER_PLAN_LIMITS.free.outreach).toBe(false);
    expect(EMPLOYER_PLAN_LIMITS.free.shortlists).toBe(false);
  });

  it("enterprise has unlimited roles and outreach enabled", () => {
    expect(EMPLOYER_PLAN_LIMITS.enterprise.activeRoles).toBe(Infinity);
    expect(EMPLOYER_PLAN_LIMITS.enterprise.outreach).toBe(true);
  });
});

describe("getUsage", () => {
  it("upserts usage record for current month", async () => {
    const usage = await getUsage("emp-1");
    expect(mockUsageUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          employerId_month: expect.objectContaining({ employerId: "emp-1" }),
        }),
      }),
    );
    expect(usage.rolesPosted).toBe(0);
  });
});

describe("incrementUsage", () => {
  it("increments the specified field", async () => {
    await incrementUsage("emp-1", "rolesPosted");
    expect(mockUsageUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          rolesPosted: { increment: 1 },
        }),
      }),
    );
  });

  it("supports custom amounts", async () => {
    await incrementUsage("emp-1", "candidatesContacted", 5);
    expect(mockUsageUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          candidatesContacted: { increment: 5 },
        }),
      }),
    );
  });
});

describe("checkLimit", () => {
  it("allows when under the active roles limit", async () => {
    mockEmployerFind.mockResolvedValue({ plan: "free" });
    mockRoleCount.mockResolvedValue(0);

    const result = await checkLimit("emp-1", "activeRoles");
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(1);
  });

  it("blocks when at the active roles limit", async () => {
    mockEmployerFind.mockResolvedValue({ plan: "free" });
    mockRoleCount.mockResolvedValue(1);

    const result = await checkLimit("emp-1", "activeRoles");
    expect(result.allowed).toBe(false);
    expect(result.current).toBe(1);
  });

  it("allows unlimited roles for enterprise", async () => {
    mockEmployerFind.mockResolvedValue({ plan: "enterprise" });
    mockRoleCount.mockResolvedValue(50);

    const result = await checkLimit("emp-1", "activeRoles");
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(-1);
  });

  it("checks bookmark limits against usage", async () => {
    mockEmployerFind.mockResolvedValue({ plan: "free" });
    mockUsageUpsert.mockResolvedValue({
      bookmarksUsed: 5,
      rolesPosted: 0,
      candidatesContacted: 0,
      matchesViewed: 0,
      shortlistsDelivered: 0,
    });

    const result = await checkLimit("emp-1", "bookmarksPerMonth");
    expect(result.allowed).toBe(false);
    expect(result.current).toBe(5);
    expect(result.limit).toBe(5);
  });
});
