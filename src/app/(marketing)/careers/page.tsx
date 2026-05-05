/* ============================================================
   CAREERS PAGE
   ============================================================
   Shows open positions and company culture info.
   Currently no open roles — displays a "join our waitlist"
   message with an email signup. Builds brand credibility
   by showing the company is growing.
   ============================================================ */

import Link from "next/link";

export const metadata = {
  title: "Careers — JobPilot AI",
  description: "Join the JobPilot AI team. We're building the future of AI-powered career tools.",
};

/* ---- Company values ---- */
const values = [
  {
    title: "Build for the User",
    description: "Every feature we ship solves a real problem for real job seekers. If it doesn't help someone land a job, we don't build it.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Ship Fast, Iterate Faster",
    description: "We move quickly, learn from real usage data, and improve every week. Perfect is the enemy of shipped.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Transparency First",
    description: "We're honest about what our AI can and can't do. No dark patterns, no fake urgency, no misleading claims.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Remote by Default",
    description: "Work from anywhere. We believe talent isn't limited by geography and great work happens when people have flexibility.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <div className="mb-16">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
          Careers
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          We&apos;re building the future of AI-powered career tools. Join us and help millions of people land their dream jobs.
        </p>
      </div>

      {/* ---- Our Values ---- */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8">How We Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div key={i} className="rounded-2xl border border-card-border bg-space-800/60 p-6">
              <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-light mb-4">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-base text-text-secondary leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Open Positions ---- */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
        <div className="rounded-2xl border border-card-border bg-space-800/60 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-light mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">No Open Roles Right Now</h3>
          <p className="text-text-secondary text-base mb-6 max-w-md mx-auto">
            We&apos;re a small team growing fast. Check back soon or follow us to be the first to know when we&apos;re hiring.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 rounded-xl text-sm font-medium text-brand-light border border-brand-indigo/30 hover:bg-brand-indigo/10 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* ---- Perks ---- */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Why Join Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Remote-First", sub: "Work from anywhere in the world" },
            { label: "Flexible Hours", sub: "We care about output, not hours" },
            { label: "Early Team", sub: "Shape the product and culture from day one" },
          ].map((perk, i) => (
            <div key={i} className="rounded-xl border border-card-border bg-space-800/40 p-5 text-center">
              <p className="font-bold text-white mb-1">{perk.label}</p>
              <p className="text-sm text-text-muted">{perk.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
