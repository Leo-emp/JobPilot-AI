/* ============================================================
   STRIPE WEBHOOK TESTS
   ============================================================
   Tests for POST /api/stripe/webhook
   Verifies signature checking, plan upgrades, downgrades,
   and edge cases in payment event handling.
   ============================================================ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* # vi.hoisted runs before vi.mock hoisting, so these refs are safe to use in factories */
const { mockConstructEvent, mockRetrieve } = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockRetrieve: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mockConstructEvent },
    subscriptions: { retrieve: mockRetrieve },
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(() => Promise.resolve({})),
      findFirst: vi.fn(() => Promise.resolve(null)),
    },
  },
}));

vi.mock("@/lib/db-retry", () => ({
  dbRetry: vi.fn((fn: () => unknown) => fn()),
}));

vi.mock("@/lib/api-handler", () => ({
  safeHandler: vi.fn((fn: unknown) => fn),
}));

vi.mock("@/lib/audit", () => ({ audit: vi.fn() }));
vi.mock("@/lib/redis", () => ({ cacheDel: vi.fn(async () => {}) }));
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: vi.fn(async () => ({})) } })),
}));
vi.mock("@/lib/cancellation-email", () => ({
  buildCancellationEmail: vi.fn(() => "<html>cancelled</html>"),
}));

import { POST } from "@/app/api/stripe/webhook/route";
import { prisma } from "@/lib/prisma";

/* # Helper: create a webhook request with text body + signature header */
function makeWebhookRequest(body: string, signature?: string) {
  const headers: Record<string, string> = { "Content-Type": "text/plain" };
  if (signature) headers["stripe-signature"] = signature;
  return new NextRequest("http://localhost:3000/api/stripe/webhook", {
    method: "POST",
    headers,
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.STRIPE_PRO_PRICE_ID = "price_pro_monthly";
  process.env.STRIPE_PRO_ANNUAL_PRICE_ID = "price_pro_annual";
  process.env.RESEND_API_KEY = "re_test";
});

describe("POST /api/stripe/webhook", () => {
  /* # Missing signature should be rejected immediately */
  it("returns 400 when no stripe-signature header", async () => {
    const req = makeWebhookRequest("{}");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("No signature");
  });

  /* # Invalid signature triggers constructEvent to throw */
  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const req = makeWebhookRequest("{}", "sig_invalid");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid webhook signature");
  });

  /* # Successful checkout should upgrade user to pro */
  it("upgrades user to pro on checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_123" },
          subscription: "sub_abc",
        },
      },
    });
    mockRetrieve.mockResolvedValue({
      items: { data: [{ price: { id: "price_pro_monthly" } }] },
    });

    const req = makeWebhookRequest("{}", "sig_valid");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user_123" },
      data: {
        plan: "pro",
        stripeSubId: "sub_abc",
        aiUsageCount: 0,
      },
    });
  });

  /* # Subscription deletion should downgrade user to free */
  it("downgrades to free on customer.subscription.deleted", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: { id: "sub_abc" },
      },
    });
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: "user_456",
      email: "test@example.com",
      name: "Test User",
    } as any);

    const req = makeWebhookRequest("{}", "sig_valid");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user_456" },
      data: { plan: "free", stripeSubId: null },
    });
  });

  /* # Subscription update changes the plan based on price ID */
  it("updates plan on customer.subscription.updated", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_abc",
          items: { data: [{ price: { id: "price_pro_annual" } }] },
        },
      },
    });
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "user_789" } as any);

    const req = makeWebhookRequest("{}", "sig_valid");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user_789" },
      data: { plan: "pro" },
    });
  });

  /* # Unknown event types should be acknowledged without error */
  it("returns 200 for unknown event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    });

    const req = makeWebhookRequest("{}", "sig_valid");
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  /* # Missing userId in checkout metadata — should not crash */
  it("handles missing userId in checkout metadata", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {},
          subscription: "sub_orphan",
        },
      },
    });

    const req = makeWebhookRequest("{}", "sig_valid");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
