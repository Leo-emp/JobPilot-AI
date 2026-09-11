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
import type { QuizQuestion } from "@/components/QuizShell";

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
    type: "text",
    placeholder: "e.g. explaining complex things simply, fixing technical problems, creative ideas, organizing projects",
  },
  {
    id: "dream_impact",
    question: "If money and qualifications weren't an issue, what kind of work would you do?",
    type: "text",
    placeholder: "e.g. design products, teach kids, start a business, build technology, write, explore nature",
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
    />
  );
}
