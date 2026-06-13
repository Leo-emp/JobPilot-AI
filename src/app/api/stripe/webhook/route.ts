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
import Stripe from "stripe";
import { safeHandler } from "@/lib/api-handler";

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
    /* A checkout session was completed — user paid successfully */
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        /* Fetch the subscription to determine which plan they bought */
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;

        /* Determine plan name from the price ID (monthly or annual) */
        const proIds = [process.env.STRIPE_PRO_PRICE_ID, process.env.STRIPE_PRO_ANNUAL_PRICE_ID];
        const plan = proIds.includes(priceId) ? "pro" : "enterprise";

        /* Update the user's plan in our database (with retry — payment is critical) */
        await dbRetry(() =>
          prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeSubId: subscriptionId,
              /* Reset usage counter on upgrade */
              aiUsageCount: 0,
            },
          })
        );

        audit("payment.upgrade", { userId, plan, detail: `subscription:${subscriptionId}` });
        await cacheDel(`plan:${userId}`);
      }
      break;
    }

    /* Subscription was cancelled or expired */
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      /* Find the user with this subscription ID and downgrade to free */
      const user = await dbRetry(() =>
        prisma.user.findFirst({ where: { stripeSubId: subscription.id } })
      );

      if (user) {
        await dbRetry(() =>
          prisma.user.update({
            where: { id: user.id },
            data: { plan: "free", stripeSubId: null },
          })
        );
        audit("payment.cancelled", { userId: user.id, detail: `subscription:${subscription.id}` });
        await cacheDel(`plan:${user.id}`);

        /* Send cancellation email with retry — user must receive this */
        if (user.email) {
          const emailPayload = {
            from: "JobPilot AI <noreply@jobpilotai.co>",
            to: user.email,
            subject: "Your JobPilot AI Pro plan has ended",
            html: buildCancellationEmail(user.name || "there"),
          };
          const maxRetries = 3;
          (async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                await getResend().emails.send(emailPayload);
                return;
              } catch (err) {
                if (attempt === maxRetries) {
                  console.error(`Cancellation email failed after ${maxRetries} attempts for ${user.email}:`, err);
                } else {
                  await new Promise(r => setTimeout(r, 1000 * attempt));
                }
              }
            }
          })();
        }
      }
      break;
    }

    /* Subscription was updated (upgrade/downgrade between plans) */
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;

      /* Find the user with this subscription */
      const user = await dbRetry(() =>
        prisma.user.findFirst({ where: { stripeSubId: subscription.id } })
      );

      if (user && priceId) {
        const proIds = [process.env.STRIPE_PRO_PRICE_ID, process.env.STRIPE_PRO_ANNUAL_PRICE_ID];
        const plan = proIds.includes(priceId) ? "pro" : "enterprise";
        await dbRetry(() =>
          prisma.user.update({ where: { id: user.id }, data: { plan } })
        );
        await cacheDel(`plan:${user.id}`);
      }
      break;
    }
  }

  /* Always return 200 to acknowledge receipt of the webhook */
  return NextResponse.json({ received: true });
});
