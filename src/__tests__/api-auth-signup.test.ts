import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* Mock prisma before importing the route */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

/* Mock Resend so lazy-init doesn't throw without API key */
vi.mock("resend", () => {
  const mockSend = vi.fn(() => Promise.resolve());
  return { Resend: class { emails = { send: mockSend }; } };
});

/* Mock audit to avoid Sentry dependency in tests */
vi.mock("@/lib/audit", () => ({
  audit: vi.fn(),
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

/* Mock rate limiter to allow all requests by default (async) */
vi.mock("@/lib/rate-limit", () => ({
  authPerMinute: { check: vi.fn(async () => ({ allowed: true, remaining: 4, resetIn: 60000 })) },
  authPerHour: { check: vi.fn(async () => ({ allowed: true, remaining: 14, resetIn: 3600000 })) },
}));

import { POST } from "@/app/api/auth/signup/route";
import { prisma } from "@/lib/prisma";
import { authPerMinute, authPerHour } from "@/lib/rate-limit";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(authPerMinute.check).mockResolvedValue({ allowed: true, remaining: 4, resetIn: 60000 });
  vi.mocked(authPerHour.check).mockResolvedValue({ allowed: true, remaining: 14, resetIn: 3600000 });
});

describe("POST /api/auth/signup", () => {
  it("creates a user with valid data", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
    } as never);

    const res = await POST(makeRequest({
      name: "Test User",
      email: "test@example.com",
      password: "securepass123",
    }));

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("user-1");
    expect(data.email).toBe("test@example.com");
  });

  it("returns 409 for duplicate email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as never);

    const res = await POST(makeRequest({
      name: "Test",
      email: "taken@example.com",
      password: "securepass123",
    }));

    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("already exists");
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      email: "not-an-email",
      password: "securepass123",
    }));

    expect(res.status).toBe(400);
  });

  it("returns 400 for short password", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
      password: "short",
    }));

    expect(res.status).toBe(400);
  });

  it("returns 400 for missing name", async () => {
    const res = await POST(makeRequest({
      email: "test@example.com",
      password: "securepass123",
    }));

    expect(res.status).toBe(400);
  });

  it("returns 429 when per-minute rate limit exceeded", async () => {
    vi.mocked(authPerMinute.check).mockResolvedValue({
      allowed: false, remaining: 0, resetIn: 45000,
    });

    const res = await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
      password: "securepass123",
    }));

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("45");
  });

  it("returns 429 when per-hour rate limit exceeded", async () => {
    vi.mocked(authPerHour.check).mockResolvedValue({
      allowed: false, remaining: 0, resetIn: 1800000,
    });

    const res = await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
      password: "securepass123",
    }));

    expect(res.status).toBe(429);
  });

  it("never returns the password in the response", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      name: "Test",
    } as never);

    const res = await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
      password: "securepass123",
    }));

    const data = await res.json();
    expect(data.password).toBeUndefined();
    expect(data.hashedPassword).toBeUndefined();
  });

  it("hashes the password before storing", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      name: "Test",
    } as never);

    await POST(makeRequest({
      name: "Test",
      email: "test@example.com",
      password: "securepass123",
    }));

    const createCall = vi.mocked(prisma.user.create).mock.calls[0][0];
    const storedPassword = (createCall as { data: { password: string } }).data.password;
    expect(storedPassword).not.toBe("securepass123");
    expect(storedPassword).toMatch(/^\$2[aby]\$/);
  });
});
