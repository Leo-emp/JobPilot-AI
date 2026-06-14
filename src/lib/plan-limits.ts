/* ============================================================
   PLAN LIMITS — Single source of truth for all plan quotas
   ============================================================
   Import this everywhere instead of hardcoding limits.
   Prevents drift between AI routes, admin stats, etc.
   ============================================================ */

/* # Monthly AI call limits per plan */
export const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 1000,
};
