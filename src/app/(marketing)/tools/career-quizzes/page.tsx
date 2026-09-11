/* ============================================================
   SEO LANDING PAGE — Career Quizzes & Assessments
   ============================================================
   # Targets: "career quiz", "career assessment", "career change
   # quiz", "career personality test", "should I quit my job quiz",
   # "what career suits me quiz"
   ============================================================ */

import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Career Quizzes & Assessments — AI-Powered Insights | JobPilot AI",
  description:
    "Take free AI-powered career quizzes: Career Change Readiness, Career Personality Test, and Stay or Quit Assessment. Get personalized insights, career matches, and action plans in under 60 seconds.",
  alternates: { canonical: "https://jobpilotai.co/tools/career-quizzes" },
  openGraph: {
    title: "Free Career Quizzes & Assessments — JobPilot AI",
    description:
      "AI-powered career assessments with personalized insights. Discover your career personality, evaluate career change readiness, and get an honest stay-or-quit recommendation.",
    url: "https://jobpilotai.co/tools/career-quizzes",
  },
};

/* # The 3 quizzes — used in both the feature grid and deep-dive sections */
const quizzes = [
  {
    title: "Career Change Readiness Quiz",
    slug: "career-change",
    desc: "Feeling restless? Not sure if you're ready to make the leap? This 10-question quiz evaluates your readiness across 6 dimensions: dissatisfaction level, transferable skills, financial runway, risk tolerance, clarity of direction, and preparation. You get a readiness score out of 100, personalized career suggestions, and a concrete 90-day action plan.",
    highlights: ["Readiness Score out of 100", "5 Career Matches with Salary Ranges", "90-Day Action Plan", "Risk Mitigation Strategies"],
    questions: 10,
    duration: "5 min",
  },
  {
    title: "Career Personality Test",
    slug: "personality",
    desc: "What career actually suits your personality? Not a generic Myers-Briggs label — a real analysis based on how you work, what energizes you, and what drains you. This 12-question test profiles you across 6 dimensions and matches you with 5 ideal careers, tells you which careers to avoid, and reveals hidden strengths you might not recognize.",
    highlights: ["Unique Personality Label", "Work Style DNA Across 6 Dimensions", "Top 5 Career Matches with Scores", "Careers to Avoid"],
    questions: 12,
    duration: "6 min",
  },
  {
    title: "Stay or Quit Job Assessment",
    slug: "stay-or-quit",
    desc: "Should you stay and fix things, or start planning your exit? This isn't a cheerleading quiz that tells you to follow your dreams — it's an honest assessment that weighs the rational and emotional sides of the decision. Get a clear verdict (Stay / Plan to Leave / Leave Soon), a satisfaction breakdown across 7 dimensions, and both a stay-plan and an exit strategy.",
    highlights: ["Clear Stay/Plan/Leave Verdict", "Job Satisfaction Score Across 7 Areas", "60-Day Stay Optimization Plan", "Complete Exit Strategy"],
    questions: 10,
    duration: "5 min",
  },
];

/* # FAQ section — targets long-tail search queries */
const faqs = [
  {
    q: "Are these career quizzes really free?",
    a: "Yes. All three quizzes are available on the free plan. Each quiz uses 1 AI credit from your monthly allowance (free plan includes 20 AI credits/month).",
  },
  {
    q: "How accurate are AI career assessments?",
    a: "The AI analyzes your specific answers as a whole, looking for patterns and connections you might miss. It's not a psychometric instrument — it's a personalized analysis tool. Think of it as a career coach who reads everything you wrote and gives you their honest take. The quality depends on the honesty of your answers.",
  },
  {
    q: "Can I retake a quiz with different answers?",
    a: "Absolutely. Each attempt uses 1 AI credit. Many users take the career personality test twice — once answering instinctively and once thinking carefully — to see how the results compare.",
  },
  {
    q: "How is this different from a Myers-Briggs or Holland Code test?",
    a: "Traditional personality tests assign you to a fixed category. Our AI doesn't categorize you — it reads your specific answers and generates a fully personalized report. Two people who give similar answers will still get different insights because the AI considers the full context of every answer together.",
  },
  {
    q: "Can I download or share my results?",
    a: "Yes. After getting your results you can copy the text, download as a Word document, or download as a PDF. You can also edit the results before downloading.",
  },
];

