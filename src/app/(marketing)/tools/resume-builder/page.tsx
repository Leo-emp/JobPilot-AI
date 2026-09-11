/* ============================================================
   SEO LANDING PAGE — AI Resume Builder & ATS Checker
   ============================================================
   # Targets: "ATS resume checker", "resume score checker",
   # "AI resume builder", "resume keyword optimizer",
   # "ATS compatibility checker", "resume analyzer"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free AI Resume Builder & ATS Checker — Score & Optimize | JobPilot AI",
  description:
    "Get an instant ATS compatibility score, find missing keywords, and let AI rebuild your resume to beat applicant tracking systems. Free AI-powered resume tool.",
  alternates: { canonical: "https://jobpilotai.co/tools/resume-builder" },
  openGraph: {
    title: "Free AI Resume Builder & ATS Checker — JobPilot AI",
    description: "Get an instant ATS score, find keyword gaps, and optimize your resume with AI. Free tool.",
    url: "https://jobpilotai.co/tools/resume-builder",
  },
};

const benefits = [
  {
    title: "Instant ATS Score",
    desc: "Upload your resume and a job description — get an ATS compatibility score out of 100 in seconds. Know exactly where you stand before applying.",
  },
  {
    title: "Missing Keyword Detection",
    desc: "AI compares your resume against the job description and highlights every important keyword you're missing. No more guessing which skills to include.",
  },
  {
    title: "Strength & Weakness Analysis",
    desc: "Get a detailed breakdown of what's working and what's not — from formatting issues to experience gaps. Actionable feedback, not vague suggestions.",
  },
  {
    title: "AI Resume Rebuild",
    desc: "Let AI rewrite your resume optimized for the specific job you're applying to. Same experience, better positioning — tailored keywords and phrasing.",
  },
  {
    title: "Professional Formatting",
    desc: "Every AI-rebuilt resume follows ATS-friendly formatting rules: clean headers, standard section names, proper hierarchy. No tables, columns, or graphics that confuse parsers.",
  },
  {
    title: "Download as PDF or Word",
    desc: "Export your optimized resume as a professional PDF or Word document. Print-ready, ATS-ready, interview-ready.",
  },
];

const faqs = [
  {
    q: "What is ATS and why does it matter?",
    a: "ATS (Applicant Tracking System) is software that 99% of large companies use to filter resumes before a human ever sees them. If your resume isn't ATS-compatible, it gets rejected automatically — regardless of your qualifications. Our checker ensures your resume passes these filters.",
  },
  {
    q: "What's a good ATS score?",
    a: "Aim for 75+ out of 100. Below 50 means your resume is likely getting filtered out. Between 50-75, you have a chance but improvements would help significantly. Above 75, you're in strong shape for most ATS systems.",
  },
  {
    q: "How does the AI rebuild work?",
    a: "After analyzing your resume against a job description, you can ask AI to rewrite it. It keeps all your real experience and achievements but repositions them with the right keywords, phrasing, and emphasis for the specific role. You review and edit everything before downloading.",
  },
  {
    q: "Does the AI make up experience I don't have?",
    a: "Never. The AI only works with the experience you provide. It rephrases and repositions your real skills and achievements to better match the job description — it doesn't fabricate qualifications.",
  },
  {
    q: "How is this different from other resume checkers?",
    a: "Most checkers give you a score and a vague list of suggestions. JobPilot AI gives you the score, specific missing keywords, a strength/weakness breakdown, AND can rebuild your entire resume optimized for the role — all in one tool.",
  },
];

export default function ResumeBuilderToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "AI Resume Builder", url: "https://jobpilotai.co/tools/resume-builder" },
        ]}
      />

      {/* # Hero */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Tool</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          AI Resume Builder & ATS Checker
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop guessing whether your resume will pass ATS filters. Get an instant score,
          find missing keywords, and let AI rebuild your resume to match any job description.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Check Your Resume Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">
            Already have an account?
          </Link>
        </div>
      </div>

      {/* # Example ATS Score Preview */}
      <div className="mb-20">
        <div className="glass-card p-8 sm:p-10 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">80</span>
                <span className="text-xs text-text-muted">/ 100</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-1">ATS Compatibility Score</h2>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">Strong — Good to Apply</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-lg font-bold text-emerald-400">12</p>
              <p className="text-xs text-text-muted">Keywords Matched</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-lg font-bold text-amber-400">3</p>
              <p className="text-xs text-text-muted">Keywords Missing</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <p className="text-lg font-bold text-sky-400">5</p>
              <p className="text-xs text-text-muted">Improvements</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">Analyzed by JobPilot AI in 6 seconds — Senior Product Manager at Google</p>
          </div>
        </div>
      </div>

      {/* # Benefits */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Why Use an AI Resume Checker?</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          75% of resumes are rejected by ATS before a human ever reads them. Don&apos;t let software disqualify you — optimize your resume for both machines and hiring managers.
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

      {/* # How It Works */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Upload & Paste", desc: "Upload your resume and paste the job description you're targeting." },
            { step: "2", title: "AI Analyzes", desc: "AI scores ATS compatibility, finds missing keywords, and identifies gaps." },
            { step: "3", title: "Optimize & Download", desc: "Get your optimized resume as a PDF or Word doc — ready to apply." },
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

      {/* # FAQ */}
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

      {/* # Bottom CTA */}
      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          Get your ATS score in seconds. Find missing keywords. Let AI rebuild your resume for any job.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Get Started Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
