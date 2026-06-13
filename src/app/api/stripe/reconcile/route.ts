/* ============================================================
   STRIPE RECONCILIATION API — GET /api/stripe/reconcile
   ============================================================
   Catches missed webhook events by comparing Stripe subscription
   status against our database. Designed to run as a daily cron.

   Fixes: user paid but webhook failed → they're stuck on free.
   Also catches: subscription cancelled in Stripe but DB still
   shows pro.

   Protected by a secret token (CRON_SECRET env var) so only
   authorized cron jobs can trigger it.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { getStripe } from "@/lib/stripe";
import { audit } from "@/lib/audit";
import { safeHandler } from "@/lib/api-handler";

export const GET = safeHandler(async (req: NextRequest) => {
  /* ---- Auth: only allow requests with the correct cron secret ---- */
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  let fixed = 0;
  let checked = 0;

  /* ---- Check users who have a Stripe subscription ID ---- */
  const usersWithSubs = await dbRetry(() =>
    prisma.user.findMany({
      where: {
        stripeSubId: { not: null },
        deletedAt: null,
      },
      select: { id: true, email: true, plan: true, stripeSubId: true },
    })
  );

  for (const user of usersWithSubs) {
    checked++;
    try {
      const sub = await stripe.subscriptions.retrieve(user.stripeSubId!);
      const priceId = sub.items.data[0]?.price.id;
      const expectedPlan = priceId === process.env.STRIPE_PRO_PRICE_ID ? "pro" : "enterprise";

      if (sub.status === "active" && user.plan !== expectedPlan) {
        /* User paid but DB has wrong plan — fix it */
        await dbRetry(() =>
          prisma.user.update({
            where: { id: user.id },
            data: { plan: expectedPlan },
          })
        );
        audit("payment.upgrade", { userId: user.id, email: user.email, plan: expectedPlan, detail: "reconciliation_fix" });
        fixed++;
      } else if (sub.status === "canceled" && user.plan !== "free") {
        /* Subscription cancelled but DB still shows paid — downgrade */
        await dbRetry(() =>
          prisma.user.update({
            where: { id: user.id },
            data: { plan: "free", stripeSubId: null },
          })
        );
        audit("payment.downgrade", { userId: user.id, email: user.email, plan: "free", detail: "reconciliation_fix" });
        fixed++;
      }
    } catch {
      /* Stripe API error for this user — skip, will retry next run */
    }
  }

  /* ---- Check Stripe for recent checkout sessions we might have missed ---- */
  const recentSessions = await stripe.checkout.sessions.list({
    limit: 50,
    created: { gte: Math.floor(Date.now() / 1000) - 86400 * 3 },
  });

  for (const session of recentSessions.data) {
    if (session.payment_status !== "paid" || !session.metadata?.userId) continue;
    checked++;

    const userId = session.metadata.userId;
    const user = await dbRetry(() =>
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, plan: true, stripeSubId: true },
      })
    );

    if (user && user.plan === "free" && session.subscription) {
      /* User paid via checkout but never got upgraded — fix it */
      const subId = typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;

      await dbRetry(() =>
        prisma.user.update({
          where: { id: userId },
          data: { plan: "pro", stripeSubId: subId, aiUsageCount: 0 },
        })
      );
      audit("payment.upgrade", { userId, email: user.email, plan: "pro", detail: "checkout_reconciliation_fix" });
      fixed++;
    }
  }

  return NextResponse.json({
    success: true,
    checked,
    fixed,
    timestamp: new Date().toISOString(),
  });
});
