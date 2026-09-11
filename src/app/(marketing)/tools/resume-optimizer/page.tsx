/* ============================================================
   SEO LANDING PAGE — Resume Optimizer
   ============================================================
   # Targets: "resume optimizer", "optimize resume for job",
   # "ATS resume optimizer", "tailor resume to job description",
   # "resume keyword optimizer"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Resume Optimizer — Tailor Your Resume to Any Job | JobPilot AI",
  description:
    "Paste a job description and AI rewrites your resume to match — adding missing keywords, strengthening bullets, and boosting your ATS score. Quick optimize in seconds.",
  alternates: { canonical: "https://jobpilotai.co/tools/resume-optimizer" },
  openGraph: {
    title: "Free AI Resume Optimizer — JobPilot AI",
    description: "AI tailors your resume to any job description. Missing keywords added, bullets strengthened, ATS score boosted.",
    url: "https://jobpilotai.co/tools/resume-optimizer",
  },
};

const benefits = [
  {
    title: "Job-Specific Tailoring",
    desc: "Paste any job description and AI rewrites your resume to match that specific role. Different JD? Different optimized resume. Every application gets a tailored version.",
  },
  {
    title: "Keyword Injection",
    desc: "AI identifies the exact keywords from the job description that are missing from your resume and weaves them naturally into your experience and skills sections.",
  },
  {
    title: "Bullet Point Enhancement",
    desc: "Weak bullet points get rewritten with stronger action verbs, quantified results, and role-relevant language. 'Managed a team' becomes 'Led a cross-functional team of 8 to deliver...'",
  },
  {
    title: "Before & After Comparison",
    desc: "See exactly what changed. AI highlights every modification so you can review, accept, or adjust before using the optimized version.",
  },
  {
    title: "ATS Score Boost",
    desc: "Most resumes see a 15-25 point ATS score increase after optimization. Keywords that ATS systems scan for are added without making your resume sound generic.",
  },
  {
    title: "Quick — Under 30 Seconds",
    desc: "This is the quick optimize, not a full rebuild. Paste your resume + JD, and get an optimized version in under 30 seconds. Perfect for rapid-fire applications.",
  },
];

const faqs = [
  {
    q: "How is this different from Resume Rebuild?",
    a: "Quick Optimize takes your existing resume and adjusts it for a specific job — adding keywords, strengthening bullets, aligning language. Full Rebuild completely rewrites your resume from scratch for a target role. Optimize is fast (30 seconds); Rebuild is thorough (2-3 minutes).",
  },
  {
    q: "Will my resume still sound like me?",
    a: "Yes. AI preserves your voice and experience while adding relevant keywords and strengthening language. It optimizes, it doesn't replace. You can review every change before using it.",
  },
  {
    q: "Should I optimize for every job I apply to?",
    a: "Ideally, yes. Tailoring your resume to each job description significantly increases your chances of passing ATS filters. With Quick Optimize, it takes 30 seconds per job — a small investment for a much higher callback rate.",
  },
  {
    q: "What input do I need?",
    a: "Your current resume (upload PDF or paste text) and the target job description (paste from the job posting). The more detailed the JD, the better the optimization.",
  },
  {
    q: "Can I optimize the same resume for multiple jobs?",
    a: "Absolutely. That's the intended workflow. Upload your base resume once, then paste different job descriptions to generate tailored versions for each application.",
  },
];

export default function ResumeOptimizerToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Resume Optimizer", url: "https://jobpilotai.co/tools/resume-optimizer" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Resume Optimizer
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          One resume doesn&apos;t fit all jobs. Paste the job description and AI tailors your
          resume in 30 seconds — adding missing keywords, strengthening bullets, and boosting your ATS score.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Optimize My Resume Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Before/After Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex gap-3 mb-5">
            <div className="flex-1 text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs font-semibold text-red-400">Before: 54/100</p>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400">After: 87/100</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Before</p>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-xs text-text-secondary line-through decoration-red-400/50">Managed a team and worked on various projects to improve company performance</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">After</p>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-white">Led a cross-functional team of 8 engineers to deliver 3 product features, increasing user retention by 34% and reducing churn by $420K annually</p>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-card-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Keywords Added</p>
            <div className="flex flex-wrap gap-1.5">
              {["cross-functional", "product features", "user retention", "data-driven", "agile", "stakeholder management"].map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">+{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Stop Sending Generic Resumes</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Recruiters can tell when you send the same resume to every job. Tailored resumes get 3x more callbacks. Quick Optimize makes tailoring take seconds, not hours.
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
            { step: "1", title: "Upload Resume + JD", desc: "Upload your resume and paste the job description you're targeting." },
            { step: "2", title: "AI Optimizes", desc: "Keywords added, bullets strengthened, language aligned to the role — in 30 seconds." },
            { step: "3", title: "Review & Download", desc: "See every change, adjust if needed, and download the optimized version." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Tailor Your Resume in 30 Seconds</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">Paste the JD. Get an optimized resume. Apply with confidence.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Optimize My Resume Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
