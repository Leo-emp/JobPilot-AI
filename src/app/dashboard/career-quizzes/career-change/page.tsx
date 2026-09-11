/* ============================================================
   CAREER CHANGE QUIZ — Dashboard Page (2 Routes)
   ============================================================
   # Route 1 — Discovery: User doesn't know what career to pursue.
   #   Uncovers hidden talents, interests, transferable skills,
   #   matches with fitting careers + action roadmap.
   # Route 2 — Transition: User has a target career in mind.
   #   Evaluates readiness, identifies gaps, provides personalized
   #   transition plan for that specific career.
   # 14 questions per route for deep personalization.
   ============================================================ */

"use client";

import { useState } from "react";
import QuizShell from "@/components/QuizShell";
import type { QuizQuestion, QuizNextStep } from "@/components/QuizShell";

/* ============================================================
   DISCOVERY ROUTE — 14 Questions
   # For users who don't know what career they want.
   ============================================================ */
const discoveryQuestions: QuizQuestion[] = [
  {
    id: "current_role",
    question: "What is your current role and how long have you been doing it?",
    type: "text",
    placeholder: "e.g. Marketing Manager at a fintech company, 5 years",
  },
  {
    id: "satisfaction",
    question: "How do you feel about your current career path?",
    type: "single",
    options: [
      { label: "It's fine but I feel there's something better out there for me", value: "exploring" },
      { label: "I've lost interest — I'm going through the motions", value: "disengaged" },
      { label: "I'm actively unhappy and need a change", value: "unhappy" },
      { label: "I'm burnt out — my health is suffering", value: "burnt_out" },
    ],
  },
  {
    id: "energizing_tasks",
    question: "Think about the last time you were completely absorbed in a task — what were you doing?",
    type: "text",
    placeholder: "e.g. designing a presentation, solving a data puzzle, mentoring a new hire, building something from scratch",
  },
  {
    id: "childhood_interests",
    question: "What did you love doing as a child or teenager that you've stopped doing?",
    type: "text",
    placeholder: "e.g. drawing, taking things apart, writing stories, organizing events, teaching friends",
  },
  {
    id: "compliments",
    question: "What do people compliment you on most often — at work and outside work?",
    type: "text",
    placeholder: "e.g. explaining complex things simply, staying calm under pressure, creative ideas, organizing chaos",
  },
  {
    id: "draining_tasks",
    question: "What type of work drains your energy the fastest?",
    type: "single",
    options: [
      { label: "Repetitive, routine tasks with no creativity", value: "repetition" },
      { label: "Managing people and office politics", value: "people_management" },
      { label: "Highly technical or analytical work", value: "technical" },
      { label: "Sales, pitching, or constant client-facing work", value: "sales_facing" },
      { label: "Working in isolation with no human interaction", value: "isolation" },
    ],
  },
  {
    id: "secret_interest",
    question: "If nobody would judge you, what career or field would you explore?",
    type: "text",
    placeholder: "e.g. music production, AI research, opening a cafe, wildlife photography, game design",
  },
  {
    id: "work_values",
    question: "Rank what matters most to you in work (pick the #1 priority):",
    type: "single",
    options: [
      { label: "High income and financial security", value: "money" },
      { label: "Freedom and flexibility (remote, own schedule)", value: "freedom" },
      { label: "Making a meaningful impact on people's lives", value: "impact" },
      { label: "Creative expression and building things", value: "creativity" },
      { label: "Intellectual challenge and continuous learning", value: "learning" },
      { label: "Status, prestige, and recognition", value: "status" },
    ],
  },
  {
    id: "skills_inventory",
    question: "List ALL your skills — technical, soft, and random talents (the more the better):",
    type: "text",
    placeholder: "e.g. Excel, public speaking, Python, cooking, photography, negotiation, writing, event planning, languages...",
  },
  {
    id: "side_activities",
    question: "What do you do in your free time that you're genuinely good at?",
    type: "text",
    placeholder: "e.g. content creation, coding side projects, coaching friends, DIY projects, investing, blogging",
  },
  {
    id: "environment_preference",
    question: "What's your ideal work environment?",
    type: "single",
    options: [
      { label: "Remote — working from anywhere, full autonomy", value: "remote" },
      { label: "Small startup — fast-paced, wear many hats", value: "startup" },
      { label: "Corporate — structure, benefits, clear career ladder", value: "corporate" },
      { label: "Freelance/self-employed — complete independence", value: "freelance" },
      { label: "Hands-on — outdoors, lab, studio, or workshop", value: "hands_on" },
    ],
  },
  {
    id: "financial_runway",
    question: "How long could you support yourself while transitioning?",
    type: "single",
    options: [
      { label: "I need to keep earning — zero gap between jobs", value: "zero_gap" },
      { label: "1-3 months of runway", value: "1_3_months" },
      { label: "3-6 months of savings", value: "3_6_months" },
      { label: "6-12 months — I've been preparing", value: "6_12_months" },
      { label: "12+ months — finances aren't the constraint", value: "12_plus" },
    ],
  },
  {
    id: "constraints",
    question: "What constraints or non-negotiables do you have?",
    type: "text",
    placeholder: "e.g. need minimum $80K salary, can't relocate, have kids, need visa sponsorship, can't go back to school full-time",
  },
  {
    id: "risk_tolerance",
    question: "How comfortable are you with uncertainty and risk?",
    type: "single",
    options: [
      { label: "Very low — I need a guaranteed path before I move", value: "very_low" },
      { label: "Low — I'll take a risk if I have a safety net", value: "low" },
      { label: "Moderate — I'll take calculated risks with clear upside", value: "moderate" },
      { label: "High — I'm comfortable figuring it out as I go", value: "high" },
      { label: "Very high — I'd rather fail trying than stay stuck", value: "very_high" },
    ],
  },
];

