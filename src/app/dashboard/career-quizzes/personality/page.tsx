/* ============================================================
   CAREER PERSONALITY TEST — Dashboard Page
   ============================================================
   # 12-question personality assessment to determine work style
   # and ideal career matches. AI analyzes patterns across 6
   # dimensions and returns a personality profile with 5 career
   # matches, careers to avoid, and hidden strengths.
   ============================================================ */

"use client";

import QuizShell from "@/components/QuizShell";
import type { QuizQuestion, QuizNextStep } from "@/components/QuizShell";

/* # 12 questions mapping to the 6 work-style dimensions:
   Environment, Thinking, Pace, Motivation, Role, Focus */
const questions: QuizQuestion[] = [
  {
    id: "energy",
    question: "What energizes you at work?",
    type: "single",
    options: [
      { label: "Brainstorming and collaborating with a team", value: "team_collaboration" },
      { label: "Deep, focused work on my own", value: "solo_focus" },
      { label: "A mix — teamwork for ideas, solo time for execution", value: "hybrid" },
      { label: "Presenting to or teaching others", value: "teaching" },
    ],
  },
  {
    id: "problem_solving",
    question: "How do you prefer to solve problems?",
    type: "single",
    options: [
      { label: "Analyze data, find patterns, build a logical argument", value: "analytical" },
      { label: "Brainstorm creative ideas, try unconventional approaches", value: "creative" },
      { label: "Talk it through with others and find consensus", value: "collaborative" },
      { label: "Jump in and iterate — learn by doing, not planning", value: "action_oriented" },
    ],
  },
  {
    id: "ideal_day",
    question: "Describe your ideal work day:",
    type: "single",
    options: [
      { label: "Structured with clear tasks and deadlines", value: "structured" },
      { label: "Flexible — I decide what to work on and when", value: "flexible" },
      { label: "Fast-paced with lots of variety and surprises", value: "fast_paced" },
      { label: "Calm and methodical — deep work on one thing", value: "calm_methodical" },
    ],
  },
  {
    id: "success_definition",
    question: "What does career success look like to you?",
    type: "single",
    options: [
      { label: "High income and financial freedom", value: "financial" },
      { label: "Making a meaningful impact on others or society", value: "impact" },
      { label: "Becoming a recognized expert in my field", value: "mastery" },
      { label: "Freedom and autonomy — being my own boss", value: "autonomy" },
      { label: "Stability and work-life balance", value: "balance" },
    ],
  },
  {
    id: "stress_response",
    question: "How do you handle pressure and tight deadlines?",
    type: "single",
    options: [
      { label: "I thrive under pressure — it sharpens my focus", value: "thrive" },
      { label: "I handle it fine with good planning and priorities", value: "manageable" },
      { label: "I can push through but it drains me", value: "tolerate" },
      { label: "I strongly prefer predictable workloads", value: "avoid" },
    ],
  },
  {
    id: "learning_style",
    question: "How do you prefer to learn new things?",
    type: "single",
    options: [
      { label: "Read, study, and understand the theory first", value: "theoretical" },
      { label: "Hands-on — build something and figure it out as I go", value: "hands_on" },
      { label: "Watch others do it, then try it myself", value: "observational" },
      { label: "Discuss with experts and ask lots of questions", value: "social" },
    ],
  },
  {
    id: "leadership",
    question: "What's your preferred role on a team?",
    type: "single",
    options: [
      { label: "The leader — I set direction and make decisions", value: "leader" },
      { label: "The specialist — I go deep on my area of expertise", value: "specialist" },
      { label: "The connector — I bring people together and communicate", value: "connector" },
      { label: "The creator — I design and build things", value: "creator" },
      { label: "The optimizer — I improve processes and systems", value: "optimizer" },
    ],
  },
  {
    id: "draining",
    question: "What drains you the most at work?",
    type: "single",
    options: [
      { label: "Repetitive tasks with no variety", value: "repetition" },
      { label: "Constant meetings and interruptions", value: "meetings" },
      { label: "Working in isolation with no collaboration", value: "isolation" },
      { label: "Unclear goals and shifting priorities", value: "ambiguity" },
      { label: "Office politics and conflict", value: "politics" },
    ],
  },
  {
    id: "interests",
    question: "Which activities do you naturally gravitate toward? (pick the closest)",
    type: "single",
    options: [
      { label: "Building, coding, engineering, or making things", value: "building" },
      { label: "Analyzing, researching, or investigating", value: "analyzing" },
      { label: "Designing, writing, or creating content", value: "creating" },
      { label: "Selling, persuading, or negotiating", value: "persuading" },
      { label: "Organizing, planning, or managing", value: "managing" },
      { label: "Helping, teaching, or mentoring", value: "helping" },
    ],
  },
  {
    id: "work_environment",
    question: "What's your ideal work environment?",
    type: "single",
    options: [
      { label: "Remote — I work best from home or anywhere", value: "remote" },
      { label: "Office — I like the structure and social energy", value: "office" },
      { label: "Hybrid — a few days in, a few days remote", value: "hybrid" },
      { label: "On-the-go — outdoors, traveling, or in the field", value: "field" },
    ],
  },
  {
    id: "strengths",
    question: "What do colleagues most often come to you for help with?",
    type: "single",
    options: [
      { label: "Explaining complex things in simple terms", value: "explaining" },
      { label: "Fixing technical problems or troubleshooting", value: "technical_fixing" },
      { label: "Coming up with creative ideas or fresh perspectives", value: "creative_ideas" },
      { label: "Organizing projects, plans, or priorities", value: "organizing" },
      { label: "Navigating people issues, conflicts, or communication", value: "people_issues" },
      { label: "Making decisions or giving strategic advice", value: "strategic_advice" },
    ],
  },
  {
    id: "dream_impact",
    question: "If money and qualifications weren't an issue, what kind of work would you do?",
    type: "single",
    options: [
      { label: "Design or build products that people use every day", value: "design_build" },
      { label: "Teach, mentor, or coach others to succeed", value: "teach_mentor" },
      { label: "Start and grow my own business or brand", value: "entrepreneurship" },
      { label: "Write, create content, or tell stories", value: "create_content" },
      { label: "Work with technology, data, or scientific research", value: "tech_research" },
      { label: "Travel, explore, or work outdoors in nature", value: "explore_nature" },
    ],
  },
];

/* # Next steps after personality results */
const nextSteps: QuizNextStep[] = [
  {
    href: "/dashboard/career-quizzes/career-change",
    title: "Plan Your Career Change",
    description: "Found a match? Evaluate your readiness and get a personalized transition plan.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/resume",
    title: "Optimize Your Resume",
    description: "Align your resume with your personality strengths and target career.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/jobs",
    title: "Search for Matching Jobs",
    description: "Find roles that match your work personality and career matches.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/linkedin",
    title: "Update Your LinkedIn",
    description: "Showcase your strengths and attract roles that fit your personality.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4" />
      </svg>
    ),
  },
];

export default function CareerPersonalityQuizPage() {
  return (
    <QuizShell
      title="Career Personality Test"
      subtitle="Answer 12 questions to discover your work personality type and ideal career matches"
      accentColor="purple"
      questions={questions}
      aiAction="career_personality_quiz"
      fileName="career-personality-test-jobpilot"
      nextSteps={nextSteps}
    />
  );
}
