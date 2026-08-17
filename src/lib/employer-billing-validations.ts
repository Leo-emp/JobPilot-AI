/* ============================================================
   EMPLOYER BILLING VALIDATIONS — Zod schemas for billing routes
   ============================================================
   Validates checkout and portal requests for employer Stripe
   subscription management.
   ============================================================ */

import { z } from "zod";

/* # POST /api/employer/[empId]/billing/checkout */
/* Employers can upgrade to pro or enterprise, monthly or annual */
export const employerCheckoutSchema = z.object({
  plan: z.enum(["pro", "enterprise"], "Plan must be 'pro' or 'enterprise'."),
  interval: z.enum(["month", "year"]).optional().default("month"),
});
