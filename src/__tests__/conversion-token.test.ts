/* ============================================================
   CONVERSION TOKEN — Unit tests
   ============================================================
   Tests token generation, hashing, and verification.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma */
const mockExternalCandidateUpdate = vi.fn();
const mockExternalCandidateFindUnique = vi.fn();
const mockCandidateMatchUpdateMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    externalCandidate: {
      update: (...args: unknown[]) => mockExternalCandidateUpdate(...args),
      findUnique: (...args: unknown[]) => mockExternalCandidateFindUnique(...args),
    },
    candidateMatch: {
      updateMany: (...args: unknown[]) => mockCandidateMatchUpdateMany(...args),
    },
  },
}));

/* # Mock db-retry to pass through */
vi.mock("@/lib/db-retry", () => ({
  dbRetry: (fn: () => Promise<unknown>) => fn(),
}));

import {
  generateConversionToken,
  hashToken,
  verifyConversionToken,
  completeConversion,
} from "@/lib/conversion-token";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateConversionToken", () => {
  it("returns a raw token and its hash", () => {
    const { raw, hashed } = generateConversionToken();
    expect(raw).toBeTruthy();
    expect(hashed).toBeTruthy();
    expect(raw).not.toBe(hashed);
  });

  it("generates unique tokens each time", () => {
    const t1 = generateConversionToken();
    const t2 = generateConversionToken();
    expect(t1.raw).not.toBe(t2.raw);
    expect(t1.hashed).not.toBe(t2.hashed);
  });

  it("hash of raw matches the returned hash", () => {
    const { raw, hashed } = generateConversionToken();
    expect(hashToken(raw)).toBe(hashed);
  });
});

describe("verifyConversionToken", () => {
  it("returns invalid for non-existent token", async () => {
    mockExternalCandidateFindUnique.mockResolvedValue(null);

    const result = await verifyConversionToken("fake-token");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid");
  });

  it("returns invalid for already-converted candidate", async () => {
    mockExternalCandidateFindUnique.mockResolvedValue({
      id: "ext-1",
      name: "Test",
      email: null,
      skills: null,
      source: "github",
      profileUrl: "https://github.com/test",
      convertedUserId: "user-123",
      inviteExpiresAt: new Date(Date.now() + 86400000),
    });

    const result = await verifyConversionToken("some-token");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("already been used");
  });

  it("returns invalid for expired token", async () => {
    mockExternalCandidateFindUnique.mockResolvedValue({
      id: "ext-1",
      name: "Test",
      email: null,
      skills: null,
      source: "github",
      profileUrl: "https://github.com/test",
      convertedUserId: null,
      inviteExpiresAt: new Date(Date.now() - 86400000), // # Expired yesterday
    });

    const result = await verifyConversionToken("some-token");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("expired");
  });

  it("returns valid for active, unconverted candidate", async () => {
    mockExternalCandidateFindUnique.mockResolvedValue({
      id: "ext-1",
      name: "Test Dev",
      email: "test@example.com",
      skills: '["javascript"]',
      source: "github",
      profileUrl: "https://github.com/test",
      convertedUserId: null,
      inviteExpiresAt: new Date(Date.now() + 86400000),
    });

    const result = await verifyConversionToken("valid-token");
    expect(result.valid).toBe(true);
    expect(result.externalCandidate?.name).toBe("Test Dev");
  });
});

describe("completeConversion", () => {
  it("updates external candidate with userId and clears token", async () => {
    mockExternalCandidateUpdate.mockResolvedValue({});
    mockCandidateMatchUpdateMany.mockResolvedValue({ count: 3 });

    await completeConversion("ext-1", "user-123");

    /* # Should update ExternalCandidate */
    expect(mockExternalCandidateUpdate).toHaveBeenCalledWith({
      where: { id: "ext-1" },
      data: {
        convertedUserId: "user-123",
        inviteToken: null,
        inviteExpiresAt: null,
      },
    });

    /* # Should migrate CandidateMatch records */
    expect(mockCandidateMatchUpdateMany).toHaveBeenCalledWith({
      where: { externalId: "ext-1" },
      data: {
        candidateId: "user-123",
        source: "internal",
      },
    });
  });
});
