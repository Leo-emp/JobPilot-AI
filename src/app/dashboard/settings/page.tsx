/* ============================================================
   SETTINGS PAGE
   ============================================================
   User account settings, plan management, and billing.
   Shows current plan, profile info, usage stats, and
   connects to Stripe for plan upgrades and billing management.
   ============================================================ */

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

/* ---- User plan data from the API ---- */
interface UserPlan {
  plan: string;
  aiUsageCount: number;
  usageResetDate: string;
}

export default function SettingsPage() {
  /* Get the current user session */
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  /* Plan and billing state */
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* Check for Stripe redirect messages */
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setMessage("Your plan has been upgraded successfully!");
    } else if (searchParams.get("cancelled") === "true") {
      setMessage("Checkout was cancelled. No changes were made.");
    }
  }, [searchParams]);

  /* ---- Fetch User Plan Info ---- */
  const fetchPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const data = await res.json();
        setUserPlan(data);
      }
    } catch {
      /* Silent fail */
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  /* ---- Handle Plan Upgrade ---- */
  /* Creates a Stripe Checkout session and redirects to payment */
  const handleUpgrade = async (plan: string) => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (data.url) {
        /* Redirect to Stripe Checkout page */
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to start checkout.");
      }
    } catch {
      setMessage("Failed to connect to payment system.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  /* ---- Open Billing Portal ---- */
  /* Redirects to Stripe's self-service billing portal */
  const handleBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to open billing portal.");
      }
    } catch {
      setMessage("Failed to connect to billing system.");
    } finally {
      setPortalLoading(false);
    }
  };

  /* Calculate usage percentage */
  const usageLimit = userPlan?.plan === "free" ? 3 : -1;
  const usagePercent = usageLimit > 0 ? Math.min((userPlan?.aiUsageCount || 0) / usageLimit * 100, 100) : 0;

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Settings
      </h1>
      <p className="text-text-secondary mb-8">
        Manage your account, plan, and billing.
      </p>

      {/* ---- Status Message ---- */}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-light text-sm">
          {message}
          <button
            onClick={() => setMessage("")}
            className="ml-3 text-text-muted hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* ---- Profile Card ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Name</label>
              <p className="text-white">{session?.user?.name || "—"}</p>
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <p className="text-white">{session?.user?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* ---- Plan & Usage Card ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Current Plan</h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-full border ${
                userPlan?.plan === "pro"
                  ? "bg-brand-purple/20 text-brand-glow border-brand-purple/30"
                  : userPlan?.plan === "enterprise"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-brand-indigo/20 text-brand-light border-brand-indigo/30"
              }`}>
                {userPlan?.plan || "Free"}
              </span>
              <p className="text-text-secondary text-sm mt-3">
                {userPlan?.plan === "pro"
                  ? "Unlimited AI calls, all features unlocked."
                  : userPlan?.plan === "enterprise"
                  ? "Everything in Pro, plus team features and API access."
                  : "3 AI calls per month, basic features."}
              </p>
            </div>
            {userPlan?.plan === "free" && (
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={upgradeLoading}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {upgradeLoading ? "Loading..." : "Upgrade to Pro"}
              </button>
            )}
            {(userPlan?.plan === "pro" || userPlan?.plan === "enterprise") && (
              <button
                onClick={handleBillingPortal}
                disabled={portalLoading}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {portalLoading ? "Loading..." : "Manage Billing"}
              </button>
            )}
          </div>

          {/* ---- AI Usage Bar ---- */}
          {/* Visual progress bar showing AI calls used this month */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-secondary">AI Usage This Month</span>
              <span className="text-text-muted">
                {userPlan?.aiUsageCount || 0}
                {usageLimit > 0 ? ` / ${usageLimit}` : " (unlimited)"}
              </span>
            </div>
            {usageLimit > 0 && (
              <div className="w-full h-2 rounded-full bg-space-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent >= 100
                      ? "bg-red-500"
                      : usagePercent >= 66
                      ? "bg-yellow-500"
                      : "bg-brand-indigo"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
            {userPlan?.usageResetDate && (
              <p className="text-xs text-text-muted mt-2">
                Resets on {new Date(userPlan.usageResetDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* ---- System Status Card ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-text-secondary text-sm">AI Engine (Gemini)</span>
              <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-text-secondary text-sm">Database</span>
              <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-text-secondary text-sm">Payments (Stripe)</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }`}>
                {process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true" ? "Connected" : "Not Configured"}
              </span>
            </div>
          </div>
        </div>

        {/* ---- Danger Zone ---- */}
        <div className="glass-card p-6 border-red-500/20">
          <h2 className="text-lg font-bold mb-4 text-red-400">Danger Zone</h2>
          <p className="text-text-secondary text-sm mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
