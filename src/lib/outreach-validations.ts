/* ============================================================
   OUTREACH VALIDATIONS — Zod schemas for recruiting routes
   ============================================================ */

import { z } from "zod";

/* # Queue outreach for candidates on a role */
export const queueOutreachSchema = z.object({
  candidateMatchIds: z
    .array(z.string().min(1))
    .min(1, "At least one candidate match required")
    .max(50, "Maximum 50 candidates per batch"),
});

/* # Create a shortlist */
export const createShortlistSchema = z.object({
  name: z.string().min(1).max(100).default("Shortlist"),
});

/* # Add entry to shortlist */
export const addShortlistEntrySchema = z.object({
  candidateMatchId: z.string().min(1, "Candidate match ID required"),
  employerNote: z.string().max(1000).optional(),
});

/* # Resend webhook event for delivery/open/bounce tracking */
export const resendWebhookSchema = z.object({
  type: z.enum([
    "email.sent",
    "email.delivered",
    "email.opened",
    "email.bounced",
    "email.complained",
  ]),
  data: z.object({
    email_id: z.string().optional(),
    to: z.array(z.string()).optional(),
    from: z.string().optional(),
  }),
});

/* # Opt-out request */
export const optOutSchema = z.object({
  email: z.string().email("Valid email required"),
});

/* # Reply webhook (Resend inbound) */
export const replyWebhookSchema = z.object({
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  text: z.string().optional(),
  html: z.string().optional(),
});
