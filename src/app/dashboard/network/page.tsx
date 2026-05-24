/* ============================================================
   AI OUTREACH HUB
   ============================================================
   Generate personalized networking messages powered by AI:
   - LinkedIn connection requests (under 300 chars)
   - Cold outreach to recruiters and hiring managers
   - Follow-up messages after no reply or a conversation
   - Thank-you notes after interviews or coffee chats
   - Referral requests to your network
   - Informational interview requests
   - Recruiter pitch messages for specific roles

   Users can upload a resume PDF or type their background.
   The AI uses this + recipient details to craft personalized
   messages that sound human and actually get replies.
   ============================================================ */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import UpgradePrompt from "@/components/UpgradePrompt";
import { usePlan } from "@/hooks/usePlan";
import { useDefaultResume } from "@/hooks/useDefaultResume";

/* ---- Max resume PDF size ---- */
import { extractTextFromPdf } from "@/lib/pdf-extract";

const MAX_PDF_SIZE_MB = 10;

/* ---- Message type options ---- */
const MESSAGE_TYPES = [
  {
    id: "connection_request",
    label: "Connection Request",
    desc: "LinkedIn connection note (300 chars max)",
    icon: "🤝",
    platform: "LinkedIn",
  },
  {
    id: "cold_outreach",
    label: "Cold Outreach",
    desc: "First message to someone you don't know",
    icon: "📨",
    platform: "LinkedIn",
  },
  {
    id: "recruiter_pitch",
    label: "Recruiter Pitch",
    desc: "Message a recruiter about a specific role",
    icon: "🎯",
    platform: "LinkedIn",
  },
  {
    id: "follow_up",
    label: "Follow-Up",
    desc: "Nudge after no reply or a past conversation",
    icon: "🔄",
    platform: "Email",
  },
  {
    id: "thank_you",
    label: "Thank You",
    desc: "After an interview or coffee chat",
    icon: "🙏",
    platform: "Email",
  },
  {
    id: "referral_request",
    label: "Referral Request",
    desc: "Ask your network for a referral",
    icon: "🌟",
    platform: "Email",
  },
  {
    id: "informational_interview",
    label: "Info Interview",
    desc: "Request an informational chat",
    icon: "☕",
    platform: "LinkedIn",
  },
];

/* ---- Tone options ---- */
const TONES = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly & Warm" },
  { id: "confident", label: "Confident & Bold" },
  { id: "casual", label: "Casual" },
];

/* ---- Platform options ---- */
const PLATFORMS = [
  { id: "LinkedIn", label: "LinkedIn" },
  { id: "Email", label: "Email" },
  { id: "Twitter", label: "X / Twitter" },
];

/* ---- Saved message type ---- */
interface SavedMessage {
  id: string;
  messageType: string;
  recipientName: string;
  recipientCompany: string;
  targetRole: string;
  message: string;
  createdAt: Date;
}

