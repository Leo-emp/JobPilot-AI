/* ============================================================
   B2B FEATURE GATE — Controls access to all B2B features
   ============================================================
   All B2B functionality (employer dashboard, public job board,
   recruiting pipeline, outreach, etc.) is gated behind the
   B2B_ENABLED env var. When false/unset, all B2B routes return
   404 and pages redirect to the main dashboard.

   To activate B2B:
   1. Set B2B_ENABLED=true in .env and Vercel
   2. Redeploy

   This keeps B2C live while B2B is being built and tested.
   ============================================================ */

/* # Check if B2B features are enabled */
export function isB2BEnabled(): boolean {
  return process.env.B2B_ENABLED === "true";
}
