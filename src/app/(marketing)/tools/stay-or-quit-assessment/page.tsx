/* ============================================================
   SEO LANDING PAGE — Stay or Quit Assessment
   ============================================================
   # Targets: "should I quit my job quiz", "stay or leave job quiz",
   # "job satisfaction assessment", "should I stay at my job",
   # "quit my job quiz"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Should I Quit My Job? Free Stay or Quit Assessment | JobPilot AI",
  description:
    "Get an honest, AI-powered verdict: Stay, Plan Your Exit, or Leave Soon. 15 questions covering satisfaction, growth, culture, compensation, and financial readiness.",
  alternates: { canonical: "https://jobpilotai.co/tools/stay-or-quit-assessment" },
  openGraph: {
    title: "Should I Quit My Job? Stay or Quit Assessment — JobPilot AI",
    description: "15 questions, honest AI verdict, satisfaction breakdown, and both a stay-plan and exit strategy.",
    url: "https://jobpilotai.co/tools/stay-or-quit-assessment",
  },
};

const benefits = [
  {
    title: "Honest, Data-Driven Verdict",
    desc: "This isn't a cheerleading quiz that tells you to follow your dreams. It weighs the rational and emotional sides of your decision and gives you an honest recommendation: Stay, Plan Your Exit, or Leave Soon.",
  },
  {
    title: "7-Dimension Satisfaction Breakdown",
    desc: "See your job satisfaction scored across Growth, Manager, Culture, Compensation, Work-Life Balance, Impact, and Team — so you know exactly which areas are working and which are broken.",
  },
  {
    title: "Both a Stay Plan AND Exit Strategy",
    desc: "No matter the verdict, you get actionable plans for both scenarios: a 60-day optimization plan if you stay, and a complete exit strategy if you go. You're covered either way.",
  },
  {
    title: "Financial Readiness Check",
    desc: "The quiz evaluates your financial runway alongside satisfaction. Because knowing you should leave and being able to leave are two different things.",
  },
  {
    title: "The Dealbreaker Question",
    desc: "We ask the question most people avoid: 'What's the one thing that, if fixed, would change everything?' AI uses this to distinguish fixable problems from fundamental mismatches.",
  },
  {
    title: "15 Comprehensive Questions",
    desc: "Covers emotional baseline, duration, impact, growth, manager, team, culture, career interest, compensation, work-life balance, financial runway, and job search readiness.",
  },
];

const faqs = [
  {
    q: "Will the quiz just tell me what I want to hear?",
    a: "No. That's the whole point. This assessment is designed to give you an honest verdict based on your actual situation — not validate a decision you've already made. If you're unhappy but financially unprepared to leave, it'll tell you that too.",
  },
  {
    q: "What verdicts can I get?",
    a: "Three possible verdicts: Stay (the problems are fixable, with a plan to fix them), Plan Your Exit (start preparing but don't rush), or Leave Soon (the situation is untenable and you should prioritize your exit). Each comes with specific reasoning.",
  },
  {
    q: "How long does it take?",
    a: "About 5 minutes. 15 multiple-choice questions, all designed to evaluate different dimensions of your job satisfaction and readiness to leave.",
  },
  {
    q: "Is my data private?",
    a: "Your quiz answers are processed by AI to generate your results and are not stored permanently or shared with anyone. This is between you and the AI.",
  },
  {
    q: "What if I disagree with the verdict?",
    a: "That's valuable information too. If the AI says 'Stay' and your gut says 'Leave,' explore why. Sometimes the emotional signal is more important than the logical analysis. The quiz is a tool for reflection, not a final decision-maker.",
  },
];

export default function StayOrQuitAssessmentToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Stay or Quit Assessment", url: "https://jobpilotai.co/tools/stay-or-quit-assessment" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Assessment</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Should I Quit My Job?
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop going back and forth. 15 questions, an honest AI verdict, satisfaction breakdown
          across 7 dimensions, and both a stay-plan and exit strategy — so you&apos;re prepared no matter what.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Take the Assessment Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Verdict Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3">AI Verdict</p>
            <div className="inline-block px-6 py-2.5 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
              <p className="text-xl font-bold text-amber-400">Plan Your Exit</p>
            </div>
            <p className="text-sm text-text-secondary max-w-md mx-auto">Your core issues (growth and management) are structural, not temporary. Start planning while you can be strategic about your next move.</p>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Job Satisfaction Breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { area: "Growth", score: 3, color: "text-red-400 bg-red-500/10 border-red-500/20" },
              { area: "Manager", score: 4, color: "text-red-400 bg-red-500/10 border-red-500/20" },
              { area: "Culture", score: 5, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { area: "Pay", score: 7, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { area: "WLB", score: 6, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { area: "Impact", score: 4, color: "text-red-400 bg-red-500/10 border-red-500/20" },
              { area: "Team", score: 7, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { area: "Career Fit", score: 5, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            ].map((s) => (
              <div key={s.area} className={`px-3 py-2 rounded-lg border text-center ${s.color}`}>
                <p className="text-lg font-bold">{s.score}/10</p>
                <p className="text-[10px]">{s.area}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] text-blue-400 font-semibold uppercase mb-1">60-Day Stay Plan</p>
              <p className="text-xs text-text-secondary">Negotiate growth, set boundaries...</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] text-amber-400 font-semibold uppercase mb-1">Exit Strategy</p>
              <p className="text-xs text-text-secondary">Financial prep, job search timeline...</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">AI verdict based on 15 questions across 7 satisfaction dimensions</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Not Just Another &ldquo;Should I Quit?&rdquo; Quiz</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Most quizzes either tell you to follow your dreams or stay safe. This one weighs your actual situation — satisfaction, finances, growth, culture — and gives you an honest recommendation with plans for both paths.
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
            { step: "1", title: "Answer 15 Questions", desc: "Cover emotional baseline, manager, culture, growth, pay, WLB, and financial readiness." },
            { step: "2", title: "AI Evaluates", desc: "AI weighs all dimensions honestly — no cheerleading, no fear-mongering." },
            { step: "3", title: "Get Your Verdict", desc: "Stay, Plan Your Exit, or Leave Soon — plus a satisfaction breakdown and plans for both paths." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready for an Honest Answer?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">15 questions. 5 minutes. An honest verdict with plans for both paths.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Take the Assessment Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
