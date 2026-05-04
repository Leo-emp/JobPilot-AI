/* ============================================================
   RESUME INTELLIGENCE PAGE
   ============================================================
   The core feature of JobPilot AI. Provides:
   - Resume upload (PDF, DOCX, TXT) — saved to database
   - AI analysis with ATS scoring
   - Quick optimize for a specific job
   - Full resume rebuild for a target role
   - Career Pivot mode for career changers
   All AI calls go through /api/ai with the appropriate action.
   Shows remaining AI usage for free tier users.
   ============================================================ */

"use client";

import { useState } from "react";

/* ---- Tab names for the feature sub-sections ---- */
const tabs = [
  { id: "analyze", label: "📄 Analyze Resume" },
  { id: "optimize", label: "⚡ Quick Optimize" },
  { id: "rebuild", label: "🛠️ Full Rebuild" },
  { id: "pivot", label: "🚀 Career Pivot" },
];

export default function ResumePage() {
  /* Track which tab is active */
  const [activeTab, setActiveTab] = useState("analyze");
  /* Stored resume text (extracted from uploaded file) */
  const [resumeText, setResumeText] = useState("");
  /* Original file name for database storage */
  const [fileName, setFileName] = useState("");
  /* AI response for display */
  const [result, setResult] = useState("");
  /* Loading state while AI is processing */
  const [loading, setLoading] = useState(false);
  /* Error messages */
  const [error, setError] = useState("");
  /* Track remaining AI calls */
  const [remaining, setRemaining] = useState<number | string | null>(null);

  /* Job-specific fields for optimize/rebuild/pivot */
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  /* ---- Handle File Upload ---- */
  /* Reads the uploaded file and extracts text content */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    /* For .txt files, read directly */
    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      return;
    }

    /* For PDF and DOCX, read as text for now */
    const text = await file.text();
    setResumeText(text);
  };

  /* ---- Save Resume to Database ---- */
  /* Persists the uploaded resume so it appears in dashboard stats */
  const saveResume = async (analysis?: string) => {
    try {
      await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName || "Pasted Resume",
          content: resumeText,
          analysis: analysis || null,
        }),
      });
    } catch {
      /* Save failure shouldn't block the user */
    }
  };

  /* ---- Call AI API ---- */
  /* Sends the resume and action to our /api/ai endpoint */
  const callAI = async (action: string) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const payload: Record<string, string> = { resume: resumeText };

      /* Add job-specific fields for actions that need them */
      if (action !== "analyze_resume") {
        payload.jobTitle = jobTitle;
        payload.company = company;
        payload.jobDescription = jobDescription;
      }

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

      /* Update remaining AI calls counter */
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      /* Save the resume to database after successful analysis */
      if (action === "analyze_resume") {
        await saveResume(data.result);
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
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Resume Intelligence
      </h1>
      <p className="text-text-secondary mb-8">
        Upload your resume and let AI optimize it for any job.
      </p>

      {/* ---- AI Usage Indicator ---- */}
      {/* Shows remaining AI calls for free tier users */}
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

      {/* ---- Resume Upload Section ---- */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Your Resume</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* File upload input */}
          <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-card-border hover:border-brand-indigo/40 cursor-pointer transition-colors">
            <span className="text-2xl">📎</span>
            <span className="text-sm text-text-secondary">
              {fileName || "Upload resume (PDF, DOCX, TXT)"}
            </span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {/* Or paste text directly */}
          <span className="text-text-muted self-center text-sm">or</span>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={4}
            className="flex-1 px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>
        {resumeText && (
          <p className="mt-3 text-sm text-green-400">
            ✓ Resume loaded ({resumeText.length} characters)
          </p>
        )}
      </div>

      {/* ---- Tab Navigation ---- */}
      {/* Horizontal scrollable tabs for the 4 features */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(""); setError(""); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Tab Content ---- */}
      <div className="glass-card p-6 sm:p-8">

        {/* ---- Analyze Resume Tab ---- */}
        {activeTab === "analyze" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Analyze Resume</h2>
            <p className="text-text-secondary text-sm mb-6">
              Get an ATS score, find weaknesses, and get improvement suggestions.
            </p>
            <button
              onClick={() => callAI("analyze_resume")}
              disabled={!resumeText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "🎯 Analyze Resume"}
            </button>
          </div>
        )}

        {/* ---- Quick Optimize Tab ---- */}
        {activeTab === "optimize" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Quick Optimize</h2>
            <p className="text-text-secondary text-sm mb-6">
              Optimize your resume for a specific job description.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI("optimize_resume")}
              disabled={!resumeText || !jobDescription || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Optimizing..." : "⚡ Optimize Resume"}
            </button>
          </div>
        )}

        {/* ---- Full Rebuild Tab ---- */}
        {activeTab === "rebuild" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Full Resume Rebuild</h2>
            <p className="text-text-secondary text-sm mb-6">
              Completely rebuild your resume for a specific role with ATS keywords and power verbs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI("rebuild_resume")}
              disabled={!resumeText || !jobDescription || !jobTitle || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Rebuilding..." : "🛠️ Rebuild Resume"}
            </button>
          </div>
        )}

        {/* ---- Career Pivot Tab ---- */}
        {activeTab === "pivot" && (
          <div>
            <h2 className="text-xl font-bold mb-2">🚀 Career Pivot Mode</h2>
            <p className="text-text-secondary text-sm mb-6">
              Switching careers? AI will reframe your experience with transferable skills for your target industry.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Target Role (e.g., Data Analyst)"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Target Industry (e.g., Tech)"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for your target role..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI("career_pivot")}
              disabled={!resumeText || !jobDescription || !jobTitle || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Pivoting..." : "🚀 Generate Pivot Resume"}
            </button>
          </div>
        )}

        {/* ---- Error Display ---- */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ---- AI Result Display ---- */}
        {result && (
          <div className="mt-8 p-6 rounded-xl bg-space-700 border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold glow-text-subtle">AI Result</h3>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-sm text-brand-light hover:text-white transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        {/* ---- Loading State ---- */}
        {loading && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">AI is working on your resume...</span>
          </div>
        )}
      </div>
    </div>
  );
}
