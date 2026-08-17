/* ============================================================
   EMPLOYER WEBHOOK HANDLER — Stripe event processor for employer plans
   ============================================================
   Handles Stripe webhook events for employer subscriptions separately
   from B2C user subscriptions. Called by the main webhook route when
   the event metadata contains type: "employer".

   Employer subscriptions:
   - Use EMPLOYER_PRICE_IDS (not B2C PRICE_IDS)
   - Update Employer.plan (not User.plan)
   - Send employer-specific notification emails
   ============================================================ */

import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { audit } from "@/lib/audit";
import { resolveEmployerPlan } from "@/lib/stripe";

/* # Lazy Resend instance */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/* # Handle employer checkout completion */
export async function handleEmployerCheckout(session: Stripe.Checkout.Session, stripe: Stripe): Promise<void> {
  const employerId = session.metadata?.employerId;
  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id;

  if (!employerId || !subscriptionId) return;

  /* # Fetch the subscription to determine which plan they bought */
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  const plan = resolveEmployerPlan(priceId);
  if (!plan) return;

  /* # Update the employer's plan in our database */
  await dbRetry(() =>
    prisma.employer.update({
      where: { id: employerId },
      data: {
        plan,
        stripeSubId: subscriptionId,
      },
    })
  );

  audit("employer.billing.upgraded", {
    detail: `employer:${employerId} plan:${plan} subscription:${subscriptionId}`,
  });

  /* # Send upgrade confirmation email to the owner */
  const owner = await dbRetry(() =>
    prisma.employerMember.findFirst({
      where: { employerId, role: "owner" },
      include: { user: { select: { email: true, name: true } } },
    })
  );

  if (owner?.user?.email) {
    const planLabel = plan === "enterprise" ? "Enterprise" : "Pro";
    getResend().emails.send({
      from: "JobPilot AI <noreply@jobpilotai.co>",
      to: owner.user.email,
      subject: `Your company is now on the ${planLabel} plan`,
      text: [
        `Hi ${owner.user.name || "there"},`,
        "",
        `Your employer account has been upgraded to the ${planLabel} plan.`,
        "",
        plan === "enterprise"
          ? "You now have access to unlimited roles, AI outreach, external sourcing, and direct messaging."
          : "You now have access to 5 active roles, full candidate profiles, and shortlist delivery.",
        "",
        "Visit your billing page to manage your subscription.",
        "",
        "-- JobPilot AI",
      ].join("\n"),
    }).catch((err) => {
      console.error(`Employer upgrade email failed for ${owner.user.email}:`, err);
    });
  }
}

/* # Handle employer subscription cancellation */
export async function handleEmployerCancellation(subscription: Stripe.Subscription): Promise<void> {
  /* # Find the employer with this subscription ID */
  const employer = await dbRetry(() =>
    prisma.employer.findFirst({
      where: { stripeSubId: subscription.id },
      select: { id: true, name: true },
    })
  );

  if (!employer) return;

  /* # Downgrade to free */
  await dbRetry(() =>
    prisma.employer.update({
      where: { id: employer.id },
      data: { plan: "free", stripeSubId: null },
    })
  );

  audit("employer.billing.cancelled", {
    detail: `employer:${employer.id} subscription:${subscription.id}`,
  });

  /* # Notify the owner */
  const owner = await dbRetry(() =>
    prisma.employerMember.findFirst({
      where: { employerId: employer.id, role: "owner" },
      include: { user: { select: { email: true, name: true } } },
    })
  );

  if (owner?.user?.email) {
    getResend().emails.send({
      from: "JobPilot AI <noreply@jobpilotai.co>",
      to: owner.user.email,
      subject: "Your employer plan has been downgraded",
      text: [
        `Hi ${owner.user.name || "there"},`,
        "",
        `Your ${employer.name} employer subscription has ended.`,
        "Your account is now on the Free plan with limited features.",
        "",
        "You can re-subscribe any time from your billing page.",
        "",
        "-- JobPilot AI",
      ].join("\n"),
    }).catch((err) => {
      console.error(`Employer cancel email failed for ${owner.user.email}:`, err);
    });
  }
}

/* # Handle employer subscription update (plan change) */
export async function handleEmployerUpdate(subscription: Stripe.Subscription): Promise<void> {
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  const plan = resolveEmployerPlan(priceId);
  if (!plan) return;

  /* # Find the employer */
  const employer = await dbRetry(() =>
    prisma.employer.findFirst({
      where: { stripeSubId: subscription.id },
      select: { id: true },
    })
  );

  if (!employer) return;

  await dbRetry(() =>
    prisma.employer.update({
      where: { id: employer.id },
      data: { plan },
    })
  );

  audit("employer.billing.updated", {
    detail: `employer:${employer.id} plan:${plan}`,
  });
}

/* # Check if a Stripe event is employer-related */
export function isEmployerEvent(event: Stripe.Event): boolean {
  const obj = event.data.object as unknown as Record<string, unknown>;

  /* # Checkout sessions have metadata */
  if (event.type === "checkout.session.completed") {
    const metadata = obj.metadata as Record<string, string> | undefined;
    return metadata?.type === "employer";
  }

  /* # For subscription events, check if any employer has this sub ID */
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.updated"
  ) {
    const subId = obj.id as string;
    /* # We'll check the DB in the handler — can't do async here */
    /* # Instead, check the customer metadata if available */
    const metadata = obj.metadata as Record<string, string> | undefined;
    if (metadata?.type === "employer") return true;
    /* # Fallback: the main webhook will try employer handler, which checks DB */
    return false;
  }

  return false;
}
