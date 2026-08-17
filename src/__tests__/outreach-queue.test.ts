/* ============================================================
   OUTREACH QUEUE — Unit tests
   ============================================================
   Tests the queue processing, suppression checks, and
   follow-up scheduling logic.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";

/* # Mock Resend — must use class (arrow fns aren't constructable) */
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn(() => Promise.resolve({ id: "email-1" })) };
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    outreach: {
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(() => Promise.resolve({ count: 0 })),
      count: vi.fn(() => Promise.resolve(0)),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    emailSuppression: {
      findUnique: vi.fn(() => Promise.resolve(null)),
    },
    candidateMatch: {
      updateMany: vi.fn(() => Promise.resolve({ count: 0 })),
    },
    notification: { create: vi.fn(() => Promise.resolve({})) },
    role: { findUnique: vi.fn(() => Promise.resolve(null)) },
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

import { processOutreachQueue, cancelRoleOutreach } from "@/lib/outreach-queue";
import { prisma } from "@/lib/prisma";

/* # Cast mocks for convenient access */
const mockOutreachFindMany = prisma.outreach.findMany as ReturnType<typeof vi.fn>;
const mockOutreachUpdate = prisma.outreach.update as ReturnType<typeof vi.fn>;
const mockOutreachUpdateMany = prisma.outreach.updateMany as ReturnType<typeof vi.fn>;
const mockOutreachCount = prisma.outreach.count as ReturnType<typeof vi.fn>;
const mockSuppressionFindUnique = prisma.emailSuppression.findUnique as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  mockOutreachCount.mockResolvedValue(0);
  mockSuppressionFindUnique.mockResolvedValue(null);
  mockOutreachUpdate.mockResolvedValue({});
  mockOutreachUpdateMany.mockResolvedValue({ count: 0 });
});

describe("processOutreachQueue", () => {
  it("returns zero counts when no queued outreach exists", async () => {
    mockOutreachFindMany.mockResolvedValue([]);

    const result = await processOutreachQueue();
    expect(result.sent).toBe(0);
    expect(result.suppressed).toBe(0);
    expect(result.failed).toBe(0);
  });

  it("sends queued emails and updates status", async () => {
    mockOutreachFindMany.mockResolvedValue([
      {
        id: "out-1",
        roleId: "role-1",
        email: "test@example.com",
        subject: "Test Subject",
        body: "Test Body",
        candidateMatchId: null,
        followUpNumber: 0,
      },
    ]);

    const result = await processOutreachQueue();
    expect(result.sent).toBe(1);
    expect(mockOutreachUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "out-1" },
        data: expect.objectContaining({ status: "sent" }),
      }),
    );
  });

  it("skips suppressed emails", async () => {
    mockOutreachFindMany.mockResolvedValue([
      {
        id: "out-1",
        roleId: "role-1",
        email: "blocked@example.com",
        subject: "Test",
        body: "Test",
        candidateMatchId: null,
        followUpNumber: 0,
      },
    ]);
    mockSuppressionFindUnique.mockResolvedValue({ id: "sup-1", reason: "opt_out" });

    const result = await processOutreachQueue();
    expect(result.suppressed).toBe(1);
    expect(result.sent).toBe(0);
  });
});

describe("cancelRoleOutreach", () => {
  it("cancels all queued outreach for a role", async () => {
    mockOutreachUpdateMany.mockResolvedValue({ count: 5 });

    const cancelled = await cancelRoleOutreach("role-1");
    expect(cancelled).toBe(5);
    expect(mockOutreachUpdateMany).toHaveBeenCalledWith({
      where: { roleId: "role-1", status: "queued" },
      data: { status: "cancelled" },
    });
  });
});
