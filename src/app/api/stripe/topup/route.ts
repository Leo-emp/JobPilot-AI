/* ============================================================
   STRIPE TOP-UP CHECKOUT — One-Time AI Call Packs
   ============================================================
   POST /api/stripe/topup
   Creates a Stripe Checkout session for one-time top-up packs.
   Unlike subscriptions, these are single payments that add
   bonus AI calls to the user's account.

   Packs:
   - £5 → 50 AI calls
   - £10 → 120 AI calls
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { getStripe, TOPUP_PACKS } from "@/lib/stripe";
import { safeHandler } from "@/lib/api-handler";

export const POST = safeHandler(async (req: NextRequest) => {
  /* # User must be logged in to purchase */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const packId = body.packId as string;

  /* # Find the requested pack */
  const pack = TOPUP_PACKS.find(p => p.id === packId);
  if (!pack || !pack.priceId) {
    return NextResponse.json(
      { error: "Invalid top-up pack or Stripe not configured." },
      { status: 400 }
    );
  }

  /* # Get or create Stripe customer */
  const user = await dbRetry(() =>
    prisma.user.findUnique({ where: { id: session.user.id } })
  );

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    await dbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    );
  }

  /* # Create one-time payment checkout (mode: "payment", not "subscription") */
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: pack.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/settings?topup=success&calls=${pack.calls}`,
    cancel_url: `${baseUrl}/dashboard/settings?topup=cancelled`,
    /* # Store userId + pack info so the webhook can credit the calls */
    metadata: {
      userId: user.id,
      type: "topup",
      packId: pack.id,
      calls: String(pack.calls),
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
});
