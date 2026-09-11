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
    question: "How long have you been in your current career field?",
    type: "single",
    options: [
      { label: "Less than 2 years — I'm still early in my career", value: "early_career" },
      { label: "2-5 years — I have solid experience", value: "mid_early" },
      { label: "5-10 years — I'm well-established", value: "mid_career" },
      { label: "10-15 years — I'm senior in my field", value: "senior" },
      { label: "15+ years — I've built a long career here", value: "veteran" },
    ],
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
    type: "single",
    options: [
      { label: "Creating or designing something (presentation, document, visual)", value: "creating_designing" },
      { label: "Solving a complex problem or puzzle (data, logic, strategy)", value: "problem_solving" },
      { label: "Teaching, mentoring, or helping someone", value: "helping_teaching" },
      { label: "Building or making something from scratch (code, product, project)", value: "building" },
      { label: "Organizing, planning, or streamlining a process", value: "organizing" },
      { label: "Researching, investigating, or learning something new", value: "researching" },
    ],
  },
  {
    id: "childhood_interests",
    question: "What did you love doing as a child or teenager that you've stopped doing?",
    type: "single",
    options: [
      { label: "Drawing, painting, or making art", value: "art_creative" },
      { label: "Writing stories, poems, or journals", value: "writing" },
      { label: "Taking things apart, building, or fixing stuff", value: "tinkering" },
      { label: "Organizing events, leading groups, or teaching friends", value: "leading_organizing" },
      { label: "Playing music, performing, or being on stage", value: "performing" },
      { label: "Exploring nature, science experiments, or researching topics", value: "exploring_science" },
    ],
  },
  {
    id: "compliments",
    question: "What do people compliment you on most often — at work and outside work?",
    type: "single",
    options: [
      { label: "Explaining complex things in simple terms", value: "explaining" },
      { label: "Staying calm under pressure and solving crises", value: "calm_crisis" },
      { label: "Coming up with creative ideas and solutions", value: "creative_ideas" },
      { label: "Organizing chaos and making things run smoothly", value: "organizing" },
      { label: "Connecting with people and building relationships", value: "people_skills" },
      { label: "Attention to detail and producing high-quality work", value: "quality_detail" },
    ],
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
    type: "single",
    options: [
      { label: "Something creative — design, music, writing, film, photography", value: "creative_arts" },
      { label: "Something technical — AI, engineering, data science, coding", value: "technical" },
      { label: "Something entrepreneurial — start a business, freelance, build a brand", value: "entrepreneurial" },
      { label: "Something helping people — counselling, coaching, healthcare, teaching", value: "helping" },
      { label: "Something outdoors or physical — travel, fitness, nature, trades", value: "outdoors_physical" },
      { label: "Something in business — consulting, investing, strategy, leadership", value: "business" },
    ],
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
    question: "Which skill category best describes your strongest abilities?",
    type: "single",
    options: [
      { label: "Technical — coding, data analysis, engineering, IT systems", value: "technical" },
      { label: "Communication — writing, presenting, negotiating, persuading", value: "communication" },
      { label: "Creative — design, content creation, photography, video", value: "creative" },
      { label: "Analytical — research, strategy, problem-solving, financial modelling", value: "analytical" },
      { label: "People — leadership, coaching, team-building, sales", value: "people" },
      { label: "Operational — project management, logistics, process improvement", value: "operational" },
    ],
  },
  {
    id: "side_activities",
    question: "What do you do in your free time that you're genuinely good at?",
    type: "single",
    options: [
      { label: "Creating content — writing, video, social media, blogging", value: "content_creation" },
      { label: "Building things — coding side projects, DIY, crafts", value: "building" },
      { label: "Helping others — coaching friends, mentoring, volunteering", value: "helping" },
      { label: "Learning — reading, courses, researching new topics", value: "learning" },
      { label: "Fitness, sports, or outdoor activities", value: "fitness_outdoors" },
      { label: "Investing, trading, or managing finances", value: "finance" },
    ],
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
    question: "What's your biggest constraint or non-negotiable?",
    type: "single",
    options: [
      { label: "I need to maintain a minimum salary — can't take a big pay cut", value: "salary" },
      { label: "I can't relocate — location-bound due to family or commitments", value: "location" },
      { label: "I can't go back to school full-time — need to keep working", value: "no_full_time_study" },
      { label: "I need visa sponsorship — limits which employers I can work for", value: "visa" },
      { label: "I have dependents — can't take big financial risks", value: "dependents" },
      { label: "No major constraints — I'm flexible", value: "flexible" },
    ],
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
    question: "What best describes your current career level?",
    type: "single",
    options: [
      { label: "Entry level — 0-2 years of work experience", value: "entry" },
      { label: "Early career — 2-5 years, building expertise", value: "early" },
      { label: "Mid-career — 5-10 years, established professional", value: "mid" },
      { label: "Senior — 10-15 years, deep expertise or management", value: "senior" },
      { label: "Executive/veteran — 15+ years, leadership roles", value: "executive" },
    ],
  },
  {
    id: "target_career",
    question: "What field do you want to transition into?",
    type: "single",
    options: [
      { label: "Tech — software engineering, data science, UX/UI, product management", value: "tech" },
      { label: "Creative — design, content, marketing, media, writing", value: "creative" },
      { label: "Business — consulting, finance, strategy, entrepreneurship", value: "business" },
      { label: "Healthcare — nursing, therapy, public health, wellness", value: "healthcare" },
      { label: "Education — teaching, training, coaching, academic research", value: "education" },
      { label: "Trades & skilled work — real estate, construction, manufacturing", value: "trades" },
    ],
  },
  {
    id: "why_this_career",
    question: "What attracts you most about your target career?",
    type: "single",
    options: [
      { label: "The work itself — I'm genuinely passionate about what they do", value: "passion" },
      { label: "Better salary and financial growth potential", value: "money" },
      { label: "More flexibility, autonomy, or work-life balance", value: "lifestyle" },
      { label: "Greater impact — helping people or making a difference", value: "impact" },
      { label: "Stronger job market — more opportunities and job security", value: "market_demand" },
      { label: "Personal growth — I want to challenge myself in a new way", value: "growth" },
    ],
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
    question: "How much overlap do your current skills have with your target career?",
    type: "single",
    options: [
      { label: "Very little — it's a completely different field", value: "minimal_overlap" },
      { label: "Some soft skills transfer — communication, leadership, problem-solving", value: "soft_skills" },
      { label: "Moderate — several technical and soft skills carry over", value: "moderate_overlap" },
      { label: "Significant — I already have many of the core skills needed", value: "significant_overlap" },
      { label: "Almost everything — I mainly need the title and industry experience", value: "high_overlap" },
    ],
  },
  {
    id: "missing_skills",
    question: "What's the biggest skill or qualification gap you need to close?",
    type: "single",
    options: [
      { label: "A specific degree or formal qualification", value: "degree" },
      { label: "Technical/hard skills (coding, tools, certifications)", value: "technical_skills" },
      { label: "A portfolio or proof of work in the new field", value: "portfolio" },
      { label: "Industry experience or domain knowledge", value: "industry_experience" },
      { label: "Professional network and connections in the field", value: "network" },
      { label: "I'm not sure what I'm missing — that's part of the problem", value: "unsure" },
    ],
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
    question: "What have you already done to prepare for this transition?",
    type: "single",
    options: [
      { label: "Nothing yet — I'm still in the thinking stage", value: "nothing" },
      { label: "Research only — read articles, watched videos, browsed job posts", value: "research" },
      { label: "Started learning — taken online courses or self-study", value: "learning" },
      { label: "Built something — portfolio projects, freelance work, or side projects", value: "built_portfolio" },
      { label: "Networked — talked to people in the field, attended events", value: "networked" },
      { label: "Multiple steps — courses + portfolio + networking", value: "multiple" },
    ],
  },
  {
    id: "obstacles",
    question: "What's the single biggest obstacle standing between you and this career?",
    type: "single",
    options: [
      { label: "I don't have the required education or credentials", value: "education" },
      { label: "Financial risk — my family depends on my current income", value: "financial" },
      { label: "Lack of hands-on experience in the new field", value: "experience" },
      { label: "I don't know where or how to start", value: "direction" },
      { label: "Fear of failure or starting over at the bottom", value: "fear" },
      { label: "Age or timing — I feel like it might be too late", value: "timing" },
    ],
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
