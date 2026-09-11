/* ============================================================
   CAREER QUIZZES HUB — Dashboard Page
   ============================================================
   # Landing page showing all 3 career quizzes/assessments.
   # Each card links to its dedicated quiz page.
   ============================================================ */

import Link from "next/link";

/* # Quiz data for the hub cards */
const quizzes = [
  {
    href: "/dashboard/career-quizzes/career-change",
    title: "Career Change Quiz",
    subtitle: "Discover your path or plan your transition",
    description:
      "Two routes: Discovery (don't know what career to pursue — uncover hidden talents, get 7 career matches) or Transition (have a target — get a readiness score, skill gap analysis, and personalized plan). 14 deep questions per route.",
    duration: "7 min",
    questions: 14,
    color: "indigo",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/career-quizzes/personality",
    title: "Career Personality Test",
    subtitle: "Discover what career suits you best",
    description:
      "Uncover your work personality type across 6 dimensions. Get matched with 5 ideal careers, identify hidden strengths, learn which careers to avoid, and find your ideal work environment.",
    duration: "6 min",
    questions: 12,
    color: "purple",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/career-quizzes/stay-or-quit",
    title: "Stay or Quit Assessment",
    subtitle: "Should you stay or should you go?",
    description:
      "Get an honest, data-driven recommendation. Receive a job satisfaction breakdown across 7 dimensions, discover what's fixable vs what's broken, and get both a stay-plan and an exit strategy.",
    duration: "5 min",
    questions: 10,
    color: "amber",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
];

/* # Color map for dynamic Tailwind classes */
const colorMap: Record<string, { bg: string; border: string; text: string; hoverBorder: string }> = {
  indigo: { bg: "bg-brand-indigo/10", border: "border-brand-indigo/20", text: "text-brand-light", hoverBorder: "hover:border-brand-indigo/40" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", hoverBorder: "hover:border-purple-500/40" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", hoverBorder: "hover:border-amber-500/40" },
};

export default function CareerQuizzesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* # Page Header */}
      <div className="mb-10">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold glow-text-strong mb-3">
          Career Quizzes & Assessments
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Take a quiz, get personalized AI-powered insights. Each assessment
          analyzes your answers and delivers a tailored career report in under
          60 seconds.
        </p>
      </div>

      {/* # Quiz Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const c = colorMap[quiz.color];
          return (
            <Link
              key={quiz.href}
              href={quiz.href}
              className={`glass-card p-6 flex flex-col gap-4 transition-all ${c.hoverBorder} hover:shadow-lg group`}
            >
              {/* # Icon */}
              <div className={`w-14 h-14 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text}`}>
                {quiz.icon}
              </div>

              {/* # Title & Subtitle */}
              <div>
                <h2 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors">
                  {quiz.title}
                </h2>
                <p className="text-sm text-text-muted mt-0.5">{quiz.subtitle}</p>
              </div>

              {/* # Description */}
              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                {quiz.description}
              </p>

              {/* # Meta */}
              <div className="flex items-center gap-4 pt-2 border-t border-card-border/50">
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.duration}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.questions} questions
                </span>
              </div>

              {/* # CTA */}
              <div className={`text-sm font-medium ${c.text} group-hover:underline`}>
                Take the Quiz →
              </div>
            </Link>
          );
        })}
      </div>

      {/* # How It Works */}
      <div className="mt-12 glass-card p-8">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Answer Questions", desc: "Each quiz presents carefully designed questions about your career, work style, and goals." },
            { step: "2", title: "AI Analyzes Your Answers", desc: "Our AI reviews your specific responses as a whole — finding patterns, identifying strengths, and spotting opportunities." },
            { step: "3", title: "Get Personalized Insights", desc: "Receive a detailed, personalized report with scores, career matches, and actionable next steps." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center">
                <span className="text-brand-light font-bold text-sm">{s.step}</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
