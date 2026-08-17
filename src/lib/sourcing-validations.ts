/* ============================================================
   SOURCING VALIDATIONS — Zod schemas for external sourcing
   ============================================================ */

import { z } from "zod";

/* # Trigger sourcing for a specific role */
export const triggerSourcingSchema = z.object({
  sources: z
    .array(z.enum(["github", "stackoverflow", "portfolio"]))
    .min(1)
    .default(["github", "stackoverflow", "portfolio"]),
});

/* # Conversion token verification */
export const conversionTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
