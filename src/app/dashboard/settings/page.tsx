/* ============================================================
   SETTINGS PAGE
   ============================================================
   User account settings, plan management, billing, and
   account deletion (GDPR compliance).
   Shows current plan, profile info, usage stats, and
   connects to payment provider for plan upgrades.
   Includes a working "Delete Account" flow that requires
   email confirmation before permanently removing all data.
   ============================================================ */

"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

  /* Account deletion state */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  /* ---- Handle Account Deletion ---- */
  /* Permanently deletes the user's account after email confirmation */
  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: deleteConfirmEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account.");
        return;
      }

      /* Account deleted — sign out and redirect to homepage */
      await signOut({ callbackUrl: "/" });
    } catch {
      setDeleteError("Failed to connect to server. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* Calculate usage percentage */
  const usageLimit = userPlan?.plan === "pro" ? 100 : 3;
  const usagePercent = Math.min((userPlan?.aiUsageCount || 0) / usageLimit * 100, 100);

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
                  ? "bg-brand-indigo/20 text-brand-light border-brand-indigo/30"
                  : userPlan?.plan === "enterprise"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-brand-indigo/20 text-brand-light border-brand-indigo/30"
              }`}>
                {userPlan?.plan || "Free"}
              </span>
              <p className="text-text-secondary text-sm mt-3">
                {userPlan?.plan === "pro"
                  ? "100 AI calls per month, all 10 tools unlocked."
                  : "3 AI calls per month, 2 tools included."}
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
                {userPlan?.aiUsageCount || 0} / {usageLimit}
              </span>
            </div>
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

        {/* ---- Data & Privacy Card ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Data & Privacy</h2>
          <p className="text-text-secondary text-sm mb-4">
            Your resume and LinkedIn text are processed ephemerally — they are NOT stored on our servers
            after the AI request completes. Only your account info (name, email) and usage counts are persisted.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/privacy"
              className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* ---- Danger Zone — Account Deletion ---- */}
        <div className="glass-card p-6 border-red-500/20">
          <h2 className="text-lg font-bold mb-4 text-red-400">Danger Zone</h2>
          <p className="text-text-secondary text-sm mb-4">
            Permanently delete your account and all associated data. This action is irreversible —
            all resumes, cover letters, applications, and saved jobs will be permanently erased.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            Delete My Account
          </button>
        </div>
      </div>

      {/* ---- Delete Account Confirmation Modal ---- */}
      {/* Requires user to type their email to confirm — prevents accidental deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => { setShowDeleteModal(false); setDeleteError(""); setDeleteConfirmEmail(""); }}
          />
          {/* Modal content */}
          <div className="relative w-full max-w-md bg-space-800 border border-red-500/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-2">Delete Account</h3>
            <p className="text-text-secondary text-sm mb-4">
              This will permanently delete your account and ALL data including resumes,
              cover letters, applications, and saved jobs. This cannot be undone.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              To confirm, type your email address: <strong className="text-white">{session?.user?.email}</strong>
            </p>

            {/* Email confirmation input */}
            <input
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder="Type your email to confirm..."
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-red-500/30 text-white placeholder-text-muted focus:outline-none focus:border-red-500 text-sm mb-4"
            />

            {/* Delete error message */}
            {deleteError && (
              <p className="text-red-400 text-sm mb-4">{deleteError}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteError(""); setDeleteConfirmEmail(""); }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary border border-card-border rounded-xl hover:bg-space-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmEmail.toLowerCase() !== (session?.user?.email?.toLowerCase() || "")}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
