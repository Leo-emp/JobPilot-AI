/* ============================================================
   STRIPE WEBHOOK API - Handle Payment Events
   ============================================================
   POST /api/stripe/webhook
   Stripe sends events here when payments succeed, fail,
   or subscriptions change. This is how we know to upgrade
   or downgrade a user's plan in our database.

   Important: This route MUST receive the raw body (not parsed JSON)
   so Stripe can verify the webhook signature.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { getStripe } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";
import { buildCancellationEmail } from "@/lib/cancellation-email";
import { buildUpgradeEmail } from "@/lib/upgrade-email";
import Stripe from "stripe";
import { safeHandler } from "@/lib/api-handler";
import {
  handleEmployerCheckout,
  handleEmployerCancellation,
  handleEmployerUpdate,
} from "@/lib/employer-webhook";

/* # Lazy-init so missing env var doesn't crash the module on import */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export const POST = safeHandler(async (req: NextRequest) => {
  /* ---- Verify Webhook Signature ---- */
  /* Stripe signs every webhook with a secret so we can verify authenticity */
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  /* ---- Handle Different Event Types ---- */
  switch (event.type) {
    /* A checkout session was completed — user or employer paid successfully */
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      /* # Route employer checkouts to the employer webhook handler */
      if (session.metadata?.type === "employer") {
        await handleEmployerCheckout(session, getStripe());
        break;
      }

      /* # Handle top-up pack purchases — add bonus calls to user's account */
      if (session.metadata?.type === "topup") {
        const topupUserId = session.metadata.userId;
        const topupCalls = parseInt(session.metadata.calls || "0");
        if (topupUserId && topupCalls > 0) {
          await dbRetry(() =>
            prisma.user.update({
              where: { id: topupUserId },
              data: { bonusCalls: { increment: topupCalls } },
            })
          );
          audit("payment.topup", { userId: topupUserId, detail: `+${topupCalls} calls, pack:${session.metadata.packId}` });
          await cacheDel(`plan:${topupUserId}`);
        }
        break;
      }

      const userId = session.metadata?.userId;
      /* # Type guard: Stripe can return string OR Subscription object */
      const subscriptionId = typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

      if (userId && subscriptionId) {
        /* Fetch the subscription to determine which plan they bought */
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        /* Determine plan name from the price ID (monthly or annual) */
        const proIds = [process.env.STRIPE_PRO_PRICE_ID, process.env.STRIPE_PRO_ANNUAL_PRICE_ID];
        const plan = proIds.includes(priceId) ? "pro" : "enterprise";

        /* Update the user's plan in our database (with retry — payment is critical) */
        await dbRetry(() =>
  