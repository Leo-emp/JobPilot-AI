/* ============================================================
   FORGOT PASSWORD TESTS
   ============================================================
   Tests for POST /api/auth/forgot-password
   Verifies rate limiting, validation, email enumeration
   prevention, and token generation.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* # Mock auth — prevents next-auth module load */
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    passwordReset: {
      updateMany: vi.fn(() => Promise.resolve({ count: 0 })),
      create: vi.fn(() => Promise.resolve({})),
    },
  },
}));

vi.mock("resend", () => {
  const mockSend = vi.fn(() => Promise.resolve());
  return { Resend: class { emails = { send: mockSend }; } };
});

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

import { POST } from "@/app/api/auth/forgot-password/route";
import { prisma } from "@/lib/prisma";
import { authPerMinute } from "@/lib/rate-limit";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "re_test";
  process.env.NEXTAUTH_URL = "http://localhost:3000";
});

describe("POST /api/auth/forgot-password", () => {
  /* # Always returns success — prevents email enumeration */
  it("returns success even when email does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({ email: "nobody@example.com" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain("If an account");
    /* # No token should be created for non-existent user */
    expect(prisma.passwordReset.create).not.toHaveBeenCalled();
  });

  /* # Valid user with password gets a token created */
  it("creates reset token for valid credentials user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      name: "Test",
      password: "$2a$12$hashedpassword",
    } as any);

    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(200);
    expect(prisma.passwordReset.create).toHaveBeenCalled();
  });

  /* # OAuth users (no password) should NOT get a reset token */
  it("does not create token for OAuth user without password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-2",
      email: "oauth@example.com",
      name: "OAuth User",
      password: null,
    } as any);

    const res = await POST(makeRequest({ email: "oauth@example.com" }));
    expect(res.status).toBe(200);
    expect(prisma.passwordReset.create).not.toHaveBeenCalled();
  });

  /* # Invalid email format rejected by Zod */
  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  /* # Rate limiting works */
  it("returns 429 when rate limited", async () => {
    vi.mocked(authPerMinute.check).mockResolvedValue({
      allowed: false, remaining: 0, resetIn: 45000,
    });

    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("45");
  });
});
