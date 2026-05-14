/* ============================================================
   UPGRADE PROMPT - Contextual Upgrade Banner
   ============================================================
   Shows when a free user hits their AI usage limit or is
   running low. Non-intrusive — appears inline where the AI
   result would normally show. Dismissable.
   ============================================================ */

"use client";

import { useState } from "react";

interface UpgradePromptProps {
  remaining: number | "unlimited";
  plan: string;
}

export default function UpgradePrompt({ remaining, plan }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Don't show for pro/admin users or if dismissed */
  if (plan !== "free" || remaining === "unlimited" || dismissed) return null;

  /* Only show when running low (5 or fewer) or depleted */
  if (typeof remaining === "number" && remaining > 5) return null;

  const isOut = remaining === 0;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      /* Silent fail — user can try from settings */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl border p-4 mb-4 ${
      isOut
        ? "bg-red-500/10 border-red-500/20"
        : "bg-yellow-500/10 border-yellow-500/20"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isOut ? "text-red-400" : "text-yellow-400"}`}>
            {isOut
              ? "You've used all 20 free AI calls this month"
              : `Only ${remaining} free AI calls remaining this month`
            }
          </p>
          <p className="text-xs text-text-muted mt-1">
            Upgrade to Pro for 1,000 calls/month — that&apos;s ~33 per day, effectively unlimited.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-brand-indigo text-white rounded-lg hover:bg-brand-indigo/80 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Upgrade — £29/mo"}
          </button>
          {!isOut && (
            <button
              onClick={() => setDismissed(true)}
              className="text-text-muted hover:text-white text-xs px-2"
              aria-label="Dismiss"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
