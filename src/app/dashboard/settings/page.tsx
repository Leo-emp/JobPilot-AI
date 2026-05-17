/* ============================================================
   SETTINGS PAGE - Account, Billing & Usage
   ============================================================
   Three-tab layout:
   1. Account — Edit name, upload profile picture
   2. Billing — Current plan, upgrade, manage subscription/card
   3. Usage — Real-time AI usage stats with visual bar
   ============================================================ */

"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/* ---- Types ---- */
interface UserPlan {
  plan: string;
  aiUsageCount: number;
  usageResetDate: string;
}

/* ---- Tab configuration ---- */
const tabs = [
  { id: "account", label: "Account", icon: "👤" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "usage", label: "Usage", icon: "📊" },
];

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const searchParams = useSearchParams();

  /* Active tab */
  const [activeTab, setActiveTab] = useState("account");

  /* Plan data */
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);

  /* Profile editing */
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Billing state */
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [message, setMessage] = useState("");

  /* Data export */
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  /* Account deletion */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* Initialize name from session */
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.image) setProfileImage(session.user.image);
  }, [session]);

  /* Check for Stripe redirect messages */
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setMessage("Your plan has been upgraded successfully!");
      setActiveTab("billing");
    } else if (searchParams.get("cancelled") === "true") {
      setMessage("Checkout was cancelled. No changes were made.");
      setActiveTab("billing");
    }
  }, [searchParams]);

  /* Fetch plan data */
  const fetchPlan = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (res.ok) setUserPlan(await res.json());
    } catch {}
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  /* ---- Profile Image Upload ---- */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage("Image must be under 2MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileMessage("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string);
      setProfileMessage("");
    };
    reader.readAsDataURL(file);
  };

  /* ---- Save Profile ---- */
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: profileImage }),
      });

      if (res.ok) {
        setProfileMessage("Profile updated successfully!");
        await updateSession({ name: name.trim() });
      } else {
        const data = await res.json();
        setProfileMessage(data.error || "Failed to save.");
      }
    } catch {
      setProfileMessage("Failed to save profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  /* ---- Upgrade Plan ---- */
  const handleUpgrade = async (plan: string, interval: "month" | "year") => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage(data.error || "Failed to start checkout.");
    } catch {
      setMessage("Failed to connect to payment system.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  /* ---- Billing Portal ---- */
  const handleBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage(data.error || "Failed to open billing portal.");
    } catch {
      setMessage("Failed to connect to billing system.");
    } finally {
      setPortalLoading(false);
    }
  };

  /* ---- Export User Data ---- */
  /* Downloads all user data as a JSON file (GDPR data portability) */
  const handleExportData = async () => {
    setExportLoading(true);
    setExportMessage("");
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) {
        setExportMessage("Failed to export data. Please try again.");
        return;
      }
      /* # Create a download link from the response blob */
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jobpilot-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportMessage("Data exported successfully!");
    } catch {
      setExportMessage("Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  /* ---- Delete Account ---- */
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
      if (!res.ok) { setDeleteError(data.error || "Failed to delete."); return; }
      await signOut({ callbackUrl: "/" });
    } catch {
      setDeleteError("Failed to connect to server.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* Usage calculation */
  const usageLimit = userPlan?.plan === "pro" ? 1000 : 20;
  const usagePercent = Math.min((userPlan?.aiUsageCount || 0) / usageLimit * 100, 100);
  const daysUntilReset = userPlan?.usageResetDate
    ? Math.max(0, Math.ceil((new Date(userPlan.usageResetDate).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Settings
      </h1>
      <p className="text-text-secondary mb-8">
        Manage your account, subscription, and usage.
      </p>

      {/* ---- Tab Navigation ---- */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl bg-space-800 border border-card-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Status Message ---- */}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-light text-sm">
          {message}
          <button onClick={() => setMessage("")} className="ml-3 text-text-muted hover:text-white">✕</button>
        </div>
      )}

      <div className="max-w-2xl">
        {/* ============================================================
           ACCOUNT TAB
           ============================================================ */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-space-600 border-2 border-card-border flex items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-text-muted">
                        {(session?.user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-indigo border-2 border-space-800 flex items-center justify-center text-white text-xs hover:bg-brand-indigo/80 transition-colors"
                  >
                    ✎
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Profile picture</p>
                  <p className="text-xs text-text-muted mt-1">JPG, PNG under 2MB</p>
                  {profileImage && (
                    <button
                      onClick={() => { setProfileImage(null); setProfileMessage(""); }}
                      className="text-xs text-red-400 hover:text-red-300 mt-1"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                    placeholder="Your name"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm text-text-muted mb-2">Email</label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-space-800 border border-card-border text-text-secondary text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
                </div>
              </div>

              {/* Save + Message */}
              {profileMessage && (
                <p className={`text-sm mt-4 ${profileMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
                  {profileMessage}
                </p>
              )}
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving || !name.trim()}
                className="btn-primary mt-6 disabled:opacity-50"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Data & Privacy */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Data & Privacy</h2>
              <p className="text-text-secondary text-sm mb-4">
                Your resume and LinkedIn text are processed ephemerally — they are NOT stored after the AI request completes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/privacy" className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors">
                  Terms of Service
                </Link>
              </div>

              {/* Data Export — GDPR right to data portability */}
              <div className="mt-5 pt-5 border-t border-card-border">
                <h3 className="text-sm font-semibold text-white mb-2">Export Your Data</h3>
                <p className="text-text-muted text-xs mb-3">
                  Download all your data (profile, resumes, applications, contacts, cover letters, AI history) as a JSON file.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={exportLoading}
                  className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors disabled:opacity-50"
                >
                  {exportLoading ? "Exporting..." : "Download My Data"}
                </button>
                {exportMessage && (
                  <p className={`text-xs mt-2 ${exportMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
                    {exportMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border-red-500/20">
              <h2 className="text-lg font-bold mb-4 text-red-400">Danger Zone</h2>
              <p className="text-text-secondary text-sm mb-4">
                Deactivate your account and schedule data for deletion. Data preserved 30 days for recovery.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
           BILLING TAB
           ============================================================ */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-6">Current Plan</h2>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full border ${
                    userPlan?.plan === "pro"
                      ? "bg-brand-indigo/20 text-brand-light border-brand-indigo/30"
                      : "bg-space-600 text-text-secondary border-card-border"
                  }`}>
                    {userPlan?.plan || "Free"}
                  </span>
                  <p className="text-text-secondary text-sm mt-4">
                    {userPlan?.plan === "pro"
                      ? "Pro plan — 1,000 AI calls/month, priority support."
                      : "Free plan — 20 AI calls/month, all tools included."}
                  </p>
                </div>
              </div>

              {/* Upgrade section (for free users) */}
              {userPlan?.plan === "free" && (
                <div className="mt-6 p-5 rounded-xl bg-brand-indigo/5 border border-brand-indigo/20">
                  <h3 className="font-semibold text-white mb-3">Upgrade to Pro</h3>
                  <ul className="text-sm text-text-secondary space-y-1.5 mb-4">
                    <li>✓ 1,000 AI calls per month</li>
                    <li>✓ Priority AI processing</li>
                    <li>✓ Full AI history access</li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <div className="flex rounded-lg bg-space-700 p-0.5 text-xs">
                      <button
                        onClick={() => setBillingInterval("month")}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          billingInterval === "month" ? "bg-brand-indigo text-white" : "text-text-muted hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingInterval("year")}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          billingInterval === "year" ? "bg-brand-indigo text-white" : "text-text-muted hover:text-white"
                        }`}
                      >
                        Annual <span className="text-green-400">-20%</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleUpgrade("pro", billingInterval)}
                      disabled={upgradeLoading}
                      className="btn-primary text-sm disabled:opacity-50"
                    >
                      {upgradeLoading ? "Loading..." : billingInterval === "year" ? "Upgrade — £8/mo" : "Upgrade — £10/mo"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Manage Subscription (for paying users) */}
            {(userPlan?.plan === "pro" || userPlan?.plan === "enterprise") && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-4">Manage Subscription</h2>
                <p className="text-text-secondary text-sm mb-4">
                  View receipts, update your card, or cancel your subscription through the Stripe billing portal.
                </p>
                <button
                  onClick={handleBillingPortal}
                  disabled={portalLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {portalLoading ? "Opening..." : "Open Billing Portal"}
                </button>
                <p className="text-xs text-text-muted mt-3">
                  Opens Stripe's secure portal where you can update payment methods, view invoices, and manage your subscription.
                </p>
              </div>
            )}

            {/* Payment Info */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Payment Information</h2>
              {(userPlan?.plan === "pro" || userPlan?.plan === "enterprise") ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-card-border">
                    <span className="text-sm text-text-secondary">Payment method</span>
                    <button
                      onClick={handleBillingPortal}
                      className="text-sm text-brand-light hover:text-white transition-colors"
                    >
                      Update card →
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-card-border">
                    <span className="text-sm text-text-secondary">Invoice history</span>
                    <button
                      onClick={handleBillingPortal}
                      className="text-sm text-brand-light hover:text-white transition-colors"
                    >
                      View receipts →
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-text-secondary">Cancel subscription</span>
                    <button
                      onClick={handleBillingPortal}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Cancel →
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  No payment method on file. Upgrade to Pro to add a card.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
           USAGE TAB
           ============================================================ */}
        {activeTab === "usage" && (
          <div className="space-y-6">
            {/* Usage Overview */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-6">AI Usage This Month</h2>

              {/* Big number display */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                  {userPlan?.aiUsageCount || 0}
                </span>
                <span className="text-2xl text-text-muted mb-1">/ {usageLimit}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-space-700 overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    usagePercent >= 100 ? "bg-red-500"
                    : usagePercent >= 80 ? "bg-yellow-500"
                    : "bg-brand-indigo"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-space-700/50">
                  <p className="text-2xl font-bold text-white">{userPlan?.aiUsageCount || 0}</p>
                  <p className="text-xs text-text-muted mt-1">Calls Used</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-space-700/50">
                  <p className="text-2xl font-bold text-white">{usageLimit - (userPlan?.aiUsageCount || 0)}</p>
                  <p className="text-xs text-text-muted mt-1">Remaining</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-space-700/50">
                  <p className="text-2xl font-bold text-white">{daysUntilReset}</p>
                  <p className="text-xs text-text-muted mt-1">Days to Reset</p>
                </div>
              </div>

              {userPlan?.usageResetDate && (
                <p className="text-xs text-text-muted mt-4">
                  Usage resets on {new Date(userPlan.usageResetDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>

            {/* Plan Details */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Plan Limits</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-sm text-text-secondary">Monthly AI calls</span>
                  <span className="text-sm text-white font-medium">{usageLimit}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-sm text-text-secondary">Rate limit (per minute)</span>
                  <span className="text-sm text-white font-medium">6 calls</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-card-border">
                  <span className="text-sm text-text-secondary">Rate limit (per hour)</span>
                  <span className="text-sm text-white font-medium">40 calls</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">AI tools available</span>
                  <span className="text-sm text-white font-medium">All 10</span>
                </div>
              </div>

              {userPlan?.plan === "free" && (
                <div className="mt-5 p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/20">
                  <p className="text-sm text-text-secondary mb-3">
                    Need more calls? Upgrade to Pro for 1,000 calls/month.
                  </p>
                  <button
                    onClick={() => setActiveTab("billing")}
                    className="text-sm text-brand-light hover:text-white font-medium transition-colors"
                  >
                    View upgrade options →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---- Delete Account Modal ---- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => { setShowDeleteModal(false); setDeleteError(""); setDeleteConfirmEmail(""); }}
          />
          <div className="relative w-full max-w-md bg-space-800 border border-red-500/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-2">Delete Account</h3>
            <p className="text-text-secondary text-sm mb-4">
              This will deactivate your account. Data preserved for 30 days, then permanently deleted.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Type your email to confirm: <strong className="text-white">{session?.user?.email}</strong>
            </p>
            <input
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder="Type your email to confirm..."
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-red-500/30 text-white placeholder-text-muted focus:outline-none focus:border-red-500 text-sm mb-4"
            />
            {deleteError && <p className="text-red-400 text-sm mb-4">{deleteError}</p>}
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
