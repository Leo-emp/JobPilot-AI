/* ============================================================
   LINKEDIN OPTIMIZER PAGE
   ============================================================
   AI-powered LinkedIn profile optimization with two actions:
   1. Profile Audit — Comprehensive score (0-100) across all
      profile sections + post content analysis if screenshots
      are provided. Everything reviewed in one step.
   2. Profile Rewrite — AI rewrites optimized for recruiters

   Profile input (toggle):
   - Import PDF — Upload LinkedIn "Save to PDF" export
   - Paste Text — Copy-paste full profile text

   Post screenshots (optional, always visible):
   - Upload up to 5 screenshots of recent LinkedIn posts
   - Included in the audit automatically when provided
   ============================================================ */

"use client";

import { useState, useRef, useCallback } from "react";
import MarkdownResult from "@/components/MarkdownResult";
import UpgradePrompt from "@/components/UpgradePrompt";
import { usePlan } from "@/hooks/usePlan";

/* ---- Action tab configuration ---- */
const actionTabs = [
  { id: "audit", label: "Profile Audit", desc: "Score your profile + posts and find weaknesses" },
  { id: "rewrite", label: "Profile Rewrite", desc: "AI rewrites your profile sections" },
];

/* ---- Maximum file sizes ---- */
const MAX_PDF_SIZE_MB = 10;
const MAX_IMAGE_SIZE_MB = 5;
import { extractTextFromPdf } from "@/lib/pdf-extract";

const MAX_POST_SCREENSHOTS = 5;

