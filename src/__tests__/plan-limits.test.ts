/* ============================================================
   PLAN LIMITS TESTS — Verify all plans have explicit limits
   ============================================================ */

import { describe, it, expect } from "vitest";
import { PLAN_LIMITS } from "@/lib/plan-limits";

describe("PLAN_LIMITS", () => {
  it("has a limit for the enterprise plan", () => {
    /* # Enterprise plan should NOT fall through to free limit */
    expect(PLAN_LIMITS.enterprise).toBeDefined();
    expect(PLAN_LIMITS.enterprise).toBeGreaterThan(PLAN_LIMITS.free);
  });

  it("all known plans have explicit limits", () => {
    /* # Every plan name that Stripe might set must have a limit */
    const plans = ["free", "pro", "enterprise"];
    for (const plan of plans) {
      expect(PLAN_LIMITS[plan]).toBeDefined();
      expect(PLAN_LIMITS[plan]).toBeGreaterThan(0);
    }
  });

  it("free plan has the lowest limit", () => {
    /* # Free plan should always be the most restrictive */
    expect(PLAN_LIMITS.free).toBeLessThanOrEqual(PLAN_LIMITS.pro);
    expect(PLAN_LIMITS.free).toBeLessThanOrEqual(PLAN_LIMITS.enterprise);
  });
});
