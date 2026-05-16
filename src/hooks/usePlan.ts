/* ============================================================
   usePlan Hook — Shared plan + remaining state for AI pages
   ============================================================
   Fetches plan on mount. Exposes `updateRemaining()` for AI
   pages to call after each AI response. Provides correct plan
   value to UpgradePrompt instead of hardcoding "free".
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";

interface PlanState {
  plan: string;
  remaining: number | "unlimited" | null;
  loading: boolean;
  updateRemaining: (val: number | "unlimited") => void;
}

export function usePlan(): PlanState {
  const [plan, setPlan] = useState("free");
  const [remaining, setRemaining] = useState<number | "unlimited" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.plan) setPlan(data.plan);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateRemaining = useCallback((val: number | "unlimited") => {
    setRemaining(val);
  }, []);

  return { plan, remaining, loading, updateRemaining };
}
