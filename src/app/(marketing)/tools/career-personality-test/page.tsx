/* ============================================================
   SEO LANDING PAGE — Career Personality Test
   ============================================================
   # Targets: "career personality test", "work personality quiz",
   # "what career suits my personality", "career aptitude test",
   # "personality test for career"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Career Personality Test — Find Your Ideal Career Match | JobPilot AI",
  description:
    "Discover your work personality type across 6 dimensions. Get matched with 5 ideal careers, learn which careers to avoid, and uncover hidden strengths. Free AI-powered test.",
  alternates: { canonical: "https://jobpilotai.co/tools/career-personality-test" },
  openGraph: {
    title: "Free Career Personality Test — JobPilot AI",
    description: "Discover your work personality and get matched with 5 ideal careers. AI-powered, 6 minutes, free.",
    url: "https://jobpilotai.co/tools/career-personality-test",
  },
};

const benefits = [
  {
    title: "6-Dimension Work Style DNA",
    desc: "Not just 'introvert vs extrovert.' AI profiles you across Environment, Thinking Style, Pace, Motivation, Role Preference, and Focus — the dimensions that actually predict career satisfaction.",
  },
  {
    title: "Unique Personality Label",
    desc: "Get a distinctive personality label (like 'The Strategic Builder' or 'The Creative Connector') that captures your work identity — not a generic 4-letter code.",
  },
  {
    title: "Top 5 Career Matches",
    desc: "AI matches your personality profile to specific careers — with match scores, expected salary ranges, and what makes each one a good fit for your type.",
  },
  {
    title: "Careers to Avoid",
    desc: "Just as important as knowing what fits is knowing what doesn't. See which career paths are likely to drain you or conflict with your natural work style.",
  },
  {
    title: "Hidden Strengths",
    desc: "AI identifies strengths you might not recognize in yourself — patterns in your answers that reveal capabilities your colleagues probably already see.",
  },
  {
    title: "12 Thoughtful Questions",
    desc: "Not a 60-question marathon. 12 carefully designed questions that cover energy, problem-solving, ideal day, success definition, stress response, and natural interests.",
  },
];

const faqs = [
  {
    q: "How is this different from Myers-Briggs or DISC?",
    a: "Traditional personality tests give you a type and a label. This test gives you a type AND specific career matches with scores. It's designed for career decisions, not general personality insights — every question maps to work preferences.",
  },
  {
    q: "How accurate are the career matches?",
    a: "The matches are based on patterns between your work preferences and career requirements. They're directional — think of them as a curated shortlist for research. The AI also explains WHY each career matches your profile so you can evaluate the logic yourself.",
  },
  {
    q: "How long does the test take?",
    a: "About 6 minutes. 12 multiple-choice questions, no long text answers. The AI analysis takes about 15 seconds after you finish.",
  },
  {
    q: "Can I share my results?",
    a: "Yes. You can download your full personality profile as a PDF or copy the text. Share it with a career counselor, mentor, or just keep it for your own reference.",
  },
  {
    q: "Should I take this if I'm happy in my current career?",
    a: "Absolutely. Understanding your work personality helps with more than career changes — it helps you negotiate better roles, choose projects that energize you, and communicate your strengths in performance reviews.",
  },
];

export default function CareerPersonalityTestToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Career Personality Test", url: "https://jobpilotai.co/tools/career-personality-test" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free AI Assessment</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Career Personality Test
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          What career actually suits your personality? Not a generic label — a real analysis of how you work,
          what energizes you, and which careers match your work DNA.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Take the Test Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Result Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Your Work Personality</p>
            <h2 className="text-2xl font-bold text-purple-400 mb-3">The Strategic Builder</h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">You combine analytical thinking with creative execution — you see the big picture AND know how to build it piece by piece.</p>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Analytical Thinking</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-purple-500/60" style={{ width: "92%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">92%</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Leadership Drive</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-indigo-500/60" style={{ width: "85%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">85%</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Creative Problem-Solving</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-pink-500/60" style={{ width: "78%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">78%</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Social Collaboration</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-violet-500/60" style={{ width: "65%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">65%</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Structure Preference</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-blue-500/60" style={{ width: "70%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">70%</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-muted w-40 shrink-0">Risk Tolerance</p>
              <div className="flex-1 h-2.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-sky-500/60" style={{ width: "58%" }} />
              </div>
              <p className="text-xs font-semibold text-white w-8 text-right">58%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">Top Match</p>
              <p className="text-sm font-bold text-white">Product Management</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-1">Avoid</p>
              <p className="text-sm font-bold text-white">Data Entry / Repetitive</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">AI profile based on 12 questions across 6 work dimensions</p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Beyond a Personality Label</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          A good career personality test doesn&apos;t just tell you who you are — it tells you where you belong. This test connects your work style to specific careers you&apos;ll actually thrive in.
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
            { step: "1", title: "Answer 12 Questions", desc: "Multiple-choice questions about energy, problem-solving, ideal day, and natural interests." },
            { step: "2", title: "AI Profiles You", desc: "AI analyzes patterns across 6 work-style dimensions and generates your personality type." },
            { step: "3", title: "Get Career Matches", desc: "See your top 5 career matches, careers to avoid, and hidden strengths — downloadable as PDF." },
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Ready to Discover Your Work Personality?</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">12 questions. 6 minutes. Your personality type, career matches, and hidden strengths.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Take the Test Free</Link>
        <p className="text-xs text-text-muted mt-4">No credit card required. Part of the complete JobPilot AI career toolkit.</p>
      </div>
    </div>
  );
}
