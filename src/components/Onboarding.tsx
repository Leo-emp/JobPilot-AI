/* ============================================================
   ONBOARDING - Multi-Step Welcome Wizard
   ============================================================
   Full-screen overlay for brand-new users (zero activity).
   Step 1: Welcome + pick your goal
   Step 2: Personalized guidance based on goal
   Step 3: Quick-start action with direct link
   Stores progress in localStorage. Dismissable at any time.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
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

/* ---- Personalized paths based on chosen goal ---- */
const paths: Record<string, { headline: string; steps: { title: string; desc: string; href: string; cta: string }[] }> = {
  "find-job": {
    headline: "Let's find your next role",
    steps: [
      {
        title: "Upload your resume",
        desc: "We'll use it to match you with the right jobs and tailor everything to your background.",
        href: "/dashboard/resume",
        cta: "Upload Resume",
      },
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
    ],
  },
  "optimize-resume": {
    headline: "Let's make your resume unbeatable",
    steps: [
      {
        title: "Upload your resume",
        desc: "Drop your PDF or paste text — AI analyzes it in seconds and gives you a score out of 100.",
        href: "/dashboard/resume",
        cta: "Upload Resume",
      },
      {
        title: "Fix what's holding you back",
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
    ],
  },
  "career-change": {
    headline: "Let's reframe your experience",
    steps: [
      {
        title: "Upload your current resume",
        desc: "We'll map your existing skills to your target industry automatically.",
        href: "/dashboard/resume",
        cta: "Upload Resume",
      },
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
        desc: "Paste your resume and get AI-coached answers using the STAR method.",
        href: "/dashboard/interview",
        cta: "Practice Answers",
      },
      {
        title: "Try a mock interview",
        desc: "Full interactive mock with video, voice, and real-time AI scoring.",
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

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const selectedPath = goal ? paths[goal] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ---- Backdrop ---- */}
      <div className="absolute inset-0 bg-space-900/90 backdrop-blur-sm" />

      {/* ---- Modal ---- */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-brand-indigo/30 bg-gradient-to-br from-space-800 via-space-900 to-space-800 shadow-2xl shadow-brand-indigo/10 overflow-hidden">

        {/* ---- Decorative top gradient bar ---- */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-brand-indigo to-purple-500" />

        {/* ---- Skip button ---- */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 text-text-muted hover:text-white text-sm transition-colors"
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
              </div>

              {/* Welcome text */}
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-2">
                Welcome, <span className="glow-text">{firstName}</span>
              </h2>
              <p className="text-text-secondary text-base sm:text-lg mb-8">
                What&apos;s your main goal right now? We&apos;ll personalize your experience.
              </p>

              {/* Goal cards */}
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

              {/* Trust line */}
              <p className="mt-8 text-center text-xs text-text-muted">
                20 free AI calls/month included — no credit card needed
              </p>
            </div>
          )}

          {/* ============================================================
               STEP 2: Personalized Path
               ============================================================ */}
          {step === 2 && selectedPath && (
            <div className="animate-in fade-in duration-300">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
                <div className="w-8 h-1 rounded-full bg-brand-indigo" />
              </div>

              {/* Back button */}
              <button
                onClick={() => { setStep(1); setGoal(null); }}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-white transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change goal
              </button>

              {/* Personalized headline */}
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-2">
                {selectedPath.headline}
              </h2>
              <p className="text-text-secondary mb-8">
                Here&apos;s your personalized roadmap. Start with step 1 — it takes 30 seconds.
              </p>

              {/* Steps with connecting line */}
              <div className="relative space-y-4">
                {/* Vertical connector line */}
                <div className="absolute left-[22px] top-10 bottom-10 w-px bg-gradient-to-b from-brand-indigo/40 via-brand-indigo/20 to-transparent" />

                {selectedPath.steps.map((s, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* Step number circle */}
                    <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold z-10 ${
                      i === 0
                        ? "bg-brand-indigo text-white shadow-lg shadow-brand-indigo/30"
                        : "bg-space-700 border border-card-border text-text-muted"
                    }`}>
                      {i + 1}
                    </div>

                    {/* Content */}
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

              {/* Bottom actions */}
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