/* ============================================================
   TRANSITION ROUTE — 14 Questions
   # For users who already know their target career.
   ============================================================ */
const transitionQuestions: QuizQuestion[] = [
  {
    id: "current_role",
    question: "What is your current role, industry, and years of experience?",
    type: "text",
    placeholder: "e.g. Operations Manager in logistics, 7 years",
  },
  {
    id: "target_career",
    question: "What specific career or role do you want to transition into?",
    type: "text",
    placeholder: "e.g. UX Designer, Data Scientist, Product Manager, Nurse Practitioner, Real Estate Agent",
  },
  {
    id: "why_this_career",
    question: "Why this career specifically? What attracts you to it?",
    type: "text",
    placeholder: "e.g. I love designing user experiences, I want to work with data, I want to help patients directly",
  },
  {
    id: "research_done",
    question: "How much do you know about this career?",
    type: "single",
    options: [
      { label: "Very little — I'm attracted to it but haven't researched deeply", value: "minimal" },
      { label: "Some research — I've read articles and watched videos", value: "some_research" },
      { label: "Good understanding — I've talked to people in the field", value: "good_understanding" },
      { label: "Deep knowledge — I've done courses, projects, or freelance work in it", value: "deep_knowledge" },
    ],
  },
  {
    id: "relevant_skills",
    question: "What skills do you already have that are relevant to your target career?",
    type: "text",
    placeholder: "e.g. data analysis, design thinking, project management, coding basics, customer research",
  },
  {
    id: "missing_skills",
    question: "What skills or qualifications do you think you're missing?",
    type: "text",
    placeholder: "e.g. specific certification, programming language, portfolio, degree, industry experience",
  },
  {
    id: "education_willingness",
    question: "How willing are you to invest in education or training?",
    type: "single",
    options: [
      { label: "Not willing — I want to transition with what I already have", value: "none" },
      { label: "Self-study only — free or cheap online courses", value: "self_study" },
      { label: "Moderate investment — bootcamp or professional certificate ($1K-$5K)", value: "moderate" },
      { label: "Significant investment — degree program or intensive training ($5K-$20K)", value: "significant" },
      { label: "Whatever it takes — I'll invest heavily if the ROI is clear", value: "whatever_it_takes" },
    ],
  },
  {
    id: "network_in_field",
    question: "Do you know anyone who works in your target career?",
    type: "single",
    options: [
      { label: "No one — I have zero connections in the field", value: "none" },
      { label: "A few acquaintances — but no close connections", value: "few" },
      { label: "Some contacts — I could reach out for advice", value: "some" },
      { label: "Strong network — I have mentors or close contacts in the field", value: "strong" },
    ],
  },
  {
    id: "timeline",
    question: "What's your ideal timeline for making this transition?",
    type: "single",
    options: [
      { label: "ASAP — I want to be in the new career within 3 months", value: "asap" },
      { label: "6 months — I'm willing to prepare but want to move fast", value: "6_months" },
      { label: "1 year — I'll take the time to do it right", value: "1_year" },
      { label: "1-2 years — I'm planning a methodical transition", value: "1_2_years" },
      { label: "No rush — I'll transition when everything is ready", value: "no_rush" },
    ],
  },
  {
    id: "financial_situation",
    question: "How long could you support yourself during the transition?",
    type: "single",
    options: [
      { label: "I can't take any income gap — need to earn while transitioning", value: "zero_gap" },
      { label: "1-3 months of savings", value: "1_3_months" },
      { label: "3-6 months of runway", value: "3_6_months" },
      { label: "6-12 months — I've been saving for this", value: "6_12_months" },
      { label: "12+ months — finances aren't the bottleneck", value: "12_plus" },
    ],
  },
  {
    id: "salary_expectations",
    question: "What are your salary expectations for the new career?",
    type: "single",
    options: [
      { label: "I'd accept a significant pay cut (30%+) to get in", value: "significant_cut" },
      { label: "I'd accept a moderate pay cut (10-30%) initially", value: "moderate_cut" },
      { label: "I need at least the same salary from day one", value: "same_salary" },
      { label: "I expect this transition to increase my income", value: "increase" },
    ],
  },
  {
    id: "biggest_fear",
    question: "What's your biggest fear about making this transition?",
    type: "single",
    options: [
      { label: "Starting over — losing my seniority and credibility", value: "starting_over" },
      { label: "Financial risk — what if I can't earn enough?", value: "financial_risk" },
      { label: "Competence — what if I'm not good enough?", value: "competence" },
      { label: "Regret — what if the new career isn't what I expected?", value: "regret" },
      { label: "Age/timing — what if I'm too old or it's too late?", value: "timing" },
    ],
  },
  {
    id: "preparation_done",
    question: "What have you already done to prepare for this specific transition?",
    type: "text",
    placeholder: "e.g. completed a Coursera certificate, built 2 portfolio projects, talked to 5 people in the field, started freelancing",
  },
  {
    id: "obstacles",
    question: "What's the single biggest obstacle standing between you and this career?",
    type: "text",
    placeholder: "e.g. I don't have the required degree, my family depends on my salary, I lack hands-on experience, I don't know where to start",
  },
];

