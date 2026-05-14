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

/* Mock Stripe */
const mockStripeCreate = vi.fn();
const mockCustomerCreate = vi.fn();
vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: mockStripeCreate } },
    customers: { create: mockCustomerCreate },
  }),
  PRICE_IDS: { pro: "price_pro_123" },
}));

import { POST } from "@/app/api/stripe/checkout/route";
import { prisma } from "@/lib/prisma";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.AUTH_URL = "http://localhost:3000";
});

describe("POST /api/stripe/checkout", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest({ plan: "pro" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid plan", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(makeRequest({ plan: "enterprise" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for free plan", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(makeRequest({ plan: "free" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when user not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "ghost" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({ plan: "pro" }));
    expect(res.status).toBe(404);
  });

  it("creates checkout session for existing Stripe customer", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      name: "Test",
      stripeCustomerId: "cus_existing",
    } as never);
    mockStripeCreate.mockResolvedValue({ url: "https://checkout.stripe.com/session123" });

    const res = await POST(makeRequest({ plan: "pro" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe("https://checkout.stripe.com/session123");
  });

  it("creates new Stripe customer if none exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      name: "Test",
      stripeCustomerId: null,
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({} as never);
    mockCustomerCreate.mockResolvedValue({ id: "cus_new" });
    mockStripeCreate.mockResolvedValue({ url: "https://checkout.stripe.com/new" });

    const res = await POST(makeRequest({ plan: "pro" }));
    expect(res.status).toBe(200);
    expect(mockCustomerCreate).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@test.com" })
    );
    expect(vi.mocked(prisma.user.update)).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeCustomerId: "cus_new" }),
      })
    );
  });

  it("returns 500 with generic message on Stripe error", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      stripeCustomerId: "cus_1",
    } as never);
    mockStripeCreate.mockRejectedValue(new Error("Stripe API key invalid"));

    const res = await POST(makeRequest({ plan: "pro" }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).not.toContain("API key");
    expect(data.error).toContain("Something went wrong");
  });
});
