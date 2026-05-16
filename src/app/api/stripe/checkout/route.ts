/* ============================================================
   STRIPE CHECKOUT API - Create Checkout Session
   ============================================================
   POST /api/stripe/checkout
   Creates a Stripe Checkout session for plan upgrades.
   Redirects the user to Stripe's hosted payment page.
   After payment, Stripe redirects back to our success URL.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { stripeCheckoutSchema, formatZodError } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    /* User must be logged in to purchase a plan */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = stripeCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { plan, interval } = parsed.data;

    /* Validate the requested plan — pick monthly or annual price */
    const priceId = plan === "pro"
      ? (interval === "year" ? PRICE_IDS.proAnnual : PRICE_IDS.pro)
      : "";
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or Stripe not configured." },
        { status: 400 }
      );
    }

    /* Get the user from the database (with retry for transient failures) */
    const user = await dbRetry(() =>
      prisma.user.findUnique({ where: { id: session.user.id } })
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    /* ---- Create or Reuse Stripe Customer ---- */
    /* If the user already has a Stripe customer ID, reuse it */
    /* Otherwise, create a new Stripe customer */
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      /* Save the Stripe customer ID to the database (with retry) */
      await dbRetry(() =>
        prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        })
      );
    }

    /* ---- Create Checkout Session ---- */
    /* This generates a URL for Stripe's hosted payment page */
    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      /* The price ID tells Stripe which product/plan to charge for */
      line_items: [{ price: priceId, quantity: 1 }],
      /* Where to redirect after success or cancellation */
      success_url: `${baseUrl}/dashboard/settings?upgraded=true`,
      cancel_url: `${baseUrl}/dashboard/settings?cancelled=true`,
      /* Store the user ID so we can match it in the webhook */
      metadata: { userId: user.id },
    });

    /* Return the checkout URL — frontend will redirect to it */
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong with checkout. Please try again." },
      { status: 500 }
    );
  }
}
