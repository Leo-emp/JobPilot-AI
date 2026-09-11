/* ============================================================
   SEO LANDING PAGE — Career Change Quiz
   ============================================================
   # Targets: "career change quiz", "career change readiness",
   # "am I ready for a career change", "career transition quiz",
   # "career discovery quiz"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Career Change Quiz — Discover Your Ideal Career Path | JobPilot AI",
  description:
    "Take our AI-powered career change quiz. Two paths: Discovery (what career suits you?) or Transition (how ready are you?). Get career matches, readiness scores, and a personalized action plan.",
  alternates: { canonical: "https://jobpilotai.co/tools/career-change-quiz" },
  openGraph: {
    title: "Free Career Change Quiz — JobPilot AI",
    description: "Discover your ideal career path or evaluate your transition readiness. AI-powered insights in 7 minutes.",
    url: "https://jobpilotai.co/tools/career-change-quiz",
  },
};

const benefits = [
  {
    title: "Two Paths, One Quiz",
    desc: "Discovery Route: don't know what career to pursue — AI uncovers hidden talents and suggests 7 career matches. Transition Route: have a target — get a readiness score, skill gap analysis, and step-by-step plan.",
  },
  {
    title: "Readiness Score Out of 100",
    desc: "Not a vague 'maybe.' You get a concrete readiness score that evaluates your financial runway, transferable skills, risk tolerance, clarity, and preparation level.",
  },
  {
    title: "7 Career Matches with Salary Ranges",
    desc: "AI analyzes your strengths, interests, and experience to suggest specific careers — not generic categories. Each match includes expected salary ranges and growth outlook.",
  },
  {
    title: "90-Day Action Plan",
    desc: "Don't just learn you should change careers — get a specific week-by-week plan for the first 90 days. Research, networking, skill-building, and application targets.",
  },
  {
    title: "Skill Gap Analysis",
    desc: "See exactly which skills you already have and which you need to develop for your target career. Includes specific learning resources and certifications to pursue.",
  },
  {
    title: "14 Deep Questions",
    desc: "Not a 3-question personality quiz. 14 carefully designed questions across work satisfaction, skills, interests, financial readiness, risk tolerance, and career aspirations.",
  },
];

const faqs = [
  {
    q: "How long does the career change quiz take?",
    a: "About 7 minutes. There are 14 questions, all multiple-choice — no long text answers. The AI analysis takes about 15 seconds after you finish.",
  },
  {
    q: "What's the difference between Discovery and Transition routes?",
    a: "Discovery is for people who don't know what they want to do next. It focuses on identifying your strengths and matching you with careers. Transition is for people who have a target career and want to know if they're ready and how to get there.",
  },
  {
    q: "How accurate are the career matches?",
    a: "The matches are based on your self-reported strengths, interests, and work preferences — not a psychometric test. They're directional, not definitive. Think of them as a curated starting point for research, not a final answer.",
  },
  {
    q: "Can I retake the quiz?",
    a: "Yes, unlimited times. Each retake uses 1 AI credit. Your answers might change as your situation evolves, and the AI will generate fresh insights each time.",
  },
  {
    q: "Is this a replacement for career counselling?",
    a: "No. This quiz is an AI-powered self-reflection tool for informational purposes. For complex career decisions involving financial, legal, or psychological considerations, consult a qualified career counselor.",
  },
];

export default function CareerChangeQuizToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Career Change Quiz", url: "https://jobpilotai.co/tools/career-change-quiz" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Assessment</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Career Change Quiz
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Not sure what career suits you? Or know your target but don&apos;t know if you&apos;re ready?
          14 questions, AI analysis, concrete career matches and an action plan — in 7 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Take the Quiz Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Result Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Your Career Change Readiness</p>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-indigo-400" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="45.2" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">82</span>
                <span className="text-[10px] text-text-muted">/ 100</span>
              </div>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-400/20 text-indigo-400 border border-indigo-400/30">Ready — Strong Position to Transition</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-space-700/50 text-center">
              <p className="text-lg font-bold text-white">7</p>
              <p className="text-[10px] text-text-muted">Career Matches</p>
            </div>
            <div className="p-3 rounded-lg bg-space-700/50 text-center">
              <p className="text-lg font-bold text-white">90 days</p>
              <p className="text-[10px] text-text-muted">Action Plan</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Top Career Matches</p>
            {["Product Management", "UX Strategy", "Business Analytics"].map((c, i) => (
              <div key={c} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <span className="w-6 h-6 rounded-full bg-brand-indigo/20 text-brand-light text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-white">{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">AI analysis based on 14 questions — Discovery Route</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">More Than a Generic Career Quiz</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Most career quizzes give you a personality type and call it a day. This one gives you specific career matches, a readiness score, skill gaps, and a 90-day plan to actually make the transition.
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
            { step: "1", title: "Choose Your Path", desc: "Discovery (explore careers) or Transition (evaluate readiness for a target career)." },
            { step: "2", title: "Answer 14 Questions", desc: "Multiple-choice questions about your skills, interests, finances, and aspirations." },
            { step: "3", title: "Get Your Plan", desc: "AI delivers career matches, readiness score, skill gaps, and a 90-day action plan." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Discover Your Path?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">14 questions. 7 minutes. Career matches, readiness score, and a concrete action plan.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Take the Quiz Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