/* # Next steps for Discovery route — found careers, now take action */
const discoveryNextSteps: QuizNextStep[] = [
  {
    href: "/dashboard/career-quizzes/personality",
    title: "Take the Personality Test",
    description: "Go deeper — discover your work personality type and get matched with ideal careers.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/resume",
    title: "Optimize Your Resume",
    description: "Reframe your experience for your new target career with AI.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/linkedin",
    title: "Update Your LinkedIn",
    description: "Optimize your profile to attract opportunities in your new direction.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/jobs",
    title: "Search for Jobs",
    description: "Start exploring roles that match your newly discovered career direction.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

/* # Next steps for Transition route — has a target, now execute */
const transitionNextSteps: QuizNextStep[] = [
  {
    href: "/dashboard/resume",
    title: "Rebuild Your Resume",
    description: "Reframe your experience for your target career with AI-powered optimization.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/cover-letter",
    title: "Write a Cover Letter",
    description: "Craft a compelling career-changer cover letter that sells your transferable skills.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/interview",
    title: "Prepare for Interviews",
    description: "Practice answering 'Why are you switching careers?' and other transition questions.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/jobs",
    title: "Search for Jobs",
    description: "Find and apply to roles in your target career.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

/* ============================================================
   ROUTE SELECTOR + QUIZ RENDERER
   ============================================================ */
export default function CareerChangeQuizPage() {
  const [route, setRoute] = useState<"select" | "discovery" | "transition">("select");

  /* # Route Selection Screen */
  if (route === "select") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold glow-text-strong mb-3">
            Career Change Quiz
          </h1>
          <p className="text-text-secondary text-lg">
            Choose the path that matches where you are right now:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* # Discovery Route Card */}
          <button
            onClick={() => setRoute("discovery")}
            className="glass-card p-6 text-left hover:border-brand-indigo/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-brand-light transition-colors mb-2">
              Discover My Career
            </h2>
            <p className="text-sm text-text-muted mb-3">
              &ldquo;I don&apos;t know what career I want&rdquo;
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Uncover your hidden talents, latent interests, and transferable skills.
              Get matched with 7 career paths you may never have considered — plus
              a 90-day discovery-to-action roadmap.
            </p>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>14 questions</span>
              <span>~7 min</span>
            </div>
          </button>

          {/* # Transition Route Card */}
          <button
            onClick={() => setRoute("transition")}
            className="glass-card p-6 text-left hover:border-purple-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
              Plan My Transition
            </h2>
            <p className="text-sm text-text-muted mb-3">
              &ldquo;I know what career I want — how ready am I?&rdquo;
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Get a readiness score for your specific target career, a detailed
              skill gap analysis, credential check, and a personalized
              transition roadmap with timeline.
            </p>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>14 questions</span>
              <span>~7 min</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  /* # Discovery Route */
  if (route === "discovery") {
    return (
      <QuizShell
        title="Career Discovery"
        subtitle="Answer 14 questions to uncover your hidden talents, ideal careers, and a personalized action roadmap"
        accentColor="indigo"
        questions={discoveryQuestions}
        aiAction="career_change_discovery"
        fileName="career-discovery-jobpilot"
        nextSteps={discoveryNextSteps}
      />
    );
  }

  /* # Transition Route */
  return (
    <QuizShell
      title="Career Transition Readiness"
      subtitle="Answer 14 questions to evaluate your readiness and get a personalized transition plan"
      accentColor="purple"
      questions={transitionQuestions}
      aiAction="career_change_transition"
      fileName="career-transition-readiness-jobpilot"
      nextSteps={transitionNextSteps}
    />
  );
}
