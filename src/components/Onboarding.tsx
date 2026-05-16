/* ============================================================
   ONBOARDING - New User Welcome Flow
   ============================================================
   Shows for users with zero activity. Guides them to upload
   their first resume and make their first AI call.
   Dismissable — stores completion in localStorage.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OnboardingProps {
  hasActivity: boolean;
}

export default function Onboarding({ hasActivity }: OnboardingProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (hasActivity) return;
    const done = localStorage.getItem("onboarding_complete");
    if (!done) setDismissed(false);
  }, [hasActivity]);

  if (dismissed || hasActivity) return null;

  const dismiss = () => {
    localStorage.setItem("onboarding_complete", "1");
    setDismissed(true);
  };

  const steps = [
    {
      num: 1,
      title: "Upload Your Resume",
      desc: "Head to Resume Intelligence and upload your resume (PDF or paste text).",
      href: "/dashboard/resume",
      cta: "Go to Resume Tool",
    },
    {
      num: 2,
      title: "Get Your ATS Score",
      desc: "Click 'Analyze Resume' — AI scores it out of 100 and shows exactly what to fix.",
      href: "/dashboard/resume",
      cta: "Analyze Now",
    },
    {
      num: 3,
      title: "Optimize for a Job",
      desc: "Paste a job description, click 'Quick Optimize' — get a tailored resume in seconds.",
      href: "/dashboard/resume",
      cta: "Try It",
    },
  ];

  return (
    <div className="mb-10 rounded-2xl border border-brand-indigo/30 bg-gradient-to-br from-brand-indigo/10 via-space-800 to-space-900 p-6 sm:p-8 relative overflow-hidden">
      <button
        onClick={dismiss}
        className="absolute top-4 right-4 text-text-muted hover:text-white text-sm px-2 py-1"
        aria-label="Dismiss onboarding"
      >
        Skip
      </button>

      <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-2">
        Get started in 3 steps
      </h2>
      <p className="text-text-secondary mb-6">
        Land your dream job faster with AI-powered tools. Here&apos;s how to begin:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="glass-card p-5 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-brand-indigo/20 border border-brand-indigo/40 flex items-center justify-center text-sm font-bold text-brand-light mb-3">
              {step.num}
            </div>
            <h3 className="font-semibold text-white mb-1">{step.title}</h3>
            <p className="text-sm text-text-secondary flex-1 mb-3">{step.desc}</p>
            <Link
              href={step.href}
              className="text-sm font-medium text-brand-light hover:text-white transition-colors"
            >
              {step.cta} →
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-text-muted text-center">
        You have 20 free AI calls this month — no credit card needed.
      </p>
    </div>
  );
}
