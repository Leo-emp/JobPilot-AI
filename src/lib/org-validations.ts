/* ============================================================
   ORG VALIDATION SCHEMAS — Zod schemas for /api/org/* routes
   ============================================================
   All org-related input validation. Uses the same reusable field
   pattern as src/lib/validations.ts but in a separate file to
   keep the existing validations untouched (additive-only rule).
   ============================================================ */

import { z } from "zod";

/* # Create organization — admin-only, manual setup for pilots */
export const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z.string().trim().min(1).max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.enum(["agency", "bootcamp", "university", "outplacement"]).default("agency"),
  billingEmail: z.string().trim().toLowerCase().email("Invalid email"),
  seatLimit: z.number().int().min(1).max(1000).default(25),
});

/* # Update organization — partial, admin+ role required */
export const updateOrgSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  logoUrl: z.string().url().max(2000).optional().or(z.literal("")),
  billingEmail: z.string().trim().toLowerCase().email().optional(),
  seatLimit: z.number().int().min(1).max(1000).optional(),
});

/* # Bulk invite candidates — max 500 per request to prevent abuse */
export const bulkInviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().trim().toLowerCase().email("Invalid email"),
      role: z.enum(["candidate", "coach"]).default("candidate"),
      cohort: z.string().trim().max(100).optional(),
    })
  ).min(1, "At least one invite required").max(500, "Maximum 500 invites per request"),
});

/* # Accept invite — public route, token-based auth */
export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invite token is required").max(256),
});

/* # Update member role — admin+ role required */
export const updateMemberSchema = z.object({
  role: z.enum(["candidate", "coach", "admin", "owner"]),
});
