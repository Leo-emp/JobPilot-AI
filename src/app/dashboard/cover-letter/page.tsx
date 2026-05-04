/* ============================================================
   COVER LETTER GENERATOR PAGE
   ============================================================
   Generate tailored cover letters for any job application.
   User inputs their resume, job details, and the AI creates
   a personalized cover letter they can copy or download.
   Generated letters are saved to the database automatically.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import MarkdownResult from "@/components/MarkdownResult";

/* ---- Type for saved cover letters ---- */
interface SavedLetter {
  id: string;
  jobTitle: string;
  company: string;
  content: string;
  createdAt: string;
}

export default function CoverLetterPage() {
  /* Form fields */
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  /* AI response */
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /* Copy button feedback */
  const [copied, setCopied] = useState(false);
  /* Saved cover letters history */
  const [savedLetters, setSavedLetters] = useState<SavedLetter[]>([]);
  /* Track remaining AI calls */
  const [remaining, setRemaining] = useState<number | string | null>(null);

  /* ---- Load previously saved cover letters ---- */
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await fetch("/api/cover-letters");
        if (res.ok) {
          const data = await res.json();
          setSavedLetters(data);
        }
      } catch {
        /* Silent fail — list will just be empty */
      }
    };
    loadSaved();
  }, []);

  /* ---- Generate Cover Letter ---- */
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cover_letter",
          payload: {
            resume: resumeText,
            jobTitle,
            company,
            jobDescription,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate cover letter.");
        return;
      }
      setResult(data.result);

      /* Update remaining AI calls counter */
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      /* Save the generated cover letter to the database */
      try {
        const saveRes = await fetch("/api/cover-letters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle,
            company,
            content: data.result,
          }),
        });
        if (saveRes.ok) {
          const saved = await saveRes.json();
          setSavedLetters((prev) => [saved, ...prev]);
        }
      } catch {
        /* Save failure shouldn't block the user */
      }
    } catch {
      setError("Failed to connect to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Copy to Clipboard ---- */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Cover Letter Generator
      </h1>
      <p className="text-text-secondary mb-8">
        Generate a tailored, professional cover letter in seconds.
      </p>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---- Input Column ---- */}
        <div className="space-y-6">
          {/* Resume input */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Your Resume</h2>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
          </div>

          {/* Job details */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Job Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!resumeText || !jobTitle || !company || !jobDescription || loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "✉️ Generate Cover Letter"}
          </button>
        </div>

        {/* ---- Result Column ---- */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Cover Letter</h2>
            {result && (
              <button
                onClick={handleCopy}
                className="text-sm text-brand-light hover:text-white transition-colors"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex items-center gap-3 text-text-secondary py-8">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Crafting your cover letter...</span>
            </div>
          )}

          {/* Result text */}
          {result ? (
            <MarkdownResult result={result} showDownload={false} />
          ) : (
            !loading && (
              <p className="text-text-muted text-sm py-8 text-center">
                Your generated cover letter will appear here.
              </p>
            )
          )}
        </div>
      </div>

      {/* ---- Previously Saved Cover Letters ---- */}
      {savedLetters.length > 0 && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold mb-6">
            Previous Cover Letters
          </h2>
          <div className="space-y-4">
            {savedLetters.map((letter) => (
              <div key={letter.id} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{letter.jobTitle}</h3>
                    <p className="text-sm text-text-secondary">{letter.company}</p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {letter.content}
                </p>
                <button
                  onClick={() => {
                    setResult(letter.content);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-3 text-sm text-brand-light hover:text-white transition-colors"
                >
                  View Full Letter →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
