/* ============================================================
   SHORTLIST — Unit tests
   ============================================================
   Tests shortlist creation, entry management, and delivery.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Inline vi.fn() inside factory to avoid hoisting issues */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    shortlist: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    shortlistEntry: {
      create: vi.fn(),
      findFirst: vi.fn(() => Promise.resolve(null)),
      deleteMany: vi.fn(),
    },
    candidateMatch: {
      updateMany: vi.fn(() => Promise.resolve({ count: 0 })),
      findMany: vi.fn(() => Promise.resolve([])),
    },
    notification: { create: vi.fn(() => Promise.resolve({})) },
    employerMember: { findMany: vi.fn(() => Promise.resolve([])) },
  },
}));

vi.mock("@/lib/db-retry", () => ({
  dbRetry: (fn: () => Promise<unknown>) => fn(),
}));

vi.mock("@/lib/audit", () => ({
  audit: vi.fn(),
}));

vi.mock("@/lib/notifications", () => ({
  notify: vi.fn(() => Promise.resolve()),
}));

import {
  createShortlist,
  addToShortlist,
  removeFromShortlist,
  deliverShortlist,
} from "@/lib/shortlist";
import { prisma } from "@/lib/prisma";

/* # Cast mocks for convenient access */
const mockShortlistCreate = prisma.shortlist.create as ReturnType<typeof vi.fn>;
const mockShortlistFindUnique = prisma.shortlist.findUnique as ReturnType<typeof vi.fn>;
const mockShortlistUpdate = prisma.shortlist.update as ReturnType<typeof vi.fn>;
const mockEntryCreate = prisma.shortlistEntry.create as ReturnType<typeof vi.fn>;
const mockEntryFindFirst = prisma.shortlistEntry.findFirst as ReturnType<typeof vi.fn>;
const mockEntryDeleteMany = prisma.shortlistEntry.deleteMany as ReturnType<typeof vi.fn>;
const mockMatchUpdateMany = prisma.candidateMatch.updateMany as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockEntryFindFirst.mockResolvedValue(null);
  mockMatchUpdateMany.mockResolvedValue({ count: 0 });
});

describe("createShortlist", () => {
  it("creates a shortlist with role and employer", async () => {
    mockShortlistCreate.mockResolvedValue({ id: "sl-1" });

    const result = await createShortlist("role-1", "emp-1", "Round 1");
    expect(result.id).toBe("sl-1");
    expect(mockShortlistCreate).toHaveBeenCalledWith({
      data: { roleId: "role-1", employerId: "emp-1", name: "Round 1" },
    });
  });
});

describe("addToShortlist", () => {
  it("adds an entry with the next position number", async () => {
    mockEntryFindFirst.mockResolvedValue({ position: 3 });
    mockEntryCreate.mockResolvedValue({ id: "se-1" });

    const added = await addToShortlist("sl-1", "match-1", "Great candidate");
    expect(added).toBe(true);
    expect(mockEntryCreate).toHaveBeenCalledWith({
      data: {
        shortlistId: "sl-1",
        candidateMatchId: "match-1",
        position: 4,
        employerNote: "Great candidate",
      },
    });
  });

  it("starts at position 1 when shortlist is empty", async () => {
    mockEntryFindFirst.mockResolvedValue(null);
    mockEntryCreate.mockResolvedValue({ id: "se-1" });

    await addToShortlist("sl-1", "match-1");
    expect(mockEntryCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ position: 1 }),
      }),
    );
  });

  it("returns false for duplicate entries", async () => {
    mockEntryFindFirst.mockResolvedValue(null);
    mockEntryCreate.mockRejectedValue(new Error("Unique constraint"));

    const added = await addToShortlist("sl-1", "match-1");
    expect(added).toBe(false);
  });
});

describe("removeFromShortlist", () => {
  it("removes the entry and returns true", async () => {
    mockEntryDeleteMany.mockResolvedValue({ count: 1 });

    const removed = await removeFromShortlist("sl-1", "match-1");
    expect(removed).toBe(true);
  });

  it("returns false when entry does not exist", async () => {
    mockEntryDeleteMany.mockResolvedValue({ count: 0 });

    const removed = await removeFromShortlist("sl-1", "match-999");
    expect(removed).toBe(false);
  });
});

describe("deliverShortlist", () => {
  it("marks shortlist as delivered", async () => {
    mockShortlistFindUnique.mockResolvedValue({
      id: "sl-1",
      roleId: "role-1",
      entries: [{ id: "se-1" }, { id: "se-2" }],
      role: { title: "Engineer", employerId: "emp-1" },
    });
    mockShortlistUpdate.mockResolvedValue({});

    const delivered = await deliverShortlist("sl-1");
    expect(delivered).toBe(true);
    expect(mockShortlistUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "delivered" }),
      }),
    );
  });

  it("returns false for non-existent shortlist", async () => {
    mockShortlistFindUnique.mockResolvedValue(null);

    const delivered = await deliverShortlist("sl-999");
    expect(delivered).toBe(false);
  });
});
