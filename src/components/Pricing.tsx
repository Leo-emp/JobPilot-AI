/* ============================================================
   PRICING SECTION - Two-Tier Plans
   ============================================================
   Unified layout: two plan cards side by side with the feature
   comparison built into each card. Monthly/annual toggle.
   Clean, compact design — no separate table below.
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";

/* ---- Feature rows shown inside each card ---- */
/* Grouped into fewer, clearer lines */
const featureRows = [
  { name: "All 10 AI Tools (full access)", free: true, pro: true },
  { name: "Resume Analysis & ATS Scoring", free: true, pro: true },
  { name: "Resume Rebuild Engine", free: true, pro: true },
  { name: "Cover Letter Generator", free: true, pro: true },
  { name: "Interview Prep AI", free: true, pro: true },
  { name: "LinkedIn Optimizer", free: true, pro: true },
  { name: "Career Pivot Mode", free: true, pro: true },
  { name: "Job Match Scoring", free: true, pro: true },
  { name: "Application Tracker", free: true, pro: true },
  { name: "PDF & Word Download", free: true, pro: true },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest glow-text-subtle mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent{" "}
            <span className="glow-text">Pricing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        {/* ---- Billing Toggle ---- */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-base font-medium transition-colors ${!annual ? "text-white" : "text-text-muted"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-brand-indigo" : "bg-space-600"}`}
            aria-label="Toggle annual billing"
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "left-8" : "left-1"}`} />
          </button>
          <span className={`text-base font-medium transition-colors ${annual ? "text-white" : "text-text-muted"}`}>
            Annual
          </span>
          {annual && (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-green-500/15 text-green-400 rounded-full border border-green-500/20">
              Save 43%
            </span>
          )}
        </div>

        {/* ---- Pricing Cards ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ---- Free Plan ---- */}
          <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold">£0</span>
            </div>
            <p className="text-text-secondary text-sm mb-6">20 AI calls per month</p>

            {/* Feature list */}
            <div className="space-y-2.5 mb-8 flex-1">
              {featureRows.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  {row.free ? (
                    <svg className="w-4.5 h-4.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5 text-text-muted/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={`text-sm ${row.free ? "text-text-secondary" : "text-text-muted/50"}`}>
                    {row.name}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/signup" className="btn-secondary w-full text-center text-base py-3">
              Get Started Free
            </Link>
          </div>

          {/* ---- Pro Plan ---- */}
          <div className="relative rounded-2xl border border-brand-indigo/40 bg-space-800/60 p-8 flex flex-col ring-1 ring-brand-indigo/20 shadow-lg shadow-brand-indigo/10">
            <div className="absolute -top-3 left-8">
              <span className="px-4 py-1 text-xs font-bold uppercase tracking-wider bg-brand-indigo text-white rounded-full">
                Most Popular
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-5xl font-extrabold">{annual ? "£199" : "£29"}</span>
              <span className="text-text-muted text-lg">{annual ? "/year" : "/month"}</span>
            </div>
            {annual ? (
              <p className="text-sm text-green-400 mb-6">£16.58/mo — save £149/year</p>
            ) : (
              <p className="text-text-secondary text-sm mb-6">1,000 AI calls/month — effectively unlimited</p>
            )}

            {/* Feature list — all checked */}
            <div className="space-y-2.5 mb-8 flex-1">
              {featureRows.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-4.5 h-4.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-text-secondary">{row.name}</span>
                </div>
              ))}
            </div>

            <Link href="/signup?plan=pro" className="btn-primary w-full text-center text-base py-3">
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* ---- Bottom trust line ---- */}
        <p className="mt-8 text-center text-base text-text-muted">
          No credit card required to start &bull; Cancel anytime &bull; 7-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
