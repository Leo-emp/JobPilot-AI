/* ============================================================
   RESIGNATION LETTER GENERATOR PAGE
   ============================================================
   # Generate professional resignation letters with AI.
   # Form collects employee details, company info, notice period,
   # and optional tone/reason. AI creates a polished, printable
   # resignation letter with proper structure and formatting.
   # Results can be copied, edited, or downloaded as PDF.
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useAIStream } from "@/hooks/useAIStream";
import { trackEvent } from "@/lib/track-event";

/* # Tone presets — each generates a different style of letter */
const TONE_OPTIONS = [
  { value: "professional", label: "Professional", desc: "Balanced and composed — standard business formality" },
  { value: "warm", label: "Warm & Grateful", desc: "Heartfelt appreciation — great for long tenures" },
  { value: "brief", label: "Brief & Direct", desc: "Short and to the point — just the essentials" },
];

export default function ResignationLetterPage() {
  /* ---- Form fields ---- */
  const [employeeName, setEmployeeName] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [lastDay, setLastDay] = useState("");
  const [tone, setTone] = useState("professional");
  const [reason, setReason] = useState("");
  const [includeReason, setIncludeReason] = useState(false);
  const [highlights, setHighlights] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  /* ---- AI streaming ---- */
  const { result, loading, streaming, error, plan, remaining, callAI: streamAI } = useAIStream();

  /* ---- Copy / Edit state ---- */
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedResult, setEditedResult] = useState("");

  /* # Combined display: edited version takes priority */
  const displayResult = editedResult || result;

  /* ---- Generate resignation letter ---- */
  const handleGenerate = async () => {
    setEditing(false);
    setEditedResult("");

    trackEvent("resignation_letter.generate", { tone });

    await streamAI("resignation_letter", {
      employeeName: employeeName.trim(),
      currentPosition: currentPosition.trim(),
      companyName: companyName.trim(),
      managerName: managerName.trim() || undefined,
      lastDay: lastDay.trim(),
      tone,
      reason: includeReason ? reason.trim() : undefined,
      highlights: highlights.trim() || undefined,
      customInstructions: customInstructions.trim() || undefined,
    });
  };

  /* ---- Copy to clipboard ---- */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayResult);
    setCopied(true);
    trackEvent("resignation_letter.copy");
    setTimeout(() => setCopied(false), 2000);
  };

  /* # Form is ready when required fields are filled */
  const canGenerate =
    employeeName.trim() &&
    currentPosition.trim() &&
    companyName.trim() &&
    lastDay.trim() &&
    !loading;

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Resignation Letter Generator
      </h1>
      <p className="text-text-secondary mb-8">
        Fill in your details and let AI craft a professional, polished resignation letter you can send today.
      </p>

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

      <div className="space-y-6">
        {/* ---- Your Details ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Your Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Current Position *
              </label>
              <input
                type="text"
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
          </div>
        </div>

        {/* ---- Company Details ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Company Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Manager&apos;s Name
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. David Chen"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <p className="text-xs text-text-muted mt-1">Optional — letter will use &quot;Dear Hiring Manager&quot; if blank</p>
            </div>
          </div>
        </div>

        {/* ---- Notice Period ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Last Working Day *</h2>
          <input
            type="text"
            value={lastDay}
            onChange={(e) => setLastDay(e.target.value)}
            placeholder="e.g. October 11, 2026 or 2 weeks from today"
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
          />
          <p className="text-xs text-text-muted mt-2">
            Tip: Check your contract for the required notice period (usually 2-4 weeks).
          </p>
        </div>

        {/* ---- Tone Selection ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Letter Tone</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTone(opt.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  tone === opt.value
                    ? "border-brand-indigo bg-brand-indigo/10"
                    : "border-card-border bg-space-700/50 hover:border-brand-indigo/40"
                }`}
              >
                <span className={`text-sm font-semibold block mb-1 ${
                  tone === opt.value ? "text-brand-light" : "text-white"
                }`}>
                  {opt.label}
                </span>
                <span className="text-xs text-text-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- Reason for Leaving (optional toggle) ---- */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Reason for Leaving</h2>
            <button
              onClick={() => setIncludeReason(!includeReason)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeReason ? "bg-brand-indigo" : "bg-space-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  includeReason ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Optional — most resignation letters do NOT include reasons. Only toggle this on if you want to mention it.
          </p>
          {includeReason && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. pursuing a new opportunity in product strategy, relocating to another city, returning to school..."
              rows={2}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
          )}
        </div>

        {/* ---- Highlights / Things to Appreciate (optional) ---- */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Things to Highlight</h2>
            <span className="text-xs text-text-muted">Optional</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Mention specific projects, mentors, or experiences you want to appreciate in the letter.
          </p>
          <textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder={'e.g. "The product launch we did in Q2 was career-defining. My manager Lisa was an incredible mentor. The engineering team taught me so much about cross-functional collaboration."'}
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>

        {/* ---- Custom Instructions (optional) ---- */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Custom Instructions</h2>
            <span className="text-xs text-text-muted">Optional</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Any additional rules for the AI — specific phrasing, things to avoid, or style preferences.
          </p>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder={'e.g. "Keep it under 200 words. Don\'t mention my next company. Add a line about finishing the Q4 roadmap before I leave."'}
            rows={2}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>

        {/* ---- Generate Button ---- */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Resignation Letter"}
        </button>

        {/* ---- Result Section ---- */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Resignation Letter</h2>
            {displayResult && (
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

          {/* # Error display */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* # Loading spinner before stream starts */}
          {loading && !streaming && !result && (
            <div className="flex flex-col items-center gap-3 text-text-secondary py-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Crafting your resignation letter...</span>
              </div>
            </div>
          )}

          {/* # Result — editable or formatted view */}
          {displayResult ? (
            editing ? (
              <textarea
                value={displayResult}
                onChange={(e) => setEditedResult(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-brand-indigo/30 text-white focus:outline-none focus:border-brand-indigo resize-none text-sm leading-relaxed"
                style={{ minHeight: "400px" }}
              />
            ) : (
              <div>
                <MarkdownResult result={displayResult} showDownload={!streaming} fileName="resignation-letter-jobpilot" />
                {streaming && (
                  <div className="mt-3 flex items-center gap-2 text-brand-light text-sm">
                    <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                    <span>Generating...</span>
                  </div>
                )}
              </div>
            )
          ) : (
            !loading && (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <p className="text-text-muted text-sm">
                  Fill in your details above and click generate to create your resignation letter.
                </p>
              </div>
            )
          )}
        </div>

        {/* ---- Tips Section ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Tips for Resigning Professionally</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-space-700/50 border border-card-border">
              <h3 className="text-sm font-semibold text-brand-light mb-2">Tell your manager first</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Always have a face-to-face (or video) conversation with your direct manager before sending the written letter. The letter confirms what you already discussed.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-space-700/50 border border-card-border">
              <h3 className="text-sm font-semibold text-brand-light mb-2">Check your notice period</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Review your employment contract for required notice period. Standard is 2 weeks in the US, 1-3 months in the UK/EU, and varies in other countries.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-space-700/50 border border-card-border">
              <h3 className="text-sm font-semibold text-brand-light mb-2">Keep it positive</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Never criticize your employer, colleagues, or working conditions in a resignation letter. You may need references from these people in the future.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-space-700/50 border border-card-border">
              <h3 className="text-sm font-semibold text-brand-light mb-2">Offer to help transition</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Offering to train your replacement or document your processes shows professionalism and leaves a lasting positive impression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
