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
