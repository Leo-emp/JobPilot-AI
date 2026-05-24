/* ============================================================
   ONBOARDING - Multi-Step Welcome Wizard
   ============================================================
   Full-screen overlay for brand-new users (zero activity).
   Step 1: Welcome + pick your goal
   Step 2: Where did you hear about us + optional resume upload
   Step 3: Personalized guidance based on goal
   Saves goal + referral source to database for analytics.
   Resume upload creates a record for all dashboard features.
   ============================================================ */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface OnboardingProps {
  hasActivity: boolean;
}

/* ---- Goal options shown in step 1 ---- */
const goals = [
  {
    id: "find-job",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Find a job",
    desc: "Search roles and apply with confidence",
  },
  {
    id: "optimize-resume",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Optimize my resume",
    desc: "Get ATS-ready and beat the bots",
  },
  {
    id: "career-change",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Switch careers",
    desc: "Reframe your experience for a new industry",
  },
  {
    id: "interview-prep",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "Prep for interviews",
    desc: "Predict questions and nail your answers",
  },
];

/* ---- Referral source options for step 2 ---- */
const sources = [
  { id: "google", label: "Google / Search" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter / X" },
  { id: "tiktok", label: "TikTok" },
  { id: "reddit", label: "Reddit" },
  { id: "youtube", label: "YouTube" },
  { id: "friend", label: "Friend / Word of Mouth" },
  { id: "university", label: "University / College" },
  { id: "other", label: "Other" },
];

/* ---- Personalized paths based on chosen goal ---- */
const paths: Record<string, { headline: string; steps: { title: string; desc: string; href: string; cta: string }[] }> = {
  "find-job": {
    headline: "Let's find your next role",
    steps: [
      {
        title: "Search & save jobs",
        desc: "Browse thousands of real listings. Save the ones you like — they'll land in your tracker.",
        href: "/dashboard/jobs",
        cta: "Search Jobs",
      },
      {
        title: "Apply with a tailored cover letter",
        desc: "Generate a unique cover letter for each role in 30 seconds. No templates.",
        href: "/dashboard/cover-letter",
        cta: "Generate Letter",
      },
      {
        title: "Track your applications",
        desc: "Keep all your applications in one place. See what's pending, interview dates, and outcomes.",
        href: "/dashboard/tracker",
        cta: "Open Tracker",
      },
    ],
  },
  "optimize-resume": {
    headline: "Let's make your resume unbeatable",
    steps: [
      {
        title: "Get your ATS score",
        desc: "See exactly which keywords are missing, what formatting to fix, and what to add.",
        href: "/dashboard/resume",
        cta: "Get ATS Score",
      },
      {
        title: "Rebuild for a specific job",
        desc: "Paste any job description and get a completely rewritten, ATS-optimized resume.",
        href: "/dashboard/resume",
        cta: "Rebuild Resume",
      },
      {
        title: "Try different templates",
        desc: "Choose from professional resume templates designed to pass ATS scanners.",
        href: "/dashboard/templates",
        cta: "Browse Templates",
      },
    ],
  },
  "career-change": {
    headline: "Let's reframe your experience",
    steps: [
      {
        title: "Use Career Pivot mode",
        desc: "Tell us your target role — AI finds transferable skills and rewrites your experience.",
        href: "/dashboard/resume",
        cta: "Try Career Pivot",
      },
      {
        title: "Optimize your LinkedIn",
        desc: "Rewrite your profile to attract recruiters in your new industry.",
        href: "/dashboard/linkedin",
        cta: "Optimize Profile",
      },
      {
        title: "Search for roles in your target field",
        desc: "Find openings that match your transferable skills — even without direct experience.",
        href: "/dashboard/jobs",
        cta: "Search Jobs",
      },
    ],
  },
  "interview-prep": {
    headline: "Let's get you interview-ready",
    steps: [
      {
        title: "Predict likely questions",
        desc: "Enter a job title and description — AI generates the 10 most likely questions you'll face.",
        href: "/dashboard/interview",
        cta: "Predict Questions",
      },
      {
        title: "Practice your answers",
        desc: "Get AI-coached answers using the STAR method tailored to your experience.",
        href: "/dashboard/interview",
        cta: "Practice Answers",
      },
      {
        title: "Try a mock interview",
        desc: "Full interactive mock with real-time AI scoring and feedback.",
        href: "/dashboard/interview/mock",
        cta: "Start Mock",
      },
    ],
  },
};

export default function Onboarding({ hasActivity }: OnboardingProps) {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  /* Resume upload state */
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Show onboarding only if user has zero activity and hasn't dismissed */
  useEffect(() => {
    if (hasActivity) return;
    const done = localStorage.getItem("onboarding_complete");
    if (!done) setShow(true);
  }, [hasActivity]);

  if (!show || hasActivity) return null;

  const dismiss = () => {
    localStorage.setItem("onboarding_complete", "1");
    setShow(false);
  };

  const selectGoal = (id: string) => {
    setGoal(id);
    setStep(2);
  };

  /* ---- Handle resume file selection ---- */
  const handleFileSelect = (file: File) => {
    setResumeError("");
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setResumeError("Only PDF files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File too large. Maximum 5MB.");
      return;
    }
    setResumeFile(file);
  };

  /* ---- Upload resume: parse PDF → save to DB ---- */
  const uploadResume = async () => {
    if (!resumeFile) return;
    setResumeUploading(true);
    setResumeError("");
    try {
      /* Step 1: Parse PDF to text */
      const formData = new FormData();
      formData.append("file", resumeFile);
      const parseRes = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });
      if (!parseRes.ok) throw new Error("Failed to parse PDF");
      const parsed = await parseRes.json();

      /* Step 2: Save to database */
      const saveRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: parsed.fileName || resumeFile.name,
          content: parsed.text,
        }),
      });
      if (!saveRes.ok) throw new Error("Failed to save resume");
      const savedResume = await saveRes.json();

      /* Step 3: Set as default resume for all feature pages */
      await fetch("/api/user/default-resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: savedResume.id }),
      });

      setResumeUploaded(true);
    } catch {
      setResumeError("Failed to upload resume. You can add it later from the dashboard.");
    } finally {
      setResumeUploading(false);
    }
  };

  /* ---- Complete step 2: save to DB and move to step 3 ---- */
  const completeStep2 = async () => {
    if (!goal || !source) return;

    /* Save goal + referral source to database */
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, referralSource: source }),
      });
    } catch { /* non-critical — continue anyway */ }

    /* Upload resume if selected but not yet uploaded */
    if (resumeFile && !resumeUploaded) {
      await uploadResume();
    }

    setStep(3);
  };

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const selectedPath = goal ? paths[goal] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ---- Backdrop ---- */}
      <div className="absolute inset-0 bg-space-900/90 backdrop-blur-sm" />

      {/* ---- Modal ---- */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-indigo/30 bg-gradient-to-br from-space-800 via-space-900 to-space-800 shadow-2xl shadow-brand-indigo/10">

        {/* ---- Decorative top gradient bar ---- */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-brand-indigo to-purple-500" />

        {/* ---- Skip button ---- */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 text-text-muted hover:text-white text-sm transition-colors z-10"
        >
          Skip for now
        </button>

        <div className="p-8 sm:p-10">

          {/* ============================================================
               STEP 1: Welcome + Goal Selection
               ============================================================ */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-space-600" />
                <div className="w-8 h-1 rounded-full bg-space-600" />
              </div>

              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-2">
                Welcome, <span className="glow-text">{firstName}</span>
              </h2>
              <p className="text-text-secondary text-base sm:text-lg mb-8">
                What&apos;s your main goal right now? We&apos;ll personalize your experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => selectGoal(g.id)}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-card-border bg-space-700/40 hover:border-brand-indigo/40 hover:bg-space-700/70 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-light shrink-0 group-hover:bg-brand-indigo/20 transition-colors">
                      {g.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-brand-light transition-colors">
                        {g.title}
                      </p>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {g.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-8 text-center text-xs text-text-muted">
                20 free AI calls/month included — no credit card needed
              </p>
            </div>
          )}

          {/* ============================================================
               STEP 2: Referral Source + Resume Upload
               ============================================================ */}
          {step === 2 && (
            <div className="animate-in fade-in duration-300">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-space-600" />
              </div>

              <button
                onClick={() => { setStep(1); setGoal(null); }}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-white transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Where did you hear about us */}
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-2">
                How did you find us?
              </h2>
              <p className="text-text-secondary text-sm mb-5">
                This helps us understand where to reach more people like you.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {sources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSource(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      source === s.id
                        ? "bg-brand-indigo/20 border-brand-indigo/50 text-brand-light"
                        : "bg-space-700/40 border-card-border text-text-secondary hover:border-brand-indigo/30 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Resume upload */}
              <div className="border-t border-card-border pt-6">
                <h3 className="text-lg font-bold mb-1">Upload your resume</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Optional — we&apos;ll use it for AI matching, cover letters, and interview prep. You can always change it later.
                </p>

                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-brand-indigo"); }}
                    onDragLeave={(e) => { e.currentTarget.classList.remove("border-brand-indigo"); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-brand-indigo");
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-card-border bg-space-700/20 cursor-pointer hover:border-brand-indigo/40 transition-colors"
                  >
                    <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <p className="text-sm text-text-secondary">
                      <span className="text-brand-light font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-text-muted">PDF only, max 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-space-700/40 border border-card-border">
                    <svg className="w-8 h-8 text-brand-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resumeFile.name}</p>
                      <p className="text-xs text-text-muted">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    {resumeUploaded ? (
                      <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Uploaded
                      </span>
                    ) : (
                      <button
                        onClick={() => { setResumeFile(null); setResumeError(""); }}
                        className="text-text-muted hover:text-red-400 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}

                {resumeError && (
                  <p className="text-xs text-red-400 mt-2">{resumeError}</p>
                )}
              </div>

              {/* Continue button */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={dismiss}
                  className="text-sm text-text-muted hover:text-white transition-colors"
                >
                  I&apos;ll explore on my own
                </button>
                <button
                  onClick={completeStep2}
                  disabled={!source || resumeUploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-indigo text-white text-sm font-medium hover:bg-brand-indigo/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {resumeUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
               STEP 3: Personalized Path
               ============================================================ */}
          {step === 3 && selectedPath && (
            <div className="animate-in fade-in duration-300">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
              </div>

              {resumeUploaded && (
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-green-400">Resume uploaded — all AI features will use it automatically.</p>
                </div>
              )}

              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-2">
                {selectedPath.headline}
              </h2>
              <p className="text-text-secondary mb-8">
                Here&apos;s your personalized roadmap. Start with step 1.
              </p>

              <div className="relative space-y-4">
                <div className="absolute left-[22px] top-10 bottom-10 w-px bg-gradient-to-b from-brand-indigo/40 via-brand-indigo/20 to-transparent" />

                {selectedPath.steps.map((s, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold z-10 ${
                      i === 0
                        ? "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/30"
                        : "bg-space-700 border border-card-border text-text-muted"
                    }`}>
                      {i + 1}
                    </div>

                    <div className={`flex-1 p-4 rounded-xl ${
                      i === 0
                        ? "bg-brand-indigo/10 border border-brand-indigo/20"
                        : "bg-space-700/40 border border-card-border"
                    }`}>
                      <p className={`font-semibold mb-1 ${i === 0 ? "text-white" : "text-text-secondary"}`}>
                        {s.title}
                      </p>
                      <p className="text-sm text-text-secondary mb-3">
                        {s.desc}
                      </p>
                      {i === 0 ? (
                        <Link
                          href={s.href}
                          onClick={dismiss}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-indigo text-white text-sm font-medium hover:bg-brand-indigo/80 transition-colors"
                        >
                          {s.cta}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="text-xs text-text-muted">
                          {s.cta} — after step {i}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-text-muted">
                  You can always come back to this from your dashboard.
                </p>
                <button
                  onClick={dismiss}
                  className="text-sm text-text-secondary hover:text-white transition-colors"
                >
                  I&apos;ll explore on my own
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
