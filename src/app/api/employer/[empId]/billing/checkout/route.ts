/* ============================================================
   EMPLOYER BILLING CHECKOUT — POST /api/employer/[empId]/billing/checkout
   ============================================================
   Creates a Stripe Checkout session for employer plan upgrades.
   Redirects the employer to Stripe's hosted payment page.

   Only the employer owner can initiate billing actions.
   Uses separate Stripe products from B2C (user) plans.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { employerHandler } from "@/lib/employer-handler";
import { getStripe, EMPLOYER_PRICE_IDS } from "@/lib/stripe";
import { employerCheckoutSchema } from "@/lib/employer-billing-validations";
import { formatZodError } from "@/lib/validations";
import { audit } from "@/lib/audit";

export const POST = employerHandler(async (req, session, membership) => {
  const body = await req.json();
  const parsed = employerCheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const { plan, interval } = parsed.data;

  /* # Resolve the correct Stripe price ID for this plan + interval */
  let priceId = "";
  if (plan === "pro") {
    priceId = interval === "year" ? EMPLOYER_PRICE_IDS.proAnnual : EMPLOYER_PRICE_IDS.pro;
  } else if (plan === "enterprise") {
    priceId = interval === "year" ? EMPLOYER_PRICE_IDS.enterpriseAnnual : EMPLOYER_PRICE_IDS.enterprise;
  }

  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe employer products are not configured. Contact support." },
      { status: 400 },
    );
  }

  /* # Fetch the employer to get/create Stripe customer */
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
      select: { id: true, name: true, plan: true, stripeCustomerId: true },
    })
  );

  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 });
  }

  /* # Don't allow checkout if already on this plan */
  if (employer.plan === plan) {
    return NextResponse.json(
      { error: `Already on the ${plan} plan. Use the billing portal to manage your subscription.` },
      { status: 400 },
    );
  }

  /* # Create or reuse Stripe customer for this employer */
  let customerId = employer.stripeCustomerId;

  if (!customerId) {
    /* # Fetch the owner's email for the Stripe customer record */
    const ownerUser = await dbRetry(() =>
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
      })
    );

    const customer = await getStripe().customers.create({
      email: ownerUser?.email ?? undefined,
      name: employer.name,
      metadata: {
        employerId: employer.id,
        type: "employer",
      },
    });
    customerId = customer.id;

    /* # Save the customer ID to the employer record */
    await dbRetry(() =>
      prisma.employer.update({
        where: { id: employer.id },
        data: { stripeCustomerId: customerId },
      })
    );
  }

  /* # Create the Stripe Checkout session */
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://jobpilotai.co";

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/employer/${employer.id}/billing?upgraded=true`,
    cancel_url: `${baseUrl}/employer/${employer.id}/billing?cancelled=true`,
    /* # Store employer ID + plan in metadata for webhook processing */
    metadata: {
      employerId: employer.id,
      type: "employer",
      plan,
    },
  });

  audit("employer.billing.checkout", {
    userId: session.user.id,
    detail: `employer:${employer.id} plan:${plan} interval:${interval}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}, "owner");
