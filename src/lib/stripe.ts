/* ============================================================
   STRIPE CLIENT - Payment Processing Setup
   ============================================================
   Creates a Stripe instance lazily — only when actually needed.
   This prevents build errors when Stripe keys aren't configured yet.

   Setup: Add your Stripe keys to .env:
   - STRIPE_SECRET_KEY (from Stripe Dashboard → API Keys)
   - STRIPE_PUBLISHABLE_KEY (for client-side)
   - STRIPE_WEBHOOK_SECRET (from Stripe Dashboard → Webhooks)
   ============================================================ */

import Stripe from "stripe";

/* ---- Lazy Stripe Instance ---- */
/* Only created when getStripe() is called, not at import time */
/* This prevents the "no apiKey" error during build when keys aren't set */
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to .env");
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }

  return stripeInstance;
}

/* ---- Price IDs ---- */
/* These map to the products you create in the Stripe Dashboard */
/* Replace with your actual Stripe Price IDs after creating products */
export const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || "",
  proAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "",
};

/* ---- Employer Price IDs ---- */
/* Separate Stripe products for employer B2B plans */
/* Create these in the Stripe Dashboard under a "JobPilot Employer" product group */
export const EMPLOYER_PRICE_IDS = {
  pro: process.env.STRIPE_EMPLOYER_PRO_PRICE_ID || "",           // $299/mo
  proAnnual: process.env.STRIPE_EMPLOYER_PRO_ANNUAL_PRICE_ID || "",  // $249/mo billed annually
  enterprise: process.env.STRIPE_EMPLOYER_ENTERPRISE_PRICE_ID || "",       // $999/mo
  enterpriseAnnual: process.env.STRIPE_EMPLOYER_ENTERPRISE_ANNUAL_PRICE_ID || "",  // $799/mo billed annually
};

/* # Helper: resolve employer plan from a Stripe price ID */
export function resolveEmployerPlan(priceId: string): "pro" | "enterprise" | null {
  if (!priceId) return null;
  const proIds = [EMPLOYER_PRICE_IDS.pro, EMPLOYER_PRICE_IDS.proAnnual].filter(Boolean);
  const entIds = [EMPLOYER_PRICE_IDS.enterprise, EMPLOYER_PRICE_IDS.enterpriseAnnual].filter(Boolean);
  if (proIds.includes(priceId)) return "pro";
  if (entIds.includes(priceId)) return "enterprise";
  return null;
}

/* # Plan feature limits for employer tiers (server-side enforcement) */
export const EMPLOYER_PLAN_LIMITS = {
  free: {
    activeRoles: 1,
    bookmarksPerMonth: 5,
    candidateProfileAccess: "limited" as const,  // name + skills only
    matching: "basic" as const,                  // top 10 only
    shortlists: false,
    outreach: false,
    messaging: "mutual" as const,                // mutual interest only
  },
  pro: {
    activeRoles: 5,
    bookmarksPerMonth: 50,
    candidateProfileAccess: "full" as const,     // full profiles + scores
    matching: "full" as const,                   // full ranked list
    shortlists: true,                            // internal only
    outreach: false,
    messaging: "mutual" as const,
  },
  enterprise: {
    activeRoles: Infinity,
    bookmarksPerMonth: Infinity,
    candidateProfileAccess: "full_ai" as const,  // full + AI summaries
    matching: "full_external" as const,          // full + external sourcing
    shortlists: true,                            // internal + external
    outreach: true,                              // full agent pipeline
    messaging: "direct" as const,                // message any match
  },
} as const;

export type EmployerPlanTier = keyof typeof EMPLOYER_PLAN_LIMITS;
