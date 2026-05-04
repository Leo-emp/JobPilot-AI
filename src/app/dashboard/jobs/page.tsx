/* ============================================================
   JOB SEARCH & MATCH PAGE
   ============================================================
   Users paste a job description and their resume to get:
   - AI match score (0-100)
   - Matching skills analysis
   - Gap identification
   - Improvement recommendations
   Future: integrate Adzuna API for actual job search
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";

export default function JobsPage() {
  /* Form fields */
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  /* AI result */
  const [result, setResult] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---- Calculate Match Score ---- */
  const handleMatch = async () => {
    setLoading(true);
    setError("");
    setResult("");
    setMatchScore(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "match_score",
          payload: { resume: resumeText, jobDescription },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Match calculation failed.");
        return;
      }

      /* Extract the numeric score from the AI response */
      const scoreMatch = data.result.match(/MATCH_SCORE:\s*(\d+)/);
      if (scoreMatch) {
        setMatchScore(parseInt(scoreMatch[1]));
      }
      setResult(data.result);
    } catch {
      setError("Failed to connect to AI.");
    } finally {
      setLoading(false);
    }
  };

  /* Get color based on match score */
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Job Search & Match
      </h1>
      <p className="text-text-secondary mb-8">
        Check how well your resume matches a job description.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Resume input */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Your Resume</h2>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>

        {/* Job description input */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={handleMatch}
        disabled={!resumeText || !jobDescription || loading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        {loading ? "Calculating..." : "🎯 Calculate Match Score"}
      </button>

      {/* ---- Match Score Display ---- */}
      {matchScore !== null && (
        <div className="glass-card p-8 text-center mb-8">
          <p className="text-text-secondary text-sm uppercase tracking-wider mb-2">
            Match Score
          </p>
          <div className={`text-6xl font-bold ${getScoreColor(matchScore)}`}>
            {matchScore}%
          </div>
          <p className="text-text-muted text-sm mt-2">
            {matchScore >= 75
              ? "Great match! You're a strong candidate."
              : matchScore >= 50
              ? "Decent match. Consider optimizing your resume."
              : "Low match. Use Resume Rebuild to improve."}
          </p>
        </div>
      )}

      {/* AI Analysis */}
      {result && <MarkdownResult result={result} showDownload={false} />}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-text-secondary">
          <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Analyzing match compatibility...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
