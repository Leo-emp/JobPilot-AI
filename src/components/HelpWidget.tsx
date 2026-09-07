/* ============================================================
   HELP WIDGET — Dashboard Floating Help Button
   ============================================================
   Hybrid FAQ system: prefetched answers (zero API cost) with
   optional AI fallback (costs 1 AI credit per question).
   Appears on all dashboard pages as a floating ? button.
   ============================================================ */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

/* ============================================================
   PREFETCHED FAQ DATA — Common dashboard questions
   ============================================================
   These answers load instantly with zero API cost. Covers
   the most common questions users ask while using the dashboard.
   ============================================================ */
interface HelpItem {
  q: string;
  a: string;
  category: string;
}

const helpData: HelpItem[] = [
  /* ---- Resume Tools ---- */
  { category: "Resume", q: "How do I analyze my resume?", a: "Go to Resume Intelligence, paste your resume text or upload a PDF, then click \"Analyze Resume\". You'll receive a detailed score with improvement suggestions." },
  { category: "Resume", q: "What's the difference between Optimize and Rebuild?", a: "Optimize improves your existing resume by enhancing bullet points, keywords, and formatting. Rebuild creates an entirely new resume from scratch using your experience as source material." },
  { category: "Resume", q: "What is Deep Tailor?", a: "Deep Tailor performs the most thorough optimization — it analyzes every requirement in the job description and deeply aligns your resume to match, going beyond surface-level keyword insertion." },
  { category: "Resume", q: "What is Career Pivot mode?", a: "Career Pivot reframes your experience for a new industry or role. It highlights transferable skills and repositions your narrative to bridge the gap between your current and target career." },
  { category: "Resume", q: "How do country-specific resumes work?", a: "Switch between US, UK, and AU tabs to generate resumes following each country's conventions. US resumes are 1 page with centered headers, UK CVs are 2 pages, and AU resumes are 2-3 pages with country-specific sections." },
  { category: "Resume", q: "Can I download my resume as PDF or Word?", a: "Yes. After generating a resume, use the download buttons above the result. You can download as PDF or Word (.docx). Country-specific resumes include the country in the filename." },
  { category: "Resume", q: "Can I edit the AI-generated resume?", a: "Yes. Click the \"Edit\" button above the result to enter edit mode. Make your changes directly in the text, then download the edited version." },
  { category: "Resume", q: "Will the AI add fake experience?", a: "No. The AI only works with the information you provide. It will never fabricate experience, qualifications, or skills — it optimizes how your real experience is presented." },

  /* ---- Cover Letters ---- */
  { category: "Cover Letter", q: "How do I generate a cover letter?", a: "Go to Cover Letter, paste your resume and the job description, optionally add the hiring manager's name and company, then click Generate. The AI creates a tailored cover letter." },
  { category: "Cover Letter", q: "Can I customize the tone?", a: "Yes. You can specify your preferred tone (professional, conversational, confident) and add notes about what to emphasize. The AI adapts its writing style to match." },

  /* ---- Interview Prep ---- */
  { category: "Interview", q: "How does interview prep work?", a: "Provide the job description and your resume, and the AI generates tailored interview questions with suggested answers — including behavioral (STAR format), technical, and situational questions." },
  { category: "Interview", q: "What is mock interview?", a: "Mock interview simulates a real interview. The AI asks questions one at a time, you type your answer, and it provides feedback on relevance, structure, and impact." },

  /* ---- LinkedIn ---- */
  { category: "LinkedIn", q: "How does the LinkedIn optimizer work?", a: "Upload screenshots of your LinkedIn profile, and the AI audits it across key areas: headline, summary, experience, skills, and overall impact — with specific improvement suggestions." },

  /* ---- Job Search & Tracker ---- */
  { category: "Jobs", q: "How do I search for jobs?", a: "Go to Job Search, enter keywords, location, and filters. Results come from multiple job boards. Click the bookmark icon to save a job to your tracker." },
  { category: "Jobs", q: "How does the application tracker work?", a: "The tracker is a Kanban board with stages: Saved, Applied, Interview, Offer, Rejected. Drag applications between stages. Add notes, deadlines, and contacts to each application." },
  { category: "Jobs", q: "How do I save jobs from external sites?", a: "Install the JobPilot AI Chrome Extension from the Chrome Web Store. It adds a save button to 40+ job sites including LinkedIn, Indeed, and Glassdoor." },

  /* ---- Networking ---- */
  { category: "Networking", q: "How do I add contacts?", a: "Go to Networking CRM and click \"Add Contact\". Enter their details and categorize the relationship. You can also add contacts directly from job applications." },

  /* ---- Portfolio ---- */
  { category: "Portfolio", q: "How do I create a portfolio?", a: "Go to Portfolio, choose a template, and add your projects, skills, and experience. Your portfolio gets a shareable public URL you can put on your resume or LinkedIn." },

  /* ---- Account & Billing ---- */
  { category: "Account", q: "How do I change my password?", a: "Go to Settings → Security tab and click \"Change Password\". Enter your current password and your new password. If you signed up with Google, you don't have a password to change." },
  { category: "Account", q: "How do I enable two-factor authentication?", a: "Go to Settings → Security tab and enable 2FA. Scan the QR code with an authenticator app (Google Authenticator, Authy) and enter the verification code." },
  { category: "Account", q: "How do I check my remaining AI calls?", a: "Go to Settings → Usage tab. It shows your current usage, monthly limit, and reset date. The dashboard header also shows your remaining calls." },
  { category: "Account", q: "How do I upgrade to Pro?", a: "Go to Settings → Billing tab and click \"Upgrade to Pro\". Choose monthly or annual billing. Payment is processed through Stripe. Your AI limit increases immediately." },
  { category: "Account", q: "How do I cancel my subscription?", a: "Go to Settings → Billing tab and click \"Manage Subscription\" to open the Stripe billing portal. You can cancel there. You keep Pro access until the end of your billing period." },
  { category: "Account", q: "How do I export my data?", a: "Go to Settings → Account tab → Data & Privacy section and click \"Download My Data\". This exports your profile, resumes, applications, contacts, cover letters, and AI history as JSON." },
  { category: "Account", q: "How do I delete my account?", a: "Go to Settings → Account tab → Danger Zone and click \"Delete My Account\". Data is permanently deleted after a 30-day recovery window." },

  /* ---- AI & Usage ---- */
  { category: "AI Usage", q: "What counts as an AI call?", a: "Each AI action counts as 1 call: analyzing, optimizing, or rebuilding a resume, generating cover letters, preparing interviews, optimizing LinkedIn, or generating messages. Non-AI actions (browsing, saving, tracking) are free." },
  { category: "AI Usage", q: "I'm seeing a rate limit error.", a: "We limit requests to 6 per minute and 40 per hour to prevent abuse. Wait a moment and try again. These burst limits apply to all plans." },
  { category: "AI Usage", q: "My AI response is slow.", a: "AI processing takes 3-15 seconds depending on complexity. If consistently slow, refresh the page. There's a 60-second timeout with automatic retries." },
  { category: "AI Usage", q: "The AI result isn't what I expected.", a: "AI outputs vary between generations. Try regenerating for a different angle. You can also add more specific instructions in the job description or notes to guide the AI." },

  /* ---- Troubleshooting ---- */
  { category: "Troubleshooting", q: "Resume upload isn't working.", a: "We accept PDF files up to 5MB. Make sure the PDF isn't password-protected or image-only (we need text). Try copy-pasting your resume text directly as an alternative." },
  { category: "Troubleshooting", q: "I forgot my password.", a: "Click \"Forgot Password\" on the login page. Enter your email and check your inbox for a reset link (valid 1 hour). If you use Google sign-in, no password is needed." },
  { category: "Troubleshooting", q: "The page isn't loading.", a: "Try clearing your browser cache and cookies, then reload. Disable any VPN or ad blocker temporarily. If the issue persists, email support@jobpilotai.co." },
];

