/* ============================================================
   RESET PASSWORD TESTS
   ============================================================
   Tests for POST /api/auth/reset-password
   Verifies token validation, expiry, reuse prevention,
   password hashing, and rate limiting.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import crypto from "crypto";

/* # Mock auth — prevents next-auth module load */
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    passwordReset: {
      findUnique: vi.fn(),
      update: vi.fn(() => Promise.resolve({})),
    },
    user: { update: vi.fn(() => Promise.resolve({})) },
    $transaction: vi.fn(async (ops: Promise<unknown>[]) => {
      const results = [];
      for (const op of ops) results.push(await op);
      return results;
    }),
  },
}));

vi.mock("@/lib/audit", () => ({
  audit: vi.fn(),
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

vi.mock("@/lib/api-handler", () => ({
  safeHandler: vi.fn((fn: unknown) => fn),
}));

vi.mock("@/lib/db-retry", () => ({
  dbRetry: vi.fn((fn: () => unknown) => fn()),
}));

vi.mock("@/lib/rate-limit", () => ({
  authPerMinute: { check: vi.fn(async () => ({ allowed: true, remaining: 4, resetIn: 60000 })) },
  authPerHour: { check: vi.fn(async () => ({ allowed: true, remaining: 14, resetIn: 3600000 })) },
}));

import { POST } from "@/app/api/auth/reset-password/route";
import { prisma } from "@/lib/prisma";
import { authPerMinute } from "@/lib/rate-limit";

/* # Generate a test token and its hash (matching the real flow) */
const TEST_TOKEN = "abc123def456";
const HASHED_TOKEN = crypto.createHash("sha256").update(TEST_TOKEN).digest("hex");

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/reset-password", () => {
  /* # Valid token + password resets successfully */
  it("resets password with valid token", async () => {
    vi.mocked(prisma.passwordReset.findUnique).mockResolvedValue({
      id: "reset-1",
      email: "test@example.com",
      token: HASHED_TOKEN,
      used: false,
      expiresAt: new Date(Date.now() + 3600000),
    } as any);

    const res = await POST(makeRequest({
      token: TEST_TOKEN,
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain("successfully");
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  /* # Invalid token returns 400 */
  it("rejects invalid token", async () => {
    vi.mocked(prisma.passwordReset.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({
      token: "invalid-token-xyz",
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid or expired");
  });

  /* # Already-used token rejected */
  it("rejects already-used token", async () => {
    vi.mocked(prisma.passwordReset.findUnique).mockResolvedValue({
      id: "reset-2",
      email: "test@example.com",
      token: HASHED_TOKEN,
      used: true,
      expiresAt: new Date(Date.now() + 3600000),
    } as any);

    const res = await POST(makeRequest({
      token: TEST_TOKEN,
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("already been used");
  });

  /* # Expired token rejected */
  it("rejects expired token", async () => {
    vi.mocked(prisma.passwordReset.findUnique).mockResolvedValue({
      id: "reset-3",
      email: "test@example.com",
      token: HASHED_TOKEN,
      used: false,
      expiresAt: new Date(Date.now() - 1000),
    } as any);

    const res = await POST(makeRequest({
      token: TEST_TOKEN,
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("expired");
  });

  /* # Short password rejected by Zod */
  it("rejects short password", async () => {
    const res = await POST(makeRequest({
      token: TEST_TOKEN,
      password: "short",
    }));

    expect(res.status).toBe(400);
  });

  /* # Missing token rejected */
  it("rejects missing token", async () => {
    const res = await POST(makeRequest({
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(400);
  });

  /* # Rate limiting works */
  it("returns 429 when rate limited", async () => {
    vi.mocked(authPerMinute.check).mockResolvedValue({
      allowed: false, remaining: 0, resetIn: 30000,
    });

    const res = await POST(makeRequest({
      token: TEST_TOKEN,
      password: "newSecurePass123",
    }));

    expect(res.status).toBe(429);
  });
});
