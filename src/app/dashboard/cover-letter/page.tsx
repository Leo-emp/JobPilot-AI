/* ============================================================
   COVER LETTER GENERATOR PAGE
   ============================================================
   Generate tailored cover letters for any job application.
   Supports PDF resume upload OR manual paste.
   AI creates a personalized, human-sounding cover letter
   with proper structure: header, salutation, body, closing.
   Generated letters are saved to the database automatically.
   ============================================================ */

"use client";

import { useState, useEffect, useRef } from "react";
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
  /* Resume input mode: upload or paste */
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  /* Form fields */
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  /* PDF upload state */
  const [fileName, setFileName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  /* AI response */
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /* Copy button feedback */
  const [copied, setCopied] = useState(false);
  /* Edit mode for AI result */
  const [editing, setEditing] = useState(false);
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

  /* ---- Handle PDF Upload ---- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Validate file type */
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please upload a PDF file.");
      return;
    }

    /* Validate file size (5MB max) */
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File too large. Maximum 5MB.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");
    setFileName(file.name);

    try {
      /* Send PDF to the parser API */
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Failed to parse PDF.");
        setFileName("");
        return;
      }

      /* Set the extracted text */
      setResumeText(data.text);
    } catch {
      setUploadError("Failed to upload file. Please try again or paste your resume.");
      setFileName("");
    } finally {
      setUploadLoading(false);
    }
  };

  /* ---- Generate Cover Letter ---- */
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    setEditing(false);

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

  /* Check if form is ready to generate */
  const canGenerate = String(resumeText).trim() && String(jobTitle).trim() && String(company).trim() && String(jobDescription).trim() && !loading;

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Cover Letter Generator
      </h1>
      <p className="text-text-secondary mb-8">
        Upload your resume and job details — get a personalized, interview-winning cover letter.
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
          {/* Resume input with toggle */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Your Resume</h2>
              {/* Toggle between upload and paste */}
              <div className="flex bg-space-700 rounded-lg p-0.5">
                <button
                  onClick={() => setInputMode("upload")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    inputMode === "upload"
                      ? "bg-brand-indigo/20 text-white"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  Upload PDF
                </button>
                <button
                  onClick={() => setInputMode("paste")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    inputMode === "paste"
                      ? "bg-brand-indigo/20 text-white"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {inputMode === "upload" ? (
              <div>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Upload area */}
                {!fileName ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLoading}
                    className="w-full py-10 rounded-xl border-2 border-dashed border-card-border hover:border-brand-indigo/40 bg-space-700/50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <>
                        <div className="w-8 h-8 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-text-secondary">Parsing your resume...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-text-secondary">Click to upload your resume PDF</span>
                        <span className="text-xs text-text-muted">PDF files only, max 5MB</span>
                      </>
                    )}
                  </button>
                ) : (
                  /* File uploaded successfully */
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <svg className="w-8 h-8 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-400 truncate">{fileName}</p>
                      <p className="text-xs text-text-muted">Resume parsed successfully</p>
                    </div>
                    <button
                      onClick={() => {
                        setFileName("");
                        setResumeText("");
                        setUploadError("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs text-text-muted hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Upload error */}
                {uploadError && (
                  <p className="mt-3 text-sm text-red-400">{uploadError}</p>
                )}
              </div>
            ) : (
              /* Paste text mode */
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            )}
          </div>

          {/* Job details */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Business Consultant"
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. McKinsey & Company"
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {/* ---- Result Column ---- */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Cover Letter</h2>
            {result && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-sm text-brand-light hover:text-white transition-colors"
                >
                  {editing ? "Done Editing" : "Edit"}
                </button>
                <button
                  onClick={handleCopy}
                  className="text-sm text-brand-light hover:text-white transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
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

          {/* Result — editable or formatted view */}
          {result ? (
            editing ? (
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-brand-indigo/30 text-white focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
                style={{ minHeight: "500px" }}
              />
            ) : (
              <MarkdownResult result={result} showDownload={true} />
            )
          ) : (
            !loading && (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-text-muted text-sm">
                  Upload your resume and fill in the job details to generate a personalized cover letter.
                </p>
              </div>
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
                  View Full Letter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