/* ---- Unique categories for filter chips ---- */
const categories = [...new Set(helpData.map((h) => h.category))];

/* ============================================================
   HELP WIDGET COMPONENT
   ============================================================ */
export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  /* # AI fallback state */
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---- Filter results based on search + category ---- */
  const filtered = useMemo(() => {
    let items = helpData;

    /* # Filter by category first */
    if (activeCategory) {
      items = items.filter((h) => h.category === activeCategory);
    }

    /* # Then filter by search text */
    if (search.trim()) {
      const lower = search.toLowerCase();
      items = items.filter(
        (h) =>
          h.q.toLowerCase().includes(lower) ||
          h.a.toLowerCase().includes(lower) ||
          h.category.toLowerCase().includes(lower)
      );
    }

    return items;
  }, [search, activeCategory]);

  /* ---- Close on Escape key ---- */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  /* ---- Focus search input when panel opens ---- */
  useEffect(() => {
    if (open && inputRef.current) {
      /* # Small delay so the panel animation completes */
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  /* ---- Close panel on outside click ---- */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* ---- AI Fallback: Ask AI a question (costs 1 credit) ---- */
  const handleAskAi = async () => {
    if (!aiQuestion.trim() || aiLoading) return;
    setAiLoading(true);
    setAiAnswer("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "faq_answer",
          payload: { question: aiQuestion.trim() },
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAiAnswer(data.error);
      } else {
        setAiAnswer(data.result || "Sorry, I couldn't find an answer. Please contact support@jobpilotai.co for help.");
      }
    } catch {
      setAiAnswer("Something went wrong. Please try again or contact support@jobpilotai.co.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ---- Reset state when closing ---- */
  const handleClose = () => {
    setOpen(false);
    /* # Reset after close animation */
    setTimeout(() => {
      setSearch("");
      setActiveCategory(null);
      setShowAi(false);
      setAiQuestion("");
      setAiAnswer("");
    }, 200);
  };

  return (
    <>
      {/* ---- Floating Help Button ---- */}
      {/* # Positioned above the feedback widget (bottom-20 vs bottom-6) */}
      <button
        onClick={() => (open ? handleClose() : setOpen(true))}
        className="fixed bottom-20 right-6 z-40 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Help"
        title="Help & FAQ"
      >
        {open ? (
          /* Close icon */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Question mark icon */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        )}
      </button>

      {/* ---- Help Panel ---- */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-36 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl bg-space-800 border border-card-border shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* ---- Panel Header ---- */}
          <div className="px-5 pt-5 pb-3 border-b border-card-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                Help & FAQ
              </h3>
              <button
                onClick={handleClose}
                className="text-text-muted hover:text-white transition-colors p-1"
                aria-label="Close help"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ---- Search Input ---- */}
            {!showAi && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search help topics..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-elevated border border-card-border/50 text-white placeholder:text-text-muted text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* ---- Panel Body ---- */}
          <div className="flex-1 overflow-y-auto">
            {showAi ? (
              /* ---- AI Fallback View ---- */
              <div className="p-5">
                <p className="text-xs text-text-muted mb-3">
                  Ask any question about JobPilot AI. Uses 1 AI credit.
                </p>
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Type your question..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-surface-elevated border border-card-border/50 text-white placeholder:text-text-muted text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskAi();
                    }
                  }}
                />
                <button
                  onClick={handleAskAi}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="mt-2 w-full py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiLoading ? "Thinking..." : "Ask AI (1 credit)"}
                </button>
                {/* AI answer display */}
                {aiAnswer && (
                  <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-card-border/50 text-xs text-text-secondary leading-relaxed">
                    {aiAnswer}
                  </div>
                )}
                {/* Back to FAQ */}
                <button
                  onClick={() => {
                    setShowAi(false);
                    setAiQuestion("");
                    setAiAnswer("");
                  }}
                  className="mt-3 text-xs text-text-muted hover:text-white transition-colors"
                >
                  ← Back to FAQ
                </button>
              </div>
            ) : (
              <>
                {/* ---- Category Filter Chips ---- */}
                {!search && (
                  <div className="px-5 pt-3 pb-2 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                        !activeCategory
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-surface-elevated text-text-muted border border-card-border/30 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setActiveCategory(activeCategory === cat ? null : cat)
                        }
                        className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                          activeCategory === cat
                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-surface-elevated text-text-muted border border-card-border/30 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* ---- FAQ Results ---- */}
                <div className="px-5 pb-4">
                  {filtered.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-text-muted mb-3">
                        No results for &ldquo;{search}&rdquo;
                      </p>
                      <button
                        onClick={() => setShowAi(true)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        Ask AI instead →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 mt-2">
                      {filtered.map((item) => (
                        <HelpAccordion key={item.q} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ---- Panel Footer ---- */}
          <div className="px-5 py-3 border-t border-card-border/50 flex items-center justify-between">
            {!showAi && (
              <button
                onClick={() => setShowAi(true)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Can&apos;t find it? Ask AI →
              </button>
            )}
            <Link
              href="/faq"
              target="_blank"
              className="text-[10px] text-text-muted hover:text-white transition-colors ml-auto"
            >
              Full FAQ →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   HELP ACCORDION — Individual Q&A item
   ============================================================ */
function HelpAccordion({ item }: { item: HelpItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-card-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-2.5 text-left group"
      >
        <span className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors pr-3 leading-relaxed">
          {item.q}
        </span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-2.5 text-[11px] text-text-secondary leading-relaxed">
          {item.a}
        </div>
      )}
    </div>
  );
}
