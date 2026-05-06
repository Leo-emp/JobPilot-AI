/* ============================================================
   ECOSYSTEM SHOWCASE - Job Board & Networking CRM
   ============================================================
   Showcases two platform features below the AI tool showcase:
   1. Job Board Integration — search real listings, save & track
   2. Networking CRM — manage contacts, companies, follow-ups
   Concise benefit-driven copy with visual UI snapshots.
   ============================================================ */

import Link from "next/link";

export default function EcosystemShowcase() {
  return (
    <section className="relative z-10 py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ---- Section Header ---- */}
        <div className="text-center mb-20 sm:mb-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light mb-4">
            Beyond AI Tools
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Your Complete Career{" "}
            <span className="glow-text">Command Center</span>
          </h2>
          <p className="max-w-xl mx-auto text-text-secondary text-lg">
            Search real jobs and manage your network — without leaving your dashboard.
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
             FEATURE 2 - Networking CRM
             ============================================================ */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">

          {/* ---- Content Side ---- */}
          <div className="flex-1 max-w-xl">
            {/* Feature tag */}
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm sm:text-base font-semibold text-text-muted uppercase tracking-wider">
                Networking CRM
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Track every recruiter, referral, and follow-up in one place
            </h3>

            {/* Description */}
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              Referred candidates are 4x more likely to get hired. Manage your contacts, tag relationships,
              set follow-up reminders, and track target companies — so no opportunity slips through the cracks.
            </p>

            {/* Capability bullets */}
            <ul className="space-y-3">
              {[
                "Contact profiles with LinkedIn, role, company, and notes",
                "Follow-up reminders with overdue alerts",
                "Target company tracker with priority and status pipeline",
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

          {/* ---- Visual Side — Networking CRM Snapshot ---- */}
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

              {/* Stats bar */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                <div className="p-2 rounded-lg bg-space-700/50 text-center">
                  <div className="text-lg font-bold text-white">24</div>
                  <div className="text-[9px] text-text-muted">Contacts</div>
                </div>
                <div className="p-2 rounded-lg bg-space-700/50 text-center">
                  <div className="text-lg font-bold text-white">8</div>
                  <div className="text-[9px] text-text-muted">Companies</div>
                </div>
                <div className="p-2 rounded-lg bg-space-700/50 text-center">
                  <div className="text-lg font-bold text-amber-400">3</div>
                  <div className="text-[9px] text-text-muted">Follow-ups</div>
                </div>
                <div className="p-2 rounded-lg bg-space-700/50 text-center">
                  <div className="text-lg font-bold text-white">5</div>
                  <div className="text-[9px] text-text-muted">High Priority</div>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-2 mb-4">
                <div className="px-3 py-1 rounded-lg bg-brand-indigo/20 border border-brand-indigo/30">
                  <span className="text-[10px] text-white font-medium">Contacts (24)</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-space-700/50">
                  <span className="text-[10px] text-text-muted font-medium">Companies (8)</span>
                </div>
              </div>

              {/* Contact card 1 — with overdue follow-up */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-amber-500/30 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center text-xs font-bold text-white shrink-0">
                    S
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">Sarah Chen</div>
                    <div className="text-[10px] text-text-secondary">Engineering Manager at Google</div>
                  </div>
                  <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-[10px] text-purple-400 font-medium border border-purple-500/30">Recruiter</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-[10px] text-amber-400 font-medium border border-amber-500/30">Follow-up overdue</span>
                </div>
              </div>

              {/* Contact card 2 */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-card-border mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    M
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">Marcus Rivera</div>
                    <div className="text-[10px] text-text-secondary">VP of Product at Stripe</div>
                  </div>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-[10px] text-green-400 font-medium border border-green-500/30">Referral</span>
                  <span className="px-2 py-0.5 rounded-full bg-space-600 text-[10px] text-text-muted">Last contact: May 3</span>
                </div>
              </div>

              {/* Contact card 3 — partial */}
              <div className="p-3 rounded-lg bg-space-700/50 border border-card-border opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    J
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">James Park</div>
                    <div className="text-[10px] text-text-secondary">Hiring Manager at Meta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Bottom CTA ---- */}
        <div className="mt-24 sm:mt-32 text-center">
          <p className="text-text-secondary text-lg mb-6">
            Find jobs. Build relationships. Land interviews.
          </p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
