/* ============================================================
   STRIPE BILLING PORTAL API - Self-Service Billing
   ============================================================
   POST /api/stripe/portal
   Creates a Stripe Billing Portal session so users can:
   - View their subscription details
   - Update payment method
   - Cancel their subscription
   - View invoice history
   All managed by Stripe — no custom UI needed.
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    /* User must be logged in */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* Get the user's Stripe customer ID */
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe to a plan first." },
        { status: 400 }
      );
    }

    /* Create a billing portal session */
    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Portal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
