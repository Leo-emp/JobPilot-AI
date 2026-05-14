import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* Mock auth */
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

/* Mock prisma */
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

/* Mock rate limiters — allow by default */
vi.mock("@/lib/rate-limit", () => ({
  userPerMinute: { check: vi.fn(() => ({ allowed: true, remaining: 5, resetIn: 60000 })) },
  userPerHour: { check: vi.fn(() => ({ allowed: true, remaining: 39, resetIn: 3600000 })) },
  ipPerMinute: { check: vi.fn(() => ({ allowed: true, remaining: 19, resetIn: 60000 })) },
}));

/* Mock Sentry */
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

/* Mock fetch for Gemini API */
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { POST } from "@/app/api/ai/route";
import { prisma } from "@/lib/prisma";
import { userPerMinute, userPerHour, ipPerMinute } from "@/lib/rate-limit";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GEMINI_API_KEY = "test-key";
  process.env.ADMIN_EMAILS = "admin@test.com";
  vi.mocked(userPerMinute.check).mockReturnValue({ allowed: true, remaining: 5, resetIn: 60000 });
  vi.mocked(userPerHour.check).mockReturnValue({ allowed: true, remaining: 39, resetIn: 3600000 });
  vi.mocked(ipPerMinute.check).mockReturnValue({ allowed: true, remaining: 19, resetIn: 60000 });
});

describe("POST /api/ai", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest({ action: "cover_letter", payload: {} }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid action type", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });

    const res = await POST(makeRequest({ action: "invalid_action", payload: {} }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing payload", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });

    const res = await POST(makeRequest({ action: "cover_letter" }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when user plan limit is exceeded", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      plan: "free",
      aiUsageCount: 20,
      usageResetDate: new Date(Date.now() + 86400000),
      email: "test@test.com",
    } as never);

    const res = await POST(makeRequest({
      action: "cover_letter",
      payload: { resume: "test", jobTitle: "Dev", company: "Co", jobDescription: "test" },
    }));

    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("Upgrade to Pro");
  });

  it("returns 429 when burst rate limit is exceeded", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(userPerMinute.check).mockReturnValue({
      allowed: false, remaining: 0, resetIn: 30000,
    });

    const res = await POST(makeRequest({
      action: "cover_letter",
      payload: { resume: "test" },
    }));

    expect(res.status).toBe(429);
  });

  it("returns 413 for oversized payload", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      plan: "free",
      aiUsageCount: 0,
      usageResetDate: new Date(Date.now() + 86400000),
      email: "test@test.com",
    } as never);

    const res = await POST(makeRequest({
      action: "analyze_resume",
      payload: { resume: "x".repeat(55000) },
    }));

    expect(res.status).toBe(413);
  });

  it("returns AI result on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      plan: "pro",
      aiUsageCount: 5,
      usageResetDate: new Date(Date.now() + 86400000),
      email: "test@test.com",
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "AI generated response" }] } }],
      }),
    });

    const res = await POST(makeRequest({
      action: "analyze_resume",
      payload: { resume: "My resume content here" },
    }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.result).toBe("AI generated response");
    expect(data.remaining).toBeDefined();
  });

  it("skips rate limiting for admin users", async () => {
    mockAuth.mockResolvedValue({ user: { id: "admin-1", email: "admin@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      plan: "free",
      aiUsageCount: 999,
      usageResetDate: new Date(Date.now() + 86400000),
      email: "admin@test.com",
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Admin response" }] } }],
      }),
    });

    const res = await POST(makeRequest({
      action: "analyze_resume",
      payload: { resume: "test" },
    }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.remaining).toBe("unlimited");
  });

  it("returns 404 when user not found in database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "ghost", email: "ghost@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({
      action: "cover_letter",
      payload: { resume: "test" },
    }));

    expect(res.status).toBe(404);
  });

  it("resets monthly usage when reset date has passed", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      plan: "free",
      aiUsageCount: 15,
      usageResetDate: new Date(Date.now() - 86400000),
      email: "test@test.com",
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Response after reset" }] } }],
      }),
    });

    const res = await POST(makeRequest({
      action: "analyze_resume",
      payload: { resume: "test" },
    }));

    expect(res.status).toBe(200);
    expect(vi.mocked(prisma.user.update)).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ aiUsageCount: 0 }),
      })
    );
  });

  it("returns 500 with generic message on unexpected error", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", email: "test@test.com" } });
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("DB connection failed"));

    const res = await POST(makeRequest({
      action: "cover_letter",
      payload: { resume: "test" },
    }));

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).not.toContain("DB connection");
    expect(data.error).toContain("temporarily unavailable");
  });
});
