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

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

/* ---- Tab names for the feature sub-sections ---- */
const tabs = [
  { id: "analyze", label: "Analyze Resume" },
  { id: "optimize", label: "Quick Optimize" },
  { id: "rebuild", label: "Full Rebuild" },
  { id: "pivot", label: "Career Pivot" },
];

/* ============================================================
   PDF TEXT EXTRACTION - Client-side using PDF.js from CDN
   ============================================================
   Loads pdf.js dynamically from CDN (no server-side dependencies).
   Extracts text from all pages, preserving line breaks using
   Y-position tracking for accurate text layout.
   ============================================================ */

/* Cache the loaded library so we only load the script once */
let pdfjsLoadPromise: Promise<unknown> | null = null;

/* Load PDF.js library from CDN — only runs in the browser */
function loadPDFJS(): Promise<unknown> {
  if (pdfjsLoadPromise) return pdfjsLoadPromise;

  pdfjsLoadPromise = new Promise((resolve, reject) => {
    /* Check if already loaded from a previous call */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).pdfjsLib);
      return;
    }

    /* Dynamically inject the pdf.js script from CDN */
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lib = (window as any).pdfjsLib;
      /* Set the worker source — required for pdf.js to parse PDFs */
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      resolve(lib);
    };
    script.onerror = () => {
      pdfjsLoadPromise = null;
      reject(new Error("Failed to load PDF parser"));
    };
    document.head.appendChild(script);
  });

  return pdfjsLoadPromise;
}

/* Extract all text content from a PDF file */
async function extractTextFromPDF(file: File): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib = (await loadPDFJS()) as any;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    /* Track Y-position to detect line breaks in the PDF layout */
    let lastY: number | null = null;
    let lineText = "";
    const lines: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of content.items as any[]) {
      if (!("str" in item) || !item.str) continue;
      /* transform[5] is the Y position on the page */
      const y = item.transform[5];

      if (lastY !== null && Math.abs(y - lastY) > 3) {
        /* Y position changed — this is a new line */
        if (lineText.trim()) lines.push(lineText.trim());
        lineText = item.str;
      } else {
        /* Same line — append text with a space separator */
        lineText += (lineText && !lineText.endsWith(" ") ? " " : "") + item.str;
      }
      lastY = y;
    }
    /* Push the last line */
    if (lineText.trim()) lines.push(lineText.trim());

    pages.push(lines.join("\n"));
  }

  return pages.join("\n\n");
}

/* ============================================================
   MARKDOWN TO HTML - For download functionality
   ============================================================
   Converts the AI markdown result to clean HTML for Word/PDF
   downloads. Produces a professional, ATS-friendly document.
   ============================================================ */
function markdownToHTML(md: string): string {
  let html = md
    /* Headers */
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    /* Bold and italic */
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>")
    /* Horizontal rules */
    .replace(/^---$/gm, "<hr>")
    /* Line breaks — but not after block elements */
    .replace(/\n/g, "<br>");

  /* Convert bullet point sequences into proper <ul> lists */
  html = html.replace(
    /(?:<br>)?(?:[*\-•] .+(?:<br>)?)+/g,
    (match) => {
      const items = match
        .split("<br>")
        .filter((line) => /^[*\-•] /.test(line.trim()))
        .map((line) => `<li>${line.trim().replace(/^[*\-•] /, "")}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
  );

  /* Convert numbered list sequences into proper <ol> lists */
  html = html.replace(
    /(?:<br>)?(?:\d+\. .+(?:<br>)?)+/g,
    (match) => {
      const items = match
        .split("<br>")
        .filter((line) => /^\d+\. /.test(line.trim()))
        .map((line) => `<li>${line.trim().replace(/^\d+\. /, "")}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    }
  );

  return html;
}

/* Shared styles for the downloadable document — clean ATS-friendly layout */
const DOWNLOAD_STYLES = `
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.65; font-size: 15px; }
  h1 { font-size: 26px; margin: 0 0 4px 0; color: #111; }
  h2 { font-size: 18px; border-bottom: 2px solid #2d2d2d; padding-bottom: 4px; margin: 24px 0 12px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px; }
  h3 { font-size: 16px; margin: 16px 0 6px 0; color: #222; }
  p { margin: 0 0 8px 0; }
  ul, ol { padding-left: 22px; margin: 6px 0 12px 0; }
  li { margin-bottom: 5px; }
  strong { color: #111; }
  hr { border: none; border-top: 1px solid #ccc; margin: 16px 0; }
  @media print { body { padding: 20px; } }
`;

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
  /* Track file upload/parsing progress */
  const [uploading, setUploading] = useState(false);

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
    setError("");

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
        const text = await extractTextFromPDF(file);
        if (text.trim().length < 50) {
          setError("Could not extract enough text from this PDF. Try pasting your resume text instead.");
          setResumeText("");
        } else {
          setResumeText(text);
        }
      } catch {
        setError("Failed to parse PDF. Please paste your resume text instead.");
        setResumeText("");
      } finally {
        setUploading(false);
      }
      return;
    }

    setError("Please upload a PDF or TXT file.");
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

  /* ---- Call AI API ---- */
  const callAI = async (action: string) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const payload: Record<string, string> = { resume: resumeText };

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

      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }

      if (action === "analyze_resume") {
        await saveResume(data.result);
      }
    } catch {
      setError("Failed to connect to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Download as PDF ---- */
  /* Opens a clean formatted document in a new window for printing/saving as PDF */
  const downloadPDF = useCallback(() => {
    const html = markdownToHTML(result);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head>
        <title>Resume - JobPilot AI</title>
        <style>${DOWNLOAD_STYLES}</style>
      </head><body>${html}</body></html>
    `);
    printWindow.document.close();
    /* Small delay to ensure content renders before print dialog */
    setTimeout(() => printWindow.print(), 300);
  }, [result]);

  /* ---- Download as Word ---- */
  /* Creates an HTML file disguised as .doc — Word opens it natively */
  const downloadWord = useCallback(() => {
    const html = markdownToHTML(result);
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8">
        <style>${DOWNLOAD_STYLES}</style>
      </head><body>${html}</body></html>
    `;
    const blob = new Blob([wordContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-jobpilot.doc";
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

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
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ---- AI Result Display ---- */}
        {/* Renders markdown as properly formatted HTML with large readable font */}
        {result && (
          <div className="mt-8">
            {/* Result header with action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h3 className="text-xl font-bold glow-text-subtle">AI Result</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors"
                >
                  Copy Text
                </button>
                <button
                  onClick={downloadWord}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors"
                >
                  Download Word
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:text-white hover:bg-brand-indigo/30 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Formatted result content — professional layout with readable font */}
            <div className="p-6 sm:p-8 rounded-xl bg-space-700/80 border border-card-border">
              <ReactMarkdown
                components={{
                  /* Custom styled components for professional resume display */
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-white mb-1">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold text-white mt-7 mb-3 pb-2 border-b border-card-border uppercase tracking-wide">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold text-white mt-4 mb-1">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[15px] text-gray-300 leading-relaxed mb-3">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-4">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[15px] text-gray-300 leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-gray-400 italic">{children}</em>
                  ),
                  hr: () => <hr className="border-card-border my-5" />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>

            {/* Download reminder at the bottom */}
            <p className="mt-4 text-sm text-text-muted text-center">
              Use the buttons above to download your result as a Word document or PDF.
            </p>
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
