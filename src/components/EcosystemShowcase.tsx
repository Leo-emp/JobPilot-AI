/* ============================================================
   ECOSYSTEM SHOWCASE - Job Board & AI Outreach Hub
   ============================================================
   Showcases two platform features below the AI tool showcase:
   1. Job Board Integration — search real listings, save & track
   2. AI Outreach Hub — generate cold outreach messages with AI
   Concise benefit-driven copy with visual UI snapshots.
   ============================================================ */

import Link from "next/link";

export default function EcosystemShowcase() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-20 sm:mb-28">
          <p className="text-sm font-semibold uppercase tracking-widest glow-text-subtle mb-4">
            Beyond AI Tools
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Your Complete Career{" "}
            <span className="glow-text">Command Center</span>
          </h2>
          <p className="max-w-xl mx-auto text-text-secondary text-lg">
            Search real jobs and craft perfect outreach — without leaving your dashboard.
          </p>
        </div>

        {/* ============================================================
             FEATURE 1 - Job Board Integration
             ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center mb-24 sm:mb-32">

          {/* ---- Content Side ---- */}
          <div className="flex-1 max-w-xl">
            {/* Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Job Board Integration
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Search thousands of jobs without leaving your dashboard
            </h3>

            {/* Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Real listings from Indeed, LinkedIn, Glassdoor, and more — pulled directly into your workspace.
              Save roles with one click and they land straight in your tracker.
            </p>

            {/* Capability bullets */}
            <ul className="space-y-3">
              {[
                "Search by title, location, and salary across major job boards",
                "One-click save to your Application Tracker",
                "Salary, contract type, and posting date on every listing",
              ].map((cap, j) => (
                <li key={j} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Visual Side — Job Search Snapshot ---- */}
          <div className="flex-1 w-full max-w-lg">
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600" />

              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50" />
              </div>

              {/* Search bar */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 px-3 py-2 rounded-lg bg-space-700 border border-card-border">
                  <span className="text-xs text-white">Software Engineer</span>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-space-700 border border-card-border">
                  <span className="text-xs text-text-muted">New York, NY</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <span className="text-xs text-white font-semibold">Search</span>
                </div>
              </div>

              {/* Results count */}
              <p className="text-xs text-text-muted mb-3">2,847 jobs found</p>

              {/* Job card 1 */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-card-border mb-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-white">Senior Software Engineer</div>
                    <div className="text-xs text-text-secondary">TechCorp Inc.</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-green-500/15 border border-green-500/30">
                    <span className="text-[10px] text-green-400 font-semibold">Saved</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-secondary">New York, NY</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] text-green-400">$150k - $200k</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] text-blue-400">Full Time</span>
                </div>
              </div>

              {/* Job card 2 */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-card-border mb-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-white">Full Stack Developer</div>
                    <div className="text-xs text-text-secondary">InnovateTech</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-brand-indigo/15 border border-brand-indigo/30">
                    <span className="text-[10px] text-brand-light font-semibold">Save Job</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-secondary">Remote</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] text-green-400">$120k - $160k</span>
                  <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-muted">2 days ago</span>
                </div>
              </div>

              {/* Job card 3 — partial */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-card-border opacity-60">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-white">Backend Engineer</div>
                    <div className="text-xs text-text-secondary">StartupXYZ</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-brand-indigo/15 border border-brand-indigo/30">
                    <span className="text-[10px] text-brand-light font-semibold">Save Job</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
             FEATURE 2 - AI Outreach Hub
             ============================================================ */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">

          {/* ---- Content Side ---- */}
          <div className="flex-1 max-w-xl">
            {/* Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                AI Outreach Hub
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Cold messages that actually get replies
            </h3>

            {/* Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Upload your resume, describe who you&apos;re reaching out to, and AI generates 3 personalized message
              versions — from short and direct to detailed and confident. No more generic templates that get ignored.
            </p>

            {/* Capability bullets */}
            <ul className="space-y-3">
              {[
                "Upload your resume PDF — AI extracts your background automatically",
                "3 unique message styles: Short & Direct, Confident & Detailed, Natural & Human",
                "References specific details from both your background and the recipient",
              ].map((cap, j) => (
                <li key={j} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-base text-text-secondary leading-relaxed">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Visual Side — AI Outreach Hub Snapshot ---- */}
          <div className="flex-1 w-full max-w-lg">
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-600" />

              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-2 flex-1 h-5 rounded-md bg-space-600/50" />
              </div>

              {/* Resume uploaded badge */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-space-700/50 border border-card-border">
                <span className="text-sm">📄</span>
                <span className="text-[11px] text-white font-medium">resume_2026.pdf</span>
                <span className="text-[9px] text-green-400 ml-auto">Uploaded</span>
              </div>

              {/* Recipient info */}
              <div className="mb-4 px-3 py-2 rounded-lg bg-space-700/50 border border-card-border">
                <div className="text-[10px] text-text-muted mb-1">Reaching out to:</div>
                <div className="text-xs text-white font-medium">Sarah Chen — Engineering Manager at Google</div>
              </div>

              {/* 3 message version tabs */}
              <div className="flex gap-2 mb-3">
                <div className="px-3 py-1.5 rounded-lg bg-brand-indigo/20 border border-brand-indigo/30">
                  <span className="text-[10px] text-white font-medium">Short & Direct</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-space-700/50">
                  <span className="text-[10px] text-text-muted font-medium">Confident</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-space-700/50">
                  <span className="text-[10px] text-text-muted font-medium">Natural</span>
                </div>
              </div>

              {/* Message preview */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-brand-indigo/20 mb-3">
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Hi Sarah, I saw Google&apos;s work on the Gemini API and it caught my attention — I&apos;ve been building AI-powered
                  career tools with it. With 5 years in full-stack development and a focus on AI integration, I&apos;d love to
                  chat about opportunities on your team...
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <div className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-center">
                  <span className="text-[10px] text-white font-semibold">Copy Message</span>
                </div>
                <div className="py-2 px-3 rounded-lg bg-space-700/50 border border-card-border">
                  <span className="text-[10px] text-text-muted">Edit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Bottom CTA ---- */}
        <div className="mt-24 sm:mt-32 text-center">
          <p className="text-text-secondary text-lg mb-6">
            Find jobs. Craft perfect outreach. Land interviews.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
