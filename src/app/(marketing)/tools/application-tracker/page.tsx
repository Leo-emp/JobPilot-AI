/* ============================================================
   SEO LANDING PAGE — Application Tracker
   ============================================================
   # Targets: "job application tracker", "application tracker",
   # "job search tracker", "track job applications",
   # "job application pipeline"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Job Application Tracker — Organize Your Job Search | JobPilot AI",
  description:
    "Track every job application in one place. Save jobs with one click, monitor application stages, get AI match scores, and never lose track of an opportunity.",
  alternates: { canonical: "https://jobpilotai.co/tools/application-tracker" },
  openGraph: {
    title: "Free Job Application Tracker — JobPilot AI",
    description: "Track every application, monitor stages, and stay organized throughout your job search.",
    url: "https://jobpilotai.co/tools/application-tracker",
  },
};

const benefits = [
  {
    title: "One Dashboard, Every Application",
    desc: "No more spreadsheets, sticky notes, or lost emails. Every job you apply to lives in one organized dashboard with real-time status updates.",
  },
  {
    title: "Pipeline Stages",
    desc: "Track each application through stages: Saved, Applied, Phone Screen, Interview, Offer, and Rejected. Drag and drop to update. See your entire pipeline at a glance.",
  },
  {
    title: "AI Match Scores",
    desc: "Every tracked job shows an AI match score based on your resume. Quickly see which applications have the highest chance of success and focus your energy there.",
  },
  {
    title: "One-Click Save from Job Board",
    desc: "Found a job on our AI Job Board? Save it directly to your tracker with one click. All the job details are auto-filled — no manual data entry.",
  },
  {
    title: "Notes & Follow-ups",
    desc: "Add notes to each application: interviewer names, salary discussed, follow-up dates. Never walk into an interview forgetting what you discussed last time.",
  },
  {
    title: "Free & Unlimited",
    desc: "Track unlimited applications on any plan. No caps, no premium tiers for basic tracking. Your job search is stressful enough — your tools shouldn't add to it.",
  },
];

const faqs = [
  {
    q: "How many applications can I track?",
    a: "Unlimited. There's no cap on the number of jobs you can track, on any plan. Track 5 applications or 500 — it's all included.",
  },
  {
    q: "Can I import applications from other trackers?",
    a: "Currently, you add applications manually or save them directly from our AI Job Board with one click. We're working on import functionality for spreadsheets and other tools.",
  },
  {
    q: "What stages are available?",
    a: "Default stages include: Saved, Applied, Phone Screen, Interview, Offer, and Rejected. These cover the standard job search pipeline from discovery to decision.",
  },
  {
    q: "Can I add notes to each application?",
    a: "Yes. Each tracked job has a notes section where you can record interviewer names, key discussion points, salary ranges mentioned, follow-up dates, and any other details you want to remember.",
  },
  {
    q: "Does the tracker integrate with the other tools?",
    a: "Yes. When you save a job from the AI Job Board, it appears in your tracker automatically. You can also generate a tailored cover letter or optimize your resume for any tracked job directly from the tracker.",
  },
];

export default function ApplicationTrackerToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Application Tracker", url: "https://jobpilotai.co/tools/application-tracker" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Job Application Tracker
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop losing track of where you applied. One dashboard to manage every job application
          from &ldquo;Saved&rdquo; to &ldquo;Offer&rdquo; — with AI match scores for each.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Start Tracking Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Pipeline Preview */}
      <div className="mb-20 max-w-3xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { stage: "Saved", count: 8, color: "bg-white/10 text-text-secondary" },
              { stage: "Applied", count: 5, color: "bg-blue-500/10 text-blue-400" },
              { stage: "Interview", count: 3, color: "bg-amber-500/10 text-amber-400" },
              { stage: "Offer", count: 1, color: "bg-emerald-500/10 text-emerald-400" },
            ].map((s) => (
              <div key={s.stage} className={`px-4 py-2 rounded-lg text-sm font-medium ${s.color} border border-white/10`}>
                {s.stage} <span className="font-bold ml-1">{s.count}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { role: "Product Manager", company: "Google", stage: "Interview", match: "94%", stageColor: "text-amber-400 bg-amber-500/10" },
              { role: "UX Designer", company: "Spotify", stage: "Applied", match: "87%", stageColor: "text-blue-400 bg-blue-500/10" },
              { role: "Data Analyst", company: "Stripe", stage: "Offer", match: "72%", stageColor: "text-emerald-400 bg-emerald-500/10" },
            ].map((a) => (
              <div key={a.role} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-space-700/50 border border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{a.role}</p>
                  <p className="text-xs text-text-muted">{a.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${a.stageColor}`}>{a.stage}</span>
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-brand-indigo/10 text-brand-light">{a.match}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">Your complete job search pipeline — all in one place</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Why Track Your Applications?</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Job seekers who track applications systematically are 3x more likely to stay consistent and land offers faster. Organization beats volume every time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6 hover:border-brand-indigo/30 transition-colors">
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Save Jobs", desc: "Add jobs from our Job Board with one click, or manually enter any job you've applied to." },
            { step: "2", title: "Track Progress", desc: "Move jobs through pipeline stages as you progress — from Applied to Interview to Offer." },
            { step: "3", title: "Stay Organized", desc: "Add notes, set follow-up dates, and use AI tools to tailor your materials for each role." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-light font-bold text-lg">{s.step}</span>
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Get Organized?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Track every application in one place. Never lose track of an opportunity again.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
