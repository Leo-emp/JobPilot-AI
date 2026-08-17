/* ============================================================
   MUTUAL INTEREST — Unit tests
   ============================================================
   Tests checkMutualInterest() detection logic.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock prisma */
const mockEmployerBookmarkFindUnique = vi.fn();
const mockCandidateBookmarkFindFirst = vi.fn();
const mockMessageThreadFindFirst = vi.fn();
const mockMessageThreadCreate = vi.fn();
const mockEmployerFindUnique = vi.fn();
const mockUserFindUnique = vi.fn();
const mockEmployerMemberFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employerBookmark: { findUnique: (...args: unknown[]) => mockEmployerBookmarkFindUnique(...args) },
    candidateBookmark: { findFirst: (...args: unknown[]) => mockCandidateBookmarkFindFirst(...args) },
    messageThread: {
      findFirst: (...args: unknown[]) => mockMessageThreadFindFirst(...args),
      create: (...args: unknown[]) => mockMessageThreadCreate(...args),
    },
    employer: { findUnique: (...args: unknown[]) => mockEmployerFindUnique(...args) },
    user: { findUnique: (...args: unknown[]) => mockUserFindUnique(...args) },
    employerMember: { findMany: (...args: unknown[]) => mockEmployerMemberFindMany(...args) },
    notification: { create: vi.fn(() => Promise.resolve({})) },
  },
}));

import { checkMutualInterest } from "@/lib/mutual-interest";

beforeEach(() => {
  vi.clearAllMocks();
  mockEmployerBookmarkFindUnique.mockResolvedValue(null);
  mockCandidateBookmarkFindFirst.mockResolvedValue(null);
});

describe("checkMutualInterest", () => {
  it("returns false when employer has not bookmarked the candidate", async () => {
    mockEmployerBookmarkFindUnique.mockResolvedValue(null);

    const result = await checkMutualInterest("emp-1", "user-1");
    expect(result).toBe(false);
  });

  it("returns false when only employer has bookmarked (no candidate bookmark)", async () => {
    mockEmployerBookmarkFindUnique.mockResolvedValue({ id: "eb-1" });
    mockCandidateBookmarkFindFirst.mockResolvedValue(null);

    const result = await checkMutualInterest("emp-1", "user-1");
    expect(result).toBe(false);
  });

  it("returns true when both sides have bookmarked each other", async () => {
    mockEmployerBookmarkFindUnique.mockResolvedValue({ id: "eb-1" });
    mockCandidateBookmarkFindFirst.mockResolvedValue({ id: "cb-1" });

    const result = await checkMutualInterest("emp-1", "user-1");
    expect(result).toBe(true);
  });

  it("queries employer bookmark with correct compound key", async () => {
    await checkMutualInterest("emp-abc", "user-xyz");

    expect(mockEmployerBookmarkFindUnique).toHaveBeenCalledWith({
      where: {
        employerId_candidateId: {
          employerId: "emp-abc",
          candidateId: "user-xyz",
        },
      },
    });
  });

  it("only checks candidate bookmark when employer bookmark exists", async () => {
    mockEmployerBookmarkFindUnique.mockResolvedValue(null);

    await checkMutualInterest("emp-1", "user-1");

    /* # Should not check candidate bookmarks — short-circuited */
    expect(mockCandidateBookmarkFindFirst).not.toHaveBeenCalled();
  });
});
