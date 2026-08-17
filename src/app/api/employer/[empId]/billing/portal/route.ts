/* ============================================================
   EMPLOYER BILLING PORTAL — POST /api/employer/[empId]/billing/portal
   ============================================================
   Creates a Stripe Billing Portal session so employer owners can:
   - View subscription details
   - Update payment method
   - Cancel subscription
   - View invoice history

   All managed by Stripe — no custom UI needed.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { getStripe } from "@/lib/stripe";

export const POST = employerHandler(async (_req, _session, membership) => {
  /* # Fetch the employer's Stripe customer ID */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
      select: { stripeCustomerId: true },
    })
  );

  if (!employer?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to a plan first." },
      { status: 400 },
    );
  }

  /* # Create a billing portal session */
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://jobpilotai.co";

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: employer.stripeCustomerId,
    return_url: `${baseUrl}/employer/${membership.employerId}/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}, "owner");
