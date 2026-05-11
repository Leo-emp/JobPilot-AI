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

   Users fill in recipient details + their background + target
   role, pick a message type and tone, and AI crafts a ready-
   to-copy message that sounds human and actually gets replies.
   ============================================================ */

"use client";

import { useState } from "react";

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

  /* ---- Result state ---- */
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | string | null>(null);
  const [copied, setCopied] = useState(false);

  /* ---- Message history (session only) ---- */
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ---- Auto-set platform when message type changes ---- */
  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    setGeneratedMessage("");
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
            senderBackground: senderBackground || "",
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
      if (data.remaining !== undefined) setRemaining(data.remaining);

      /* Auto-save to session history */
      setSavedMessages(prev => [{
        id: Date.now().toString(),
        messageType: selectedType,
        recipientName: recipientName || "Unknown",
        recipientCompany: recipientCompany || "",
        targetRole,
        message: data.result,
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
      {remaining !== null && remaining !== "unlimited" && (
        <div className="mb-6 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-sm">
          <span className="text-brand-light font-medium">
            {remaining} AI {Number(remaining) === 1 ? "call" : "calls"} remaining this month
          </span>
          <span className="text-text-muted ml-2">— Upgrade to Pro for unlimited</span>
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
            {/* Sender background */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Your Background <span className="normal-case font-normal">(experience, skills, achievements)</span>
              </label>
              <textarea
                value={senderBackground}
                onChange={e => setSenderBackground(e.target.value)}
                placeholder="e.g., 3 years in data analytics at a fintech startup, Python/SQL expert, led a team of 4, reduced churn by 15%..."
                rows={3}
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
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {generatedMessage && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-xl">{currentType.icon}</span>
              Your {currentType.label}
            </h2>
            <div className="flex items-center gap-2">
              {/* Regenerate button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all disabled:opacity-50"
              >
                ↻ Regenerate
              </button>
              {/* Copy button */}
              <button
                onClick={() => handleCopy(generatedMessage)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-brand-indigo/20 text-brand-light border border-brand-indigo/30 hover:bg-brand-indigo/30"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy Message"}
              </button>
            </div>
          </div>

          {/* Message content — editable */}
          <textarea
            value={generatedMessage}
            onChange={e => setGeneratedMessage(e.target.value)}
            rows={Math.max(4, generatedMessage.split("\n").length + 1)}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm leading-relaxed resize-none"
          />

          {/* Character count (important for LinkedIn connection requests) */}
          <div className="mt-2 flex items-center justify-between">
            <p className={`text-xs ${
              selectedType === "connection_request" && generatedMessage.length > 300
                ? "text-red-400"
                : "text-text-muted"
            }`}>
              {generatedMessage.length} characters
              {selectedType === "connection_request" && (
                <span className="ml-1">(LinkedIn limit: 300)</span>
              )}
            </p>
            <p className="text-xs text-text-muted">Edit the message above before sending</p>
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