export default function CareerQuizzesLandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Career Quizzes", url: "https://jobpilotai.co/tools/career-quizzes" },
        ]}
      />

      {/* # Hero Section */}
      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">
          Free AI-Powered Assessments
        </p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Career Quizzes & Assessments
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop guessing, start knowing. Take a 5-minute quiz and get AI-powered
          personalized insights — career matches, readiness scores, action plans,
          and honest recommendations based on YOUR specific answers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
            Take a Quiz Free
          </Link>
          <Link
            href="/login"
            className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </div>

      {/* # Quiz Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {quizzes.map((quiz) => (
          <div key={quiz.slug} className="glass-card p-6 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">{quiz.title}</h2>
            <div className="flex gap-3 mb-3">
              <span className="text-xs text-text-muted bg-space-600 px-2 py-0.5 rounded-full">
                {quiz.questions} questions
              </span>
              <span className="text-xs text-text-muted bg-space-600 px-2 py-0.5 rounded-full">
                {quiz.duration}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">
              {quiz.desc}
            </p>
            <ul className="space-y-1.5 mb-4">
              {quiz.highlights.map((h) => (
                <li key={h} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-brand-light mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="text-sm font-medium text-brand-light hover:underline">
              Take This Quiz →
            </Link>
          </div>
        ))}
      </div>

      {/* # How It Works */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Pick a Quiz", desc: "Choose from Career Change, Personality, or Stay vs Quit." },
            { step: "2", title: "Answer Honestly", desc: "5-12 questions about your work, goals, and preferences." },
            { step: "3", title: "AI Analyzes Everything", desc: "Our AI reads all your answers together to find patterns." },
            { step: "4", title: "Get Your Report", desc: "Personalized insights, scores, and action plans — downloadable." },
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

      {/* # Why AI-Powered */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">
          Why AI-Powered Career Assessments?
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Traditional career quizzes sort you into boxes. Our AI reads the full context of your
          answers and generates insights that are unique to you — not a template.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Truly Personalized", desc: "Every insight references YOUR specific answers. Two people won't get the same report, even with similar answers, because the AI considers the full context." },
            { title: "Actionable, Not Abstract", desc: "You don't get a personality label and a pat on the back. You get specific career titles, salary ranges, action plans, and concrete next steps." },
            { title: "Brutally Honest", desc: "The Stay or Quit assessment won't sugarcoat a toxic situation. The Career Change quiz will tell you if you're not ready. You get the truth, not what you want to hear." },
            { title: "Multi-Dimensional", desc: "Each quiz analyzes multiple factors simultaneously — finances, skills, personality, values, constraints — and weighs them against each other for a nuanced recommendation." },
            { title: "Download & Share", desc: "Export your results as PDF or Word. Share with a career coach, mentor, or partner. Edit the AI's output before downloading." },
            { title: "Takes 5 Minutes", desc: "No 200-question marathon. Each quiz is 10-12 targeted questions designed to extract maximum insight with minimum time." },
          ].map((b) => (
            <div key={b.title} className="glass-card p-6 hover:border-brand-indigo/30 transition-colors">
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* # FAQ Section */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">
          Ready to Discover Your Career Path?
        </h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">
          Three quizzes, personalized AI insights, and actionable plans — all
          free. Take 5 minutes to get clarity on your next career move.
        </p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">
          Get Started Free
        </Link>
        <p className="text-xs text-text-muted mt-4">
          No credit card required. Part of the complete JobPilot AI career toolkit.
        </p>
      </div>
    </div>
  );
}
