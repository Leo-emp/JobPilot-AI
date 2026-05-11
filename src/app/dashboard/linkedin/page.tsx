/* ============================================================
   LINKEDIN OPTIMIZER PAGE
   ============================================================
   AI-powered LinkedIn profile optimization with two modes:
   1. Audit — Score and analyze the current profile (0-100)
   2. Rewrite — Generate optimized profile sections

   Input methods (tab toggle):
   - URL mode: Paste LinkedIn profile URL → auto-scrape public data
   - Manual mode: Paste full profile text directly

   The URL scraper extracts what it can from the public page.
   If the profile is private or data is limited, the user is
   prompted to supplement with pasted text.
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";

/* ---- Action tab configuration ---- */
const actionTabs = [
  { id: "audit", label: "Profile Audit", desc: "Score your profile and find weaknesses" },
  { id: "rewrite", label: "Profile Rewrite", desc: "AI rewrites your profile sections" },
];

/* ---- Type for scraped profile data ---- */
interface ScrapedProfile {
  name: string;
  headline: string;
  about: string;
  location: string;
  currentCompany: string;
  education: string;
  photoUrl: string;
  isPartial: boolean;
  message: string;
}

export default function LinkedInPage() {
  /* ---- Input mode: URL or manual paste ---- */
  const [inputMode, setInputMode] = useState<"url" | "manual">("url");

  /* ---- URL input state ---- */
  const [profileUrl, setProfileUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapedProfile, setScrapedProfile] = useState<ScrapedProfile | null>(null);

  /* ---- Profile text (from scraping or manual paste) ---- */
  const [linkedinText, setLinkedinText] = useState("");
  const [supplementText, setSupplementText] = useState(""); /* extra text user adds after scraping */

  /* ---- Action tab state ---- */
  const [activeTab, setActiveTab] = useState("audit");
  const [targetRole, setTargetRole] = useState("");

  /* ---- AI result state ---- */
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | string | null>(null);

  /* ---- Combined profile text (scraped + supplement or manual) ---- */
  const getFullProfileText = () => {
    if (inputMode === "manual") return linkedinText;
    /* URL mode: combine scraped data with any supplementary text */
    const parts = [linkedinText, supplementText].filter(Boolean);
    return parts.join("\n\n");
  };

  /* ---- Scrape LinkedIn URL ---- */
  const handleScrapeUrl = async () => {
    if (!profileUrl.trim()) {
      setError("Please enter your LinkedIn profile URL.");
      return;
    }

    /* Quick client-side URL validation */
    if (!profileUrl.includes("linkedin.com/in/")) {
      setError("Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/your-username)");
      return;
    }

    setScraping(true);
    setError("");
    setScrapedProfile(null);
    setLinkedinText("");

    try {
      const res = await fetch("/api/linkedin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch profile.");
        return;
      }

      /* Store the scraped data */
      setScrapedProfile(data);
      setLinkedinText(data.profileText || "");
    } catch {
      setError("Failed to connect. Please try pasting your profile text manually.");
    } finally {
      setScraping(false);
    }
  };

  /* ---- Call AI API for audit or rewrite ---- */
  const callAI = async (action: string) => {
    const fullText = getFullProfileText();
    if (!fullText.trim()) {
      setError("Please provide your LinkedIn profile data first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          payload: { linkedinText: fullText, targetRole },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "AI request failed.");
        return;
      }

      setResult(data.result);
      if (data.remaining !== undefined) setRemaining(data.remaining);
    } catch {
      setError("Failed to connect to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Check if we have enough profile data to run AI ---- */
  const hasProfileData = getFullProfileText().trim().length > 20;

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
          <span className="text-text-muted ml-2">— Upgrade to Pro for unlimited</span>
        </div>
      )}

      {/* ============================================================
         PROFILE INPUT SECTION
         ============================================================ */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Your LinkedIn Profile</h2>

        {/* ---- Input mode toggle (URL vs Manual) ---- */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setInputMode("url"); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              inputMode === "url"
                ? "bg-brand-indigo/20 border border-brand-indigo/40 text-white"
                : "bg-space-700/50 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/20"
            }`}
          >
            {/* Link icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Paste URL
          </button>
          <button
            onClick={() => { setInputMode("manual"); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              inputMode === "manual"
                ? "bg-brand-indigo/20 border border-brand-indigo/40 text-white"
                : "bg-space-700/50 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/20"
            }`}
          >
            {/* Document icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Paste Text
          </button>
        </div>

        {/* ============================================================
           URL INPUT MODE
           ============================================================ */}
        {inputMode === "url" && (
          <div>
            {/* URL input field + Fetch button */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                {/* LinkedIn icon inside input */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={e => setProfileUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleScrapeUrl(); }}
                  placeholder="https://www.linkedin.com/in/your-username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo transition-colors text-sm"
                />
              </div>
              <button
                onClick={handleScrapeUrl}
                disabled={scraping || !profileUrl.trim()}
                className="px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-2"
              >
                {scraping ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Fetching...
                  </>
                ) : "Fetch Profile"}
              </button>
            </div>

            {/* ---- Scraped Profile Preview ---- */}
            {scrapedProfile && (
              <div className="mt-5">
                {/* Profile card showing extracted data */}
                <div className="p-4 rounded-xl bg-space-700/80 border border-card-border">
                  <div className="flex items-start gap-4">
                    {/* Profile photo (if available) */}
                    {scrapedProfile.photoUrl && (
                      <img
                        src={scrapedProfile.photoUrl}
                        alt={scrapedProfile.name}
                        className="w-16 h-16 rounded-full border-2 border-brand-indigo/30 flex-shrink-0 object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      {scrapedProfile.name && (
                        <h3 className="font-bold text-white text-lg">{scrapedProfile.name}</h3>
                      )}
                      {scrapedProfile.headline && (
                        <p className="text-sm text-brand-light mt-0.5">{scrapedProfile.headline}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {scrapedProfile.location && (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {scrapedProfile.location}
                          </span>
                        )}
                        {scrapedProfile.currentCompany && (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {scrapedProfile.currentCompany}
                          </span>
                        )}
                        {scrapedProfile.education && (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                            {scrapedProfile.education}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About section preview */}
                  {scrapedProfile.about && (
                    <div className="mt-3 p-3 rounded-lg bg-space-600/50">
                      <p className="text-xs text-text-muted font-medium mb-1">About</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{scrapedProfile.about}</p>
                    </div>
                  )}
                </div>

                {/* Status message (partial vs full) */}
                <div className={`mt-3 p-3 rounded-xl text-sm ${
                  scrapedProfile.isPartial
                    ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                    : "bg-green-500/10 border border-green-500/20 text-green-400"
                }`}>
                  {scrapedProfile.isPartial ? (
                    <>
                      <span className="font-medium">Partial data extracted.</span>{" "}
                      LinkedIn limits what&apos;s visible publicly. For a more thorough audit, paste your full profile text below — go to your profile, press Ctrl+A, Ctrl+C, and paste.
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Profile loaded successfully!</span>{" "}
                      You can add more details below if needed.
                    </>
                  )}
                </div>

                {/* Supplementary text area (for adding more profile data after scraping) */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    {scrapedProfile.isPartial
                      ? "Paste your full profile text here for a complete analysis:"
                      : "Add extra details (optional):"}
                  </label>
                  <textarea
                    value={supplementText}
                    onChange={e => setSupplementText(e.target.value)}
                    placeholder="Go to your LinkedIn profile → Ctrl+A → Ctrl+C → paste here for the most thorough analysis..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
           MANUAL TEXT INPUT MODE
           ============================================================ */}
        {inputMode === "manual" && (
          <div>
            {/* Instruction */}
            <p className="text-sm text-text-muted mb-3">
              Go to your LinkedIn profile → select all (Ctrl+A) → copy (Ctrl+C) → paste below. Include headline, about, experience, education, and skills.
            </p>

            {/* Profile text input */}
            <textarea
              value={linkedinText}
              onChange={e => setLinkedinText(e.target.value)}
              placeholder="Paste your entire LinkedIn profile text here — include headline, about, experience, education, skills..."
              rows={10}
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
        )}
      </div>

      {/* ============================================================
         ACTION TABS (Audit / Rewrite)
         ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {actionTabs.map(tab => (
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

      {/* ============================================================
         TAB CONTENT (Audit / Rewrite action panels)
         ============================================================ */}
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
              disabled={!hasProfileData || loading}
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

            {/* Optional target role */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Target Role (optional — helps focus the optimization)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g., Product Manager, Data Analyst, Software Engineer"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>

            <button
              onClick={() => callAI("linkedin_rewrite")}
              disabled={!hasProfileData || loading}
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
            The first 3 lines show before &quot;See more.&quot; Hook the reader immediately with your value proposition.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Skills Drive Search</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            LinkedIn&apos;s algorithm uses your skills list to match you with opportunities. Add at least 20 relevant skills.
          </p>
        </div>
      </div>
    </div>
  );
}
