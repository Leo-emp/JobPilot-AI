/* ============================================================
   EFFECTIVE PLAN TESTS — Plan resolution with org sponsorship
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma before importing the module under test */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    organizationMember: { findFirst: vi.fn() },
  },
}));

/* # Mock redis — return null cache by default */
vi.mock("@/lib/redis", () => ({
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn().mockResolvedValue(undefined),
}));

import { getEffectivePlan } from "@/lib/effective-plan";
import { prisma } from "@/lib/prisma";

describe("getEffectivePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 'pro' when user has own pro plan", async () => {
    /* # User is already paying — no org check needed */
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ plan: "pro" } as any);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("pro");
    /* # Should NOT check org membership since user is already pro */
    expect(prisma.organizationMember.findFirst).not.toHaveBeenCalled();
  });

  it("returns 'pro' when user has enterprise plan", async () => {
    /* # Enterprise also resolves to pro effective plan */
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ plan: "enterprise" } as any);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("pro");
  });

  it("returns 'pro' when free user is sponsored by paid org", async () => {
    /* # Free user sponsored by an org with team plan gets pro */
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ plan: "free" } as any);
    vi.mocked(prisma.organizationMember.findFirst).mockResolvedValue({
      organization: { plan: "team" },
    } as any);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("pro");
  });

  it("returns 'free' when user is free with no org", async () => {
    /* # No sponsorship — stays on free */
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ plan: "free" } as any);
    vi.mocked(prisma.organizationMember.findFirst).mockResolvedValue(null);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("free");
  });

  it("returns 'free' when org is on pilot plan (not paid)", async () => {
    /* # Pilot orgs don't sponsor pro — only team/business do */
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ plan: "free" } as any);
    vi.mocked(prisma.organizationMember.findFirst).mockResolvedValue(null);
    const result = await getEffectivePlan("user-1");
    expect(result).toBe("free");
  });
});