export default function OutreachHubPage() {
  /* ---- Message type selection ---- */
  const [selectedType, setSelectedType] = useState("connection_request");

  /* ---- Form fields ---- */
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [senderBackground, setSenderBackground] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [platform, setPlatform] = useState("LinkedIn");

  /* ---- Resume PDF upload state ---- */
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeParsing, setResumeParsing] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  /* Auto-load user's most recent saved resume */
  const { defaultResume } = useDefaultResume();
  useEffect(() => {
    if (defaultResume && !resumeText) {
      setResumeText(defaultResume.content);
    }
  }, [defaultResume]);

  /* ---- Result state ---- */
  const [generatedMessage, setGeneratedMessage] = useState(""); /* raw AI response */
  const [messageVersions, setMessageVersions] = useState<{ title: string; text: string }[]>([]); /* parsed 3 versions */
  const [selectedVersion, setSelectedVersion] = useState(0); /* which version is currently selected */
  const [editedText, setEditedText] = useState(""); /* user-editable text of the selected version */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { plan, remaining, updateRemaining } = usePlan();
  const [copied, setCopied] = useState(false);

  /* ---- Message history (session only) ---- */
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ---- Resume PDF upload handler ---- */
  const handleResumeUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setResumeError("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      setResumeError(`File too large. Maximum size is ${MAX_PDF_SIZE_MB}MB.`);
      return;
    }

    setResumeFile(file);
    setResumeParsing(true);
    setResumeError("");
    setResumeText("");

    try {
      const text = await extractTextFromPdf(file);
      if (text.trim().length < 20) {
        setResumeError("Could not extract text from this PDF. Please type your background manually below.");
        setResumeParsing(false);
        return;
      }
      setResumeText(text);
    } catch {
      setResumeError("Failed to read this PDF. Please type your background manually below.");
    } finally {
      setResumeParsing(false);
    }
  }, []);

  /* ---- Resume drag-and-drop state ---- */
  const [resumeDragActive, setResumeDragActive] = useState(false);

  const onResumeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleResumeUpload(file);
  }, [handleResumeUpload]);

  /* ---- Parse the AI response into 3 separate message versions ---- */
  /* The AI returns markdown with ## 1. Short & Direct, ## 2. Confident & Detailed, ## 3. Natural & Human */
  const parseVersions = (raw: string): { title: string; text: string }[] => {
    /* Split on ## followed by a number and title */
    const sections = raw.split(/##\s*\d+\.\s*/);
    const versions: { title: string; text: string }[] = [];

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      /* First line is the title, rest is the message body */
      const lines = trimmed.split("\n");
      const title = lines[0].replace(/\*\*/g, "").trim();
      const text = lines.slice(1).join("\n").trim();

      if (text) {
        versions.push({ title, text });
      }
    }

    /* Fallback: if parsing failed, return the whole response as one version */
    if (versions.length === 0) {
      return [{ title: "Your Message", text: raw.trim() }];
    }

    return versions;
  };

  /* ---- Auto-set platform when message type changes ---- */
  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    setGeneratedMessage("");
    setMessageVersions([]);
    setEditedText("");
    setError("");
    /* Set default platform based on message type */
    const type = MESSAGE_TYPES.find(t => t.id === typeId);
    if (type) setPlatform(type.platform);
  };

  /* ---- Generate outreach message via AI ---- */
  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError("Please enter the role you're targeting.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedMessage("");
    setMessageVersions([]);
    setEditedText("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "craft_outreach",
          payload: {
            messageType: selectedType,
            recipientName: recipientName || "",
            recipientTitle: recipientTitle || "",
            recipientCompany: recipientCompany || "",
            targetRole,
            senderBackground: [resumeText, senderBackground].filter(Boolean).join("\n\nAdditional details:\n") || "",
            context: context || "",
            tone,
            platform,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate message.");
        return;
      }

      setGeneratedMessage(data.result);
      if (data.remaining !== undefined) updateRemaining(data.remaining);

      /* Parse the 3 versions from the AI response */
      const versions = parseVersions(data.result);
      setMessageVersions(versions);
      setSelectedVersion(0);
      setEditedText(versions[0]?.text || data.result);

      /* Auto-save the first version to session history */
      setSavedMessages(prev => [{
        id: Date.now().toString(),
        messageType: selectedType,
        recipientName: recipientName || "Unknown",
        recipientCompany: recipientCompany || "",
        targetRole,
        message: versions[0]?.text || data.result,
        createdAt: new Date(),
      }, ...prev]);
    } catch {
      setError("Failed to connect to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Copy message to clipboard ---- */
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Get the currently selected message type config ---- */
  const currentType = MESSAGE_TYPES.find(t => t.id === selectedType)!;

  /* ---- Common input class ---- */
  const inputClass = "w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm transition-colors";

  return (
    <div>
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
          AI Outreach Hub
        </h1>
        <p className="text-text-secondary">
          Generate personalized messages that actually get replies — for recruiters, hiring managers, and your network.
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
         MESSAGE TYPE SELECTOR — Visual grid cards
         ============================================================ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">What kind of message?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MESSAGE_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedType === type.id
                  ? "bg-brand-indigo/15 border border-brand-indigo/40 shadow-lg shadow-brand-indigo/5"
                  : "bg-space-700/50 border border-card-border hover:border-brand-indigo/20"
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <p className={`text-sm font-semibold ${selectedType === type.id ? "text-white" : "text-text-secondary"}`}>
                {type.label}
              </p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
         MESSAGE FORM — Two columns on desktop
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* ---- LEFT: Recipient & Context ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <span className="text-xl">{currentType.icon}</span>
            {currentType.label}
          </h2>
          <p className="text-xs text-text-muted mb-5">{currentType.desc}</p>

          <div className="space-y-4">
            {/* Target Role (required) */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Target Role / Position *</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g., Senior Product Manager, Data Analyst, Software Engineer"
                className={inputClass}
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Recipient&apos;s Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="e.g., Sarah Johnson"
                className={inputClass}
              />
            </div>

            {/* Recipient Title + Company (side by side) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Their Title</label>
                <input
                  type="text"
                  value={recipientTitle}
                  onChange={e => setRecipientTitle(e.target.value)}
                  placeholder="e.g., Engineering Manager"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Their Company</label>
                <input
                  type="text"
                  value={recipientCompany}
                  onChange={e => setRecipientCompany(e.target.value)}
                  placeholder="e.g., Google, Stripe"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Extra context */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Additional Context <span className="normal-case font-normal">(mutual connections, shared interests, why them)</span>
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g., We both attended MIT, I saw their talk on AI at TechCrunch, they posted about hiring for this team..."
                rows={2}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Your Background & Settings ---- */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-1">Your Details</h2>
          <p className="text-xs text-text-muted mb-5">Help the AI personalize your message</p>

          <div className="space-y-4">
            {/* Resume upload or manual background */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Your Background
              </label>

              {/* Resume PDF upload zone */}
              {!resumeFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setResumeDragActive(true); }}
                  onDragLeave={() => setResumeDragActive(false)}
                  onDrop={onResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all mb-3 ${
                    resumeDragActive
                      ? "border-brand-indigo bg-brand-indigo/10"
                      : "border-card-border hover:border-brand-indigo/40 hover:bg-space-700/30"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {/* Upload icon */}
                    <svg className="w-8 h-8 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm text-text-secondary">
                        <span className="text-brand-light font-medium">Upload your resume PDF</span>
                      </p>
                      <p className="text-xs text-text-muted">AI will extract your experience automatically</p>
                    </div>
                  </div>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Resume file loaded — show status */
                <div className="rounded-xl border border-card-border bg-space-700/50 p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{resumeFile.name}</p>
                        <p className="text-xs text-text-muted">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setResumeFile(null); setResumeText(""); setResumeError(""); }}
                      className="text-text-muted hover:text-red-400 transition-colors p-1"
                      title="Remove resume"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Parsing spinner */}
                  {resumeParsing && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                      <div className="w-3.5 h-3.5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
                      Extracting resume data...
                    </div>
                  )}

                  {/* Success */}
                  {resumeText && !resumeParsing && (
                    <div className="mt-2 text-xs text-green-400">
                      Resume loaded — {resumeText.length.toLocaleString()} characters extracted
                    </div>
                  )}

                  {/* Error */}
                  {resumeError && (
                    <div className="mt-2 text-xs text-red-400">{resumeError}</div>
                  )}
                </div>
              )}

              {/* Manual background — always visible as fallback / supplement */}
              <textarea
                value={senderBackground}
                onChange={e => setSenderBackground(e.target.value)}
                placeholder={resumeText ? "Add anything not on your resume (optional)..." : "Or type your background: 3 years in data analytics, Python/SQL expert, led a team of 4..."}
                rows={2}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Tone selector */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      tone === t.id
                        ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                        : "bg-space-700 text-text-muted border border-card-border hover:text-white hover:border-brand-indigo/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform selector */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      platform === p.id
                        ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                        : "bg-space-700 text-text-muted border border-card-border hover:text-white hover:border-brand-indigo/20"
                    }`}
                  >
                    {p.id === "LinkedIn" && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    )}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !targetRole.trim()}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Crafting your message...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Generate Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
         GENERATED MESSAGE — Result card
         ============================================================ */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ---- 3 Message Versions ---- */}
      {messageVersions.length > 0 && (
        <div className="mb-8">
          {/* Version selector tabs */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Choose a Version</h2>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all disabled:opacity-50"
            >
              ↻ Regenerate All
            </button>
          </div>

          {/* Version cards — click to select */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {messageVersions.map((version, index) => (
              <button
                key={index}
                onClick={() => { setSelectedVersion(index); setEditedText(version.text); setCopied(false); }}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedVersion === index
                    ? "bg-brand-indigo/15 border-2 border-brand-indigo/40 shadow-lg shadow-brand-indigo/5"
                    : "bg-space-700/50 border border-card-border hover:border-brand-indigo/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${
                    selectedVersion === index ? "text-brand-light" : "text-text-muted"
                  }`}>
                    Version {index + 1}
                  </span>
                  {selectedVersion === index && (
                    <svg className="w-4 h-4 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className={`text-sm font-semibold mb-2 ${selectedVersion === index ? "text-white" : "text-text-secondary"}`}>
                  {version.title}
                </p>
                {/* Preview — first 120 chars */}
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                  {version.text.slice(0, 120)}...
                </p>
              </button>
            ))}
          </div>

          {/* Selected version — full editable message */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="text-lg">{currentType.icon}</span>
                {messageVersions[selectedVersion]?.title || "Your Message"}
              </h3>
              <button
                onClick={() => handleCopy(editedText)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-brand-indigo/20 text-brand-light border border-brand-indigo/30 hover:bg-brand-indigo/30"
                }`}
              >
                {copied ? "Copied!" : "Copy Message"}
              </button>
            </div>

            {/* Editable message text */}
            <textarea
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              rows={Math.max(5, editedText.split("\n").length + 1)}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm leading-relaxed resize-none"
            />

            {/* Character count */}
            <div className="mt-2 flex items-center justify-between">
              <p className={`text-xs ${
                selectedType === "connection_request" && editedText.length > 300
                  ? "text-red-400"
                  : "text-text-muted"
              }`}>
                {editedText.length} characters
                {selectedType === "connection_request" && (
                  <span className="ml-1">(LinkedIn limit: 300)</span>
                )}
              </p>
              <p className="text-xs text-text-muted">Edit before sending</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         MESSAGE HISTORY — Session-based saved messages
         ============================================================ */}
      {savedMessages.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-3"
          >
            <svg className={`w-4 h-4 transition-transform ${showHistory ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Message History ({savedMessages.length})
          </button>

          {showHistory && (
            <div className="space-y-3">
              {savedMessages.map(msg => {
                const type = MESSAGE_TYPES.find(t => t.id === msg.messageType);
                return (
                  <div key={msg.id} className="glass-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{type?.icon}</span>
                          <span className="text-xs font-semibold text-white">{type?.label}</span>
                          <span className="text-xs text-text-muted">→</span>
                          <span className="text-xs text-text-secondary truncate">
                            {msg.recipientName}{msg.recipientCompany ? ` at ${msg.recipientCompany}` : ""}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted line-clamp-2">{msg.message}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(msg.message)}
                        className="px-3 py-1 rounded-lg text-xs bg-space-600 border border-card-border text-text-muted hover:text-white transition-colors flex-shrink-0"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
         TIPS SECTION — Best practices for outreach
         ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Personalize Everything</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Messages mentioning something specific about the recipient (their work, posts, company) get 3x more replies than generic templates.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">Keep It Short</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            LinkedIn messages under 100 words get 50% higher response rates. Lead with value, not your life story.
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-bold text-white text-sm mb-2">One Clear Ask</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            End with a single, specific, easy-to-answer question. &quot;Would a 15-min chat work next week?&quot; beats &quot;Let me know your thoughts.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
