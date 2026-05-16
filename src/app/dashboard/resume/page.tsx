/* ============================================================
   RESUME INTELLIGENCE PAGE
   ============================================================
   The core feature of JobPilot AI. Provides:
   - Resume upload (PDF, TXT) with client-side PDF text extraction
   - AI analysis with ATS scoring
   - Quick optimize for a specific job
   - Full resume rebuild for a target role
   - Career Pivot mode for career changers
   - Download results as PDF or Word
   All AI calls go through /api/ai with the appropriate action.
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";
import UpgradePrompt from "@/components/UpgradePrompt";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { useAIStream } from "@/hooks/useAIStream";

/* ---- Tab names for the feature sub-sections ---- */
const tabs = [
  { id: "analyze", label: "Analyze Resume" },
  { id: "optimize", label: "Quick Optimize" },
  { id: "rebuild", label: "Full Rebuild" },
  { id: "pivot", label: "Career Pivot" },
];

export default function ResumePage() {
  /* Track which tab is active */
  const [activeTab, setActiveTab] = useState("analyze");
  /* Stored resume text (extracted from uploaded file) */
  const [resumeText, setResumeText] = useState("");
  /* Original file name for database storage */
  const [fileName, setFileName] = useState("");
  /* AI streaming hook — result appears token-by-token */
  const { result, loading, streaming, error, plan, remaining, callAI: streamAI, reset: resetAI } = useAIStream();
  /* Track file upload/parsing progress */
  const [uploading, setUploading] = useState(false);
  /* File upload error (separate from AI error) */
  const [uploadError, setUploadError] = useState("");

  /* Job-specific fields for optimize/rebuild/pivot */
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  /* ---- Handle File Upload ---- */
  /* Parses PDFs client-side using pdf.js loaded from CDN */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError("");

    /* For .txt files, read directly in browser */
    if (file.name.toLowerCase().endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      return;
    }

    /* For PDF files, extract text client-side using pdf.js */
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setUploading(true);
      try {
        const text = await extractTextFromPdf(file);
        if (text.trim().length < 50) {
          setUploadError("Could not extract enough text from this PDF. Try pasting your resume text instead.");
          setResumeText("");
        } else {
          setResumeText(text);
        }
      } catch {
        setUploadError("Failed to parse PDF. Please paste your resume text instead.");
        setResumeText("");
      } finally {
        setUploading(false);
      }
      return;
    }

    setUploadError("Please upload a PDF or TXT file.");
  };

  /* ---- Save Resume to Database ---- */
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

  /* ---- Call AI API (streaming) ---- */
  const callAI = async (action: string) => {
    const payload: Record<string, string> = { resume: resumeText };

    if (action !== "analyze_resume") {
      payload.jobTitle = jobTitle;
      payload.company = company;
      payload.jobDescription = jobDescription;
    }

    const fullResult = await streamAI(action, payload);

    if (fullResult && action === "analyze_resume") {
      await saveResume(fullResult);
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

      {/* ---- AI Usage / Upgrade Prompt ---- */}
      {remaining !== null && (
        <UpgradePrompt remaining={remaining as number | "unlimited"} plan={plan} />
      )}
      {remaining !== null && remaining !== "unlimited" && Number(remaining) > 5 && (
        <div className="mb-6 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-sm">
          <span className="text-brand-light font-medium">
            {remaining} AI {Number(remaining) === 1 ? "call" : "calls"} remaining this month
          </span>
        </div>
      )}

      {/* ---- Resume Upload Section ---- */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Your Resume</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* File upload input */}
          <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-card-border hover:border-brand-indigo/40 cursor-pointer transition-colors">
            <span className="text-2xl">+</span>
            <span className="text-sm text-text-secondary">
              {uploading
                ? "Extracting text from PDF..."
                : fileName
                  ? fileName
                  : "Upload resume (PDF or TXT)"}
            </span>
            <input
              type="file"
              accept=".pdf,.txt"
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
            Resume loaded ({resumeText.length.toLocaleString()} characters)
          </p>
        )}
      </div>

      {/* ---- Tab Navigation ---- */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetAI(); setUploadError(""); }}
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
              {loading ? "Analyzing..." : "Analyze Resume"}
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
              {loading ? "Optimizing..." : "Optimize Resume"}
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
              {loading ? "Rebuilding..." : "Rebuild Resume"}
            </button>
          </div>
        )}

        {/* ---- Career Pivot Tab ---- */}
        {activeTab === "pivot" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Career Pivot Mode</h2>
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
              {loading ? "Pivoting..." : "Generate Pivot Resume"}
            </button>
          </div>
        )}

        {/* ---- Error Display ---- */}
        {(error || uploadError) && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error || uploadError}
          </div>
        )}

        {/* ---- Loading State (before stream starts) ---- */}
        {loading && !streaming && !result && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Connecting to AI...</span>
          </div>
        )}

        {/* ---- AI Result Display (shows while streaming + after complete) ---- */}
        {result && (
          <div className="relative">
            <MarkdownResult result={result} showDownload={!streaming} />
            {streaming && (
              <div className="mt-3 flex items-center gap-2 text-brand-light text-sm">
                <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                <span>Generating...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
