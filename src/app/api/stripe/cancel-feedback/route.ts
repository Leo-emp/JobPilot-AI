/* ============================================================
   CANCELLATION FEEDBACK API — Save reason before Stripe portal
   ============================================================
   POST /api/stripe/cancel-feedback
   Saves the user's cancellation reason + optional feedback,
   then returns the Stripe billing portal URL so the frontend
   can redirect them to actually cancel.

   GET /api/stripe/cancel-feedback
   Admin-only: returns aggregated churn reasons for the dashboard.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { getStripe } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { safeHandler, authHandler } from "@/lib/api-handler";
import { z } from "zod";
import { auth } from "@/lib/auth";

/* # Valid cancellation reasons — matches the survey options in the UI */
const VALID_REASONS = [
  "too_expensive",
  "not_using",
  "missing_features",
  "found_alternative",
  "too_complex",
  "other",
] as const;

/* # Zod schema for the cancellation feedback payload */
const cancelFeedbackSchema = z.object({
  reason: z.enum(VALID_REASONS),
  feedback: z.string().max(1000).optional(), // Optional free-text details
});

/* ---- POST: Save cancellation feedback + return portal URL ---- */
export const POST = authHandler(async (request, session) => {
  /* # Parse and validate the request body */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = cancelFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback data" }, { status: 400 });
  }

  /* # Save the cancellation reason to the user's record */
  const user = await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        cancellationReason: parsed.data.reason,
        cancellationFeedback: parsed.data.feedback || null,
        cancellationDate: new Date(),
      },
      select: { stripeCustomerId: true },
    })
  );

  /* # Log it for the audit trail */
  audit("cancellation.feedback", {
    userId: session.user.id,
    reason: parsed.data.reason,
    hasFeedback: !!parsed.data.feedback,
  });

  /* # Create a Stripe billing portal session so they can proceed with cancellation */
  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL || "https://jobpilotai.co"}/dashboard/settings?cancelled=true`,
  });

  return NextResponse.json({ url: portalSession.url });
});

/* ---- GET: Admin-only churn reasons breakdown ---- */
export const GET = safeHandler(async (_req: NextRequest) => {
  /* # Only admins can see aggregated churn data */
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  /* # Count cancellation reasons across all users who ever cancelled */
  const reasons = await dbRetry(() =>
    prisma.user.groupBy({
      by: ["cancellationReason"],
      where: { cancellationReason: { not: null } },
      _count: { cancellationReason: true },
      orderBy: { _count: { cancellationReason: "desc" } },
    })
  );

  /* # Get recent cancellations with details for the admin feed */
  const recentCancellations = await dbRetry(() =>
    prisma.user.findMany({
      where: { cancellationReason: { not: null } },
      select: {
        email: true,
        cancellationReason: true,
        cancellationFeedback: true,
        cancellationDate: true,
      },
      orderBy: { cancellationDate: "desc" },
      take: 20,
    })
  );

  /* # Total cancellations count */
  const totalCancellations = await dbRetry(() =>
    prisma.user.count({ where: { cancellationReason: { not: null } } })
  );

  return NextResponse.json({
    total: totalCancellations,
    reasons: reasons.map(r => ({
      reason: r.cancellationReason,
      count: r._count.cancellationReason,
    })),
    recent: recentCancellations,
  });
});
