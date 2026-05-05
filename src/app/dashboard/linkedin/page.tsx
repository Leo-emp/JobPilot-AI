/* ============================================================
   LINKEDIN OPTIMIZER PAGE
   ============================================================
   AI-powered LinkedIn profile optimization with two modes:
   1. Audit — Score and analyze the current profile (0-100)
   2. Rewrite — Generate optimized profile sections
   Users paste their LinkedIn profile text and get actionable
   improvements with specific rewrites and keyword suggestions.
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";

/* ---- Tab configuration ---- */
const tabs = [
  { id: "audit", label: "Profile Audit", desc: "Score your profile and find weaknesses" },
  { id: "rewrite", label: "Profile Rewrite", desc: "AI rewrites your profile sections" },
];

/* ---- Step-by-step guide for copying LinkedIn text ---- */
const COPY_STEPS = [
  "Go to your LinkedIn profile page",
  "Click the \"More\" button below your headline",
  "Select \"Save to PDF\" to download your profile",
  "Or simply select all text on your profile page and copy it",
  "Paste it in the text box below",
];

export default function LinkedInPage() {
  /* ---- State ---- */
  const [activeTab, setActiveTab] = useState("audit");
  const [linkedinText, setLinkedinText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  /* ---- Call AI API ---- */
  const callAI = async (action: string) => {
    if (!linkedinText.trim()) {
      setError("Please paste your LinkedIn profile text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const payload: Record<string, string> = {
        linkedinText,
        targetRole,
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI request failed.");
        return;
      }

      setResult(data.result);
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }
    } catch {
      setError("Failed to connect to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
          LinkedIn Optimizer
        </h1>
        <p className="text-text-secondary">
          Get an AI-powered audit of your LinkedIn profile and optimized rewrites that attract recruiters.
        </p>
      </div>

      {/* ---- AI Usage Indicator ---- */}
      {remaining !== null && remaining !== "unlimited" && (
        <div className="mb-6 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-sm">
          <span className="text-brand-light font-medium">
            {remaining} AI {Number(remaining) === 1 ? "call" : "calls"} remaining this month
          </span>
          <span className="text-text-muted ml-2">
            — Upgrade to Pro for unlimited
          </span>
        </div>
      )}

      {/* ---- LinkedIn Profile Input ---- */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your LinkedIn Profile</h2>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-brand-light hover:text-white transition-colors"
          >
            {showGuide ? "Hide guide" : "How to copy your profile?"}
          </button>
        </div>

        {/* Expandable guide */}
        {showGuide && (
          <div className="mb-5 p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/10">
            <ol className="space-y-2">
              {COPY_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-indigo/20 text-brand-light flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Profile text input */}
        <textarea
          value={linkedinText}
          onChange={(e) => setLinkedinText(e.target.value)}
          placeholder="Paste your entire LinkedIn profile text here — include headline, about, experience, education, skills..."
          rows={8}
          className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
        />

        {/* Character count */}
        {linkedinText && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-green-400">
              Profile loaded ({linkedinText.length.toLocaleString()} characters)
            </p>
            <button
              onClick={() => { setLinkedinText(""); setResult(""); }}
              className="text-sm text-text-muted hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ---- Tab Navigation ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(""); setError(""); }}
            className={`p-4 rounded-xl text-left transition-all ${
              activeTab === tab.id
                ? "bg-brand-indigo/15 border border-brand-indigo/30 shadow-lg shadow-brand-indigo/5"
                : "bg-space-700/50 border border-card-border hover:border-brand-indigo/20"
            }`}
          >
            <span className={`text-sm font-semibold ${activeTab === tab.id ? "text-white" : "text-text-secondary"}`}>
              {tab.label}
            </span>
            <p className="text-xs text-text-muted mt-1">{tab.desc}</p>
          </button>
        ))}
      </div>

      {/* ---- Tab Content ---- */}
      <div className="glass-card p-6 sm:p-8">

        {/* ---- Audit Tab ---- */}
        {activeTab === "audit" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Profile Audit</h2>
            <p className="text-text-secondary text-sm mb-6">
              Get a comprehensive score (0-100) across all profile sections with specific improvement suggestions.
            </p>
            <button
              onClick={() => callAI("linkedin_audit")}
              disabled={!linkedinText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing profile..." : "Audit My Profile"}
            </button>
          </div>
        )}

        {/* ---- Rewrite Tab ---- */}
        {activeTab === "rewrite" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Profile Rewrite</h2>
            <p className="text-text-secondary text-sm mb-6">
              AI rewrites your headline, about, and experience sections optimized for recruiter search.
            </p>

            {/* Optional target role for focused optimization */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Target Role (optional — helps focus the optimization)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Product Manager, Data Analyst, Software Engineer"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>

            <button
              onClick={() => callAI("linkedin_rewrite")}
              disabled={!linkedinText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Rewriting profile..." : "Rewrite My Profile"}
            </button>
          </div>
        )}

        {/* ---- Error Display ---- */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ---- AI Result ---- */}
        {result && <MarkdownResult result={result} showDownload={false} />}

        {/* ---- Loading State ---- */}
        {loading && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">AI is analyzing your LinkedIn profile...</span>
          </div>
        )}
      </div>

      {/* ---- Tips Section ---- */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Headline Matters</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your headline is the most searched field on LinkedIn. Use keywords recruiters search for, not just your job title.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">About = Your Pitch</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            The first 3 lines show before "See more." Hook the reader immediately with your value proposition.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Skills Drive Search</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            LinkedIn's algorithm uses your skills list to match you with opportunities. Add at least 20 relevant skills.
          </p>
        </div>
      </div>
    </div>
  );
}
