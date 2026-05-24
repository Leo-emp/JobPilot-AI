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
  weeklyDigest: boolean;
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

  /* Weekly digest */
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [digestSaving, setDigestSaving] = useState(false);

  /* Data export */
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  /* 2FA setup */
  const [twoFAStep, setTwoFAStep] = useState<"idle" | "setup" | "verify">("idle");
  const [twoFAQrCode, setTwoFAQrCode] = useState("");
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAMessage, setTwoFAMessage] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFADisableCode, setTwoFADisableCode] = useState("");

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

  /* Sync weeklyDigest from plan data */
  useEffect(() => {
    if (userPlan) setWeeklyDigest(userPlan.weeklyDigest);
  }, [userPlan]);

  /* Check 2FA status on mount */
  useEffect(() => {
    fetch("/api/auth/two-factor/status")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setTwoFAEnabled(d.enabled); })
      .catch(() => {});
  }, []);

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

  /* ---- Export User Data as PDF ---- */
  const handleExportData = async () => {
    setExportLoading(true);
    setExportMessage("");
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) {
        setExportMessage("Failed to export data. Please try again.");
        return;
      }
      const data = await res.json();

      /* Dynamic import — only loads ~400KB when user clicks export */
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = new jsPDF() as any;
      const brand: [number, number, number] = [79, 70, 229];
      const dark: [number, number, number] = [15, 23, 42];
      let y = 20;

      /* --- Header banner --- */
      doc.setFillColor(...brand);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("JobPilot AI", 14, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Data Export — ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, 28);
      y = 45;

      /* --- Section header helper --- */
      const section = (title: string) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setTextColor(...dark);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, 14, y);
        y += 2;
        doc.setDrawColor(...brand);
        doc.setLineWidth(0.5);
        doc.line(14, y, 196, y);
        y += 8;
      };

      /* --- Date formatter --- */
      const fmt = (d: string | null) =>
        d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

      /* --- Profile --- */
      section("Profile");
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const p = data.profile;
      if (p) {
        [`Name: ${p.name || "—"}`, `Email: ${p.email || "—"}`, `Plan: ${(p.plan || "free").toUpperCase()}`,
         `AI Requests Used: ${p.aiUsageCount || 0}`, `Member Since: ${fmt(p.createdAt)}`
        ].forEach((line: string) => { doc.text(line, 14, y); y += 6; });
        y += 4;
      }

      /* --- Applications --- */
      if (data.applications?.length) {
        section(`Applications (${data.applications.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["Job Title", "Company", "Status", "Applied", "Interview"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.applications.map((a: any) => [
            a.jobTitle || "—", a.company || "—", a.status || "—",
            fmt(a.appliedDate), fmt(a.interviewDate),
          ]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      /* --- Saved Jobs --- */
      if (data.savedJobs?.length) {
        section(`Saved Jobs (${data.savedJobs.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["Title", "Company", "Location", "Salary", "Match", "Saved"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.savedJobs.map((j: any) => [
            j.title || "—", j.company || "—", j.location || "—",
            j.salary || "—", j.matchScore ? `${j.matchScore}%` : "—", fmt(j.createdAt),
          ]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      /* --- Cover Letters --- */
      if (data.coverLetters?.length) {
        section(`Cover Letters (${data.coverLetters.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.coverLetters.forEach((cl: any) => {
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...dark);
          doc.text(`${cl.jobTitle || "Untitled"} — ${cl.company || "Unknown"}`, 14, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(8);
          const lines: string[] = doc.splitTextToSize(cl.content || "", 178);
          const show = lines.slice(0, 25);
          doc.text(show, 14, y);
          y += show.length * 3.5 + 8;
        });
      }

      /* --- Contacts --- */
      if (data.contacts?.length) {
        section(`Contacts (${data.contacts.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["Name", "Email", "Company", "Role", "Relationship"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.contacts.map((c: any) => [
            c.name || "—", c.email || "—", c.company || "—",
            c.role || "—", c.relationship || "—",
          ]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      /* --- Companies --- */
      if (data.companies?.length) {
        section(`Companies (${data.companies.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["Name", "Industry", "Location", "Size", "Status"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.companies.map((c: any) => [
            c.name || "—", c.industry || "—", c.location || "—",
            c.size || "—", c.status || "—",
          ]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      /* --- Resumes --- */
      if (data.resumes?.length) {
        section(`Resumes (${data.resumes.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["File Name", "Uploaded"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.resumes.map((r: any) => [r.fileName || "—", fmt(r.createdAt)]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      /* --- AI History --- */
      if (data.aiHistory?.length) {
        section(`AI History (${data.aiHistory.length})`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable(doc, {
          startY: y,
          head: [["Action", "Title", "Date"]],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: data.aiHistory.map((h: any) => [
            h.action || "—", (h.title || "—").slice(0, 60), fmt(h.createdAt),
          ]),
          headStyles: { fillColor: brand, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [245, 245, 255] },
          margin: { left: 14, right: 14 },
        });
      }

      /* --- Page numbers footer --- */
      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`JobPilot AI — Page ${i} of ${pages}`, 14, 290);
      }

      doc.save(`jobpilot-export-${new Date().toISOString().slice(0, 10)}.pdf`);
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

              {/* Weekly Career Intelligence Email */}
              <div className="mt-5 pt-5 border-t border-card-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Weekly Career Intelligence Email</h3>
                    <p className="text-text-muted text-xs">
                      Receive a weekly summary of your skill gaps, application stats, and follow-up reminders every Monday.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setDigestSaving(true);
                      const newVal = !weeklyDigest;
                      try {
                        const res = await fetch("/api/user/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ weeklyDigest: newVal }),
                        });
                        if (res.ok) setWeeklyDigest(newVal);
                      } catch {}
                      setDigestSaving(false);
                    }}
                    disabled={digestSaving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                      weeklyDigest ? "bg-brand-indigo" : "bg-space-600"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        weeklyDigest ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Data Export — GDPR right to data portability */}
              <div className="mt-5 pt-5 border-t border-card-border">
                <h3 className="text-sm font-semibold text-white mb-2">Export Your Data</h3>
                <p className="text-text-muted text-xs mb-3">
                  Download all your data (profile, resumes, applications, contacts, cover letters, AI history) as a PDF file.
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

            {/* Two-Factor Authentication */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Two-Factor Authentication</h2>

              {twoFAEnabled && twoFAStep !== "setup" ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400 text-sm font-medium">2FA is enabled</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    Your account is protected with authenticator app verification.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={twoFADisableCode}
                      onChange={e => setTwoFADisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter code to disable"
                      className="px-4 py-2 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-red-500/50 text-sm w-48"
                    />
                    <button
                      onClick={async () => {
                        setTwoFALoading(true);
                        setTwoFAMessage("");
                        try {
                          const res = await fetch("/api/auth/two-factor/disable", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code: twoFADisableCode }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setTwoFAEnabled(false);
                            setTwoFADisableCode("");
                            setTwoFAMessage("2FA has been disabled.");
                          } else {
                            setTwoFAMessage(data.error || "Failed to disable.");
                          }
                        } catch { setTwoFAMessage("Failed to disable 2FA."); }
                        finally { setTwoFALoading(false); }
                      }}
                      disabled={twoFADisableCode.length !== 6 || twoFALoading}
                      className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {twoFALoading ? "..." : "Disable 2FA"}
                    </button>
                  </div>
                </div>
              ) : twoFAStep === "idle" ? (
                <div>
                  <p className="text-text-secondary text-sm mb-4">
                    Add an extra layer of security by requiring a code from your authenticator app when signing in.
                  </p>
                  <button
                    onClick={async () => {
                      setTwoFALoading(true);
                      setTwoFAMessage("");
                      try {
                        const res = await fetch("/api/auth/two-factor/setup", { method: "POST" });
                        const data = await res.json();
                        if (res.ok) {
                          setTwoFAQrCode(data.qrCode);
                          setTwoFASecret(data.secret);
                          setTwoFAStep("setup");
                        } else {
                          setTwoFAMessage(data.error || "Setup failed.");
                        }
                      } catch { setTwoFAMessage("Failed to start 2FA setup."); }
                      finally { setTwoFALoading(false); }
                    }}
                    disabled={twoFALoading}
                    className="px-4 py-2 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors disabled:opacity-50"
                  >
                    {twoFALoading ? "Setting up..." : "Enable 2FA"}
                  </button>
                </div>
              ) : twoFAStep === "setup" ? (
                <div>
                  <p className="text-text-secondary text-sm mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.):
                  </p>
                  <div className="flex justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={twoFAQrCode} alt="2FA QR Code" className="w-48 h-48 rounded-xl" />
                  </div>
                  <p className="text-xs text-text-muted text-center mb-4">
                    Or enter manually: <code className="text-brand-light bg-space-800 px-2 py-1 rounded text-xs break-all">{twoFASecret}</code>
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={twoFACode}
                      onChange={e => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo/50 text-sm w-48 text-center tracking-widest"
                      autoFocus
                    />
                    <button
                      onClick={async () => {
                        setTwoFALoading(true);
                        setTwoFAMessage("");
                        try {
                          const res = await fetch("/api/auth/two-factor/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code: twoFACode }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setTwoFAEnabled(true);
                            setTwoFAStep("idle");
                            setTwoFACode("");
                            setTwoFAMessage("2FA enabled successfully!");
                          } else {
                            setTwoFAMessage(data.error || "Invalid code.");
                          }
                        } catch { setTwoFAMessage("Verification failed."); }
                        finally { setTwoFALoading(false); }
                      }}
                      disabled={twoFACode.length !== 6 || twoFALoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {twoFALoading ? "..." : "Verify & Enable"}
                    </button>
                    <button
                      onClick={() => { setTwoFAStep("idle"); setTwoFACode(""); setTwoFAMessage(""); }}
                      className="text-sm text-text-muted hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {twoFAMessage && (
                <p className={`text-sm mt-4 ${twoFAMessage.includes("success") || twoFAMessage.includes("enabled") || twoFAMessage.includes("disabled") ? "text-green-400" : "text-red-400"}`}>
                  {twoFAMessage}
                </p>
              )}
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
