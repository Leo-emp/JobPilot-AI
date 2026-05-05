/* ============================================================
   PRICING SECTION - Two-Tier Plans
   ============================================================
   Clean two-tier layout: Free and Pro.
   Pro card is highlighted with a billing toggle (monthly/annual).
   Feature comparison table with checkmark/X symbols.
   Annual plan saves 43% ($29/mo vs $199/yr = $16.58/mo).
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";

/* ---- Feature comparison rows ---- */
/* Each row: feature name, free (true/false), pro (true/false) */
const featureRows = [
  { name: "Resume Analysis & ATS Scoring", free: true, pro: true },
  { name: "Job Match Scoring", free: true, pro: true },
  { name: "Resume Templates", free: true, pro: true },
  { name: "Application Tracker", free: true, pro: true },
  { name: "Resume Rebuild Engine", free: false, pro: true },
  { name: "Cover Letter Generator", free: false, pro: true },
  { name: "Interview Prep AI", free: false, pro: true },
  { name: "LinkedIn Optimizer", free: false, pro: true },
  { name: "Career Pivot Mode", free: false, pro: true },
  { name: "PDF & Word Download", free: false, pro: true },
  { name: "Priority Support", free: false, pro: true },
];

export default function Pricing() {
  /* Toggle between monthly and annual billing */
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* ---- Free Plan ---- */}
          <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-text-muted text-lg">/forever</span>
            </div>
            <p className="text-text-secondary mb-8">Get started and explore the platform.</p>

            {/* Free plan highlights */}
            <div className="space-y-3 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-brand-light text-lg font-bold">3</span>
                <span className="text-text-secondary text-base">AI calls per month</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-light text-lg font-bold">2</span>
                <span className="text-text-secondary text-base">tools included</span>
              </div>
            </div>

            <Link href="/signup" className="btn-secondary w-full text-center text-base py-3">
              Get Started Free
            </Link>
          </div>

          {/* ---- Pro Plan ---- */}
          <div className="relative rounded-2xl border border-brand-indigo/40 bg-space-800/60 p-8 sm:p-10 flex flex-col ring-1 ring-brand-indigo/20 shadow-lg shadow-brand-indigo/10">
            {/* Most Popular badge */}
            <div className="absolute -top-3 left-8">
              <span className="px-4 py-1 text-xs font-bold uppercase tracking-wider bg-brand-indigo text-white rounded-full">
                Most Popular
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold">
                {annual ? "$199" : "$29"}
              </span>
              <span className="text-text-muted text-lg">
                {annual ? "/year" : "/month"}
              </span>
            </div>
            {annual && (
              <p className="text-sm text-green-400 mb-2">
                $16.58/month — save $149/year
              </p>
            )}
            <p className="text-text-secondary mb-8">Everything you need to land the job.</p>

            {/* Pro plan highlights */}
            <div className="space-y-3 mb-10 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-brand-light text-lg font-bold">100</span>
                <span className="text-text-secondary text-base">AI calls per month</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-light text-lg font-bold">8</span>
                <span className="text-text-secondary text-base">tools — everything unlocked</span>
              </div>
            </div>

            <Link href="/signup?plan=pro" className="btn-primary w-full text-center text-base py-3">
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* ---- Feature Comparison Table ---- */}
        <div className="rounded-2xl border border-card-border bg-space-800/40 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] px-6 py-4 border-b border-card-border bg-space-700/30">
            <span className="text-base font-bold text-white">Features</span>
            <span className="text-base font-bold text-white text-center">Free</span>
            <span className="text-base font-bold text-brand-light text-center">Pro</span>
          </div>

          {/* Table rows */}
          {featureRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] px-6 py-3.5 items-center ${
                i % 2 === 0 ? "bg-space-800/20" : ""
              } ${i < featureRows.length - 1 ? "border-b border-card-border/50" : ""}`}
            >
              <span className="text-base text-text-secondary">{row.name}</span>

              {/* Free column — checkmark or X */}
              <div className="flex justify-center">
                {row.free ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Pro column — always checkmark */}
              <div className="flex justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ))}

          {/* AI calls row at bottom */}
          <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] px-6 py-3.5 items-center border-t border-card-border bg-space-700/20">
            <span className="text-base font-medium text-white">Monthly AI Calls</span>
            <span className="text-base font-bold text-white text-center">3</span>
            <span className="text-base font-bold text-brand-light text-center">100</span>
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