/* ---- Convert an image file to a base64 data URL ---- */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LinkedInPage() {
  /* ---- Profile input mode: PDF or manual text ---- */
  const [profileMode, setProfileMode] = useState<"pdf" | "manual">("pdf");

  /* ---- PDF import state ---- */
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const pdfInputRef = useRef<HTMLInputElement>(null);

  /* ---- Manual text paste state ---- */
  const [linkedinText, setLinkedinText] = useState("");

  /* ---- Post screenshots state (always available, included in audit) ---- */
  const [postScreenshots, setPostScreenshots] = useState<{ file: File; preview: string }[]>([]);
  const [postContext, setPostContext] = useState("");
  const postInputRef = useRef<HTMLInputElement>(null);

  /* ---- Action tab state ---- */
  const [activeTab, setActiveTab] = useState("audit");
  const [targetRole, setTargetRole] = useState("");

  /* ---- AI result state ---- */
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { plan, remaining, updateRemaining } = usePlan();

  /* ---- Get profile text from whichever input mode is active ---- */
  const getFullProfileText = () => {
    if (profileMode === "pdf") return pdfText;
    return linkedinText;
  };

  /* ============================================================
     PDF IMPORT HANDLER
     ============================================================ */
  const handlePdfUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setPdfError("Please upload a PDF file.");
      return;
    }

    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      setPdfError(`File too large. Maximum size is ${MAX_PDF_SIZE_MB}MB.`);
      return;
    }

    setPdfFile(file);
    setPdfParsing(true);
    setPdfError("");
    setPdfText("");

    try {
      const text = await extractTextFromPdf(file);

      if (text.trim().length < 20) {
        setPdfError("Could not extract enough text from this PDF. It may be image-based. Please paste your profile text manually instead.");
        setPdfParsing(false);
        return;
      }

      setPdfText(text);
    } catch {
      setPdfError("Failed to read this PDF. Please try pasting your profile text manually instead.");
    } finally {
      setPdfParsing(false);
    }
  }, []);

  const onPdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePdfUpload(file);
  };

  const [pdfDragActive, setPdfDragActive] = useState(false);

  const onPdfDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setPdfDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePdfUpload(file);
  }, [handlePdfUpload]);

  /* ============================================================
     POST SCREENSHOT HANDLERS
     ============================================================ */
  const handlePostScreenshots = useCallback(async (files: FileList) => {
    const newScreenshots: { file: File; preview: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      if (postScreenshots.length + newScreenshots.length >= MAX_POST_SCREENSHOTS) break;

      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) continue;

      const preview = URL.createObjectURL(file);
      newScreenshots.push({ file, preview });
    }

    setPostScreenshots(prev => [...prev, ...newScreenshots]);
  }, [postScreenshots.length]);

  const removeScreenshot = (index: number) => {
    setPostScreenshots(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onPostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handlePostScreenshots(e.target.files);
    e.target.value = "";
  };

  const [postDragActive, setPostDragActive] = useState(false);

  const onPostDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setPostDragActive(false);
    if (e.dataTransfer.files) handlePostScreenshots(e.dataTransfer.files);
  }, [handlePostScreenshots]);

  /* ============================================================
     AI API CALL — Handles both text-only and multimodal requests
     ============================================================
     For audit: sends profile text + post screenshots (if any)
     For rewrite: sends profile text only (no images needed)
     ============================================================ */
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
      /* Build the payload — include images for audit if screenshots exist */
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const payload: any = { linkedinText: fullText, targetRole };

      /* For audit action: attach post screenshots as base64 images */
      if (action === "linkedin_audit" && postScreenshots.length > 0) {
        const images = await Promise.all(
          postScreenshots.map(async (s) => {
            const base64 = await fileToBase64(s.file);
            return { data: base64, mimeType: s.file.type };
          })
        );
        payload.images = images;
        if (postContext.trim()) payload.postContext = postContext.trim();
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
      if (data.remaining !== undefined) updateRemaining(data.remaining);
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
          Get an AI-powered audit of your LinkedIn profile and posts, plus optimized rewrites that attract recruiters.
        </p>
      </div>

      {/* ---- AI Usage Indicator ---- */}
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

      {/* ============================================================
         SECTION 1: PROFILE DATA INPUT
         ============================================================
         Two modes: Import PDF or Paste Text. Always visible.
         ============================================================ */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Your LinkedIn Profile</h2>

        {/* ---- Profile input mode toggle (PDF vs Text) ---- */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setProfileMode("pdf"); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              profileMode === "pdf"
                ? "bg-brand-indigo/20 border border-brand-indigo/40 text-white"
                : "bg-space-700/50 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/20"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Import PDF
          </button>
          <button
            onClick={() => { setProfileMode("manual"); setError(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              profileMode === "manual"
                ? "bg-brand-indigo/20 border border-brand-indigo/40 text-white"
                : "bg-space-700/50 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/20"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Paste Text
          </button>
        </div>

        {/* ============================================================
           PDF IMPORT MODE
           ============================================================ */}
        {profileMode === "pdf" && (
          <div>
            {/* Step-by-step download instructions */}
            <div className="mb-5 p-4 rounded-xl bg-space-700/60 border border-card-border">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How to download your LinkedIn profile as PDF
              </h3>
              <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                <li>
                  Go to your LinkedIn profile page
                  <span className="text-text-muted"> (click your photo → &quot;View Profile&quot;)</span>
                </li>
                <li>
                  Click the <span className="text-white font-medium">&quot;More&quot;</span> button below your profile header
                  <span className="text-text-muted"> (next to &quot;Open to&quot; and &quot;Add profile section&quot;)</span>
                </li>
                <li>
                  Select <span className="text-white font-medium">&quot;Save to PDF&quot;</span> from the dropdown menu
                </li>
                <li>
                  Upload the downloaded PDF file below
                </li>
              </ol>
            </div>

            {/* PDF Drop Zone */}
            {!pdfFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setPdfDragActive(true); }}
                onDragLeave={() => setPdfDragActive(false)}
                onDrop={onPdfDrop}
                onClick={() => pdfInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  pdfDragActive
                    ? "border-brand-indigo bg-brand-indigo/10"
                    : "border-card-border hover:border-brand-indigo/40 hover:bg-space-700/30"
                }`}
              >
                <svg className="w-10 h-10 mx-auto mb-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-text-secondary mb-1">
                  <span className="text-brand-light font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-muted">PDF files only, up to {MAX_PDF_SIZE_MB}MB</p>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={onPdfFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              /* PDF file loaded — show status */
              <div className="rounded-xl border border-card-border bg-space-700/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[400px]">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {(pdfFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPdfFile(null); setPdfText(""); setPdfError(""); setResult(""); }}
                    className="text-text-muted hover:text-red-400 transition-colors p-1"
                    title="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {pdfParsing && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-4 h-4 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
                    Extracting profile data from PDF...
                  </div>
                )}

                {pdfText && !pdfParsing && (
                  <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
                    <span className="font-medium">Profile extracted successfully!</span>{" "}
                    {pdfText.length.toLocaleString()} characters of profile data ready for analysis.
                  </div>
                )}

                {pdfError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    {pdfError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
           MANUAL TEXT INPUT MODE
           ============================================================ */}
        {profileMode === "manual" && (
          <div>
            <p className="text-sm text-text-muted mb-3">
              Go to your LinkedIn profile → select all (Ctrl+A) → copy (Ctrl+C) → paste below. Include headline, about, experience, education, and skills.
            </p>
            <textarea
              value={linkedinText}
              onChange={e => setLinkedinText(e.target.value)}
              placeholder="Paste your entire LinkedIn profile text here — include headline, about, experience, education, skills..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
            />
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
         SECTION 2: POST SCREENSHOTS (optional, always visible)
         ============================================================
         These are included in the profile audit automatically.
         Users can upload screenshots of their recent LinkedIn posts
         for a combined profile + content strategy review.
         ============================================================ */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Recent Post Screenshots</h2>
            <p className="text-sm text-text-muted mt-1">
              Optional — upload screenshots of your recent LinkedIn posts for a combined profile + content audit
            </p>
          </div>
          {/* Post count badge */}
          {postScreenshots.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-xs font-medium text-brand-light">
              {postScreenshots.length}/{MAX_POST_SCREENSHOTS}
            </span>
          )}
        </div>

        {/* Instructions (collapsible feel — always visible but compact) */}
        <div className="mb-4 p-3 rounded-xl bg-space-700/40 border border-card-border text-xs text-text-muted">
          <span className="text-text-secondary font-medium">How to capture:</span>{" "}
          Go to your LinkedIn profile → Activity → Show all posts → screenshot each post
          <span className="text-text-muted"> (Windows: Win+Shift+S, Mac: Cmd+Shift+4)</span>.
          Include the full post with engagement metrics (likes, comments).
        </div>

        {/* Screenshot Drop Zone */}
        {postScreenshots.length < MAX_POST_SCREENSHOTS && (
          <div
            onDragOver={(e) => { e.preventDefault(); setPostDragActive(true); }}
            onDragLeave={() => setPostDragActive(false)}
            onDrop={onPostDrop}
            onClick={() => postInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              postDragActive
                ? "border-brand-indigo bg-brand-indigo/10"
                : "border-card-border hover:border-brand-indigo/40 hover:bg-space-700/30"
            }`}
          >
            <svg className="w-8 h-8 mx-auto mb-2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-text-secondary mb-1">
              <span className="text-brand-light font-medium">Click to upload</span> or drag and drop screenshots
            </p>
            <p className="text-xs text-text-muted">
              PNG, JPG, or WEBP — up to {MAX_IMAGE_SIZE_MB}MB each — {MAX_POST_SCREENSHOTS - postScreenshots.length} more allowed
            </p>
            <input
              ref={postInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={onPostFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Screenshot Previews Grid */}
        {postScreenshots.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-secondary">
                {postScreenshots.length} screenshot{postScreenshots.length !== 1 ? "s" : ""} uploaded
              </p>
              <button
                onClick={() => {
                  postScreenshots.forEach(s => URL.revokeObjectURL(s.preview));
                  setPostScreenshots([]);
                }}
                className="text-xs text-text-muted hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {postScreenshots.map((screenshot, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-card-border bg-space-700/50">
                  <img
                    src={screenshot.preview}
                    alt={`Post screenshot ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover object-top"
                  />
                  <button
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    title="Remove screenshot"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-brand-indigo/80 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Optional context about the posts */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Additional context about your posts (optional)
              </label>
              <textarea
                value={postContext}
                onChange={e => setPostContext(e.target.value)}
                placeholder="e.g., I'm trying to build an audience in AI/tech, my target audience is recruiters, I post 3x per week..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
              />
            </div>
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
            <p className="text-text-secondary text-sm mb-4">
              Get a comprehensive score (0-100) across all profile sections with specific improvement suggestions.
              {postScreenshots.length > 0
                ? ` Your ${postScreenshots.length} post screenshot${postScreenshots.length !== 1 ? "s" : ""} will also be analyzed for content strategy.`
                : " Add post screenshots above for a combined profile + content review."
              }
            </p>

            {/* Shows what will be included in the audit */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                hasProfileData
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-space-700/50 border border-card-border text-text-muted"
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {hasProfileData
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  }
                </svg>
                Profile Data
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                postScreenshots.length > 0
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-space-700/50 border border-card-border text-text-muted"
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {postScreenshots.length > 0
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  }
                </svg>
                {postScreenshots.length > 0 ? `${postScreenshots.length} Post Screenshot${postScreenshots.length !== 1 ? "s" : ""}` : "Post Screenshots (optional)"}
              </span>
            </div>

            <button
              onClick={() => callAI("linkedin_audit")}
              disabled={!hasProfileData || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && activeTab === "audit" ? "Analyzing profile & posts..." : "Audit My Profile"}
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
              {loading && activeTab === "rewrite" ? "Rewriting profile..." : "Rewrite My Profile"}
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
            <span className="text-sm">
              {postScreenshots.length > 0 && activeTab === "audit"
                ? "AI is analyzing your LinkedIn profile and posts..."
                : "AI is analyzing your LinkedIn profile..."
              }
            </span>
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
          <h3 className="font-bold text-white text-sm mb-2">Post Consistently</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Regular posting boosts your profile visibility. Aim for 2-3 posts per week with value-driven content in your niche.
          </p>
        </div>
      </div>
    </div>
  );
}
