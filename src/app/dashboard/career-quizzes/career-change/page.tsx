/* ============================================================
   CAREER CHANGE READINESS QUIZ — Dashboard Page
   ============================================================
   # 10-question assessment to evaluate readiness for a career
   # change. AI analyzes answers and provides a readiness score,
   # transferable strengths, career matches, and a 90-day plan.
   ============================================================ */

"use client";

import QuizShell from "@/components/QuizShell";
import type { QuizQuestion } from "@/components/QuizShell";

/* # 10 structured questions covering all readiness dimensions */
const questions: QuizQuestion[] = [
  {
    id: "satisfaction",
    question: "How satisfied are you with your current career?",
    type: "single",
    options: [
      { label: "Very satisfied — I just want to explore options", value: "very_satisfied" },
      { label: "Somewhat satisfied — a few things bother me", value: "somewhat_satisfied" },
      { label: "Neutral — I feel stuck but it's not terrible", value: "neutral" },
      { label: "Dissatisfied — I dread going to work most days", value: "dissatisfied" },
      { label: "Completely burnt out — I need to leave ASAP", value: "burnt_out" },
    ],
  },
  {
    id: "current_role",
    question: "What is your current role and industry?",
    type: "text",
    placeholder: "e.g. Marketing Manager in fintech, 5 years experience",
  },
  {
    id: "motivation",
    question: "What's driving you to consider a career change?",
    type: "single",
    options: [
      { label: "I want higher pay or better financial prospects", value: "financial" },
      { label: "I want more meaningful or impactful work", value: "purpose" },
      { label: "I want better work-life balance", value: "balance" },
      { label: "I've lost interest in my field — I want something new", value: "passion" },
      { label: "My industry is shrinking — I need to pivot before it's too late", value: "industry_risk" },
    ],
  },
  {
    id: "direction",
    question: "Do you have a specific career direction in mind?",
    type: "single",
    options: [
      { label: "Yes — I know exactly what I want to do next", value: "clear" },
      { label: "I have a general area but no specific role", value: "general_idea" },
      { label: "I have a few ideas but can't decide between them", value: "multiple_ideas" },
      { label: "No — I just know I want something different", value: "no_direction" },
    ],
  },
  {
    id: "skills",
    question: "What are the top 3-5 skills you're best at? (technical or soft skills)",
    type: "text",
    placeholder: "e.g. project management, data analysis, public speaking, Python, leadership",
  },
  {
    id: "financial_runway",
    question: "How long could you support yourself without a paycheck?",
    type: "single",
    options: [
      { label: "Less than 1 month — I live paycheck to paycheck", value: "less_1_month" },
      { label: "1-3 months — I have a small buffer", value: "1_3_months" },
      { label: "3-6 months — I've been saving", value: "3_6_months" },
      { label: "6-12 months — I have a solid emergency fund", value: "6_12_months" },
      { label: "12+ months — money isn't the issue", value: "12_plus_months" },
    ],
  },
  {
    id: "risk_tolerance",
    question: "How do you feel about taking risks?",
    type: "single",
    options: [
      { label: "I need stability — any risk terrifies me", value: "very_low" },
      { label: "I prefer safe bets with small risks", value: "low" },
      { label: "I'll take calculated risks if the upside is clear", value: "moderate" },
      { label: "I'm comfortable with uncertainty — I adapt well", value: "high" },
      { label: "I thrive in chaos — bring it on", value: "very_high" },
    ],
  },
  {
    id: "obligations",
    question: "What obligations or constraints do you need to consider?",
    type: "single",
    options: [
      { label: "Minimal — I'm single with few financial obligations", value: "minimal" },
      { label: "Some — I have rent/mortgage but no dependents", value: "some" },
      { label: "Moderate — I have a partner and/or kids to consider", value: "moderate" },
      { label: "Significant — I'm the primary earner for my family", value: "significant" },
      { label: "Complex — visa/immigration, caregiving, or other unique constraints", value: "complex" },
    ],
  },
  {
    id: "preparation",
    question: "What have you already done to prepare for a change?",
    type: "single",
    options: [
      { label: "Nothing yet — I'm just starting to think about it", value: "nothing" },
      { label: "I've done some research online", value: "research" },
      { label: "I've talked to people in other fields", value: "networking" },
      { label: "I've started building new skills or taking courses", value: "upskilling" },
      { label: "I've applied to jobs or started a side project", value: "actively_transitioning" },
    ],
  },
  {
    id: "values",
    question: "What matters most to you in your next career?",
    type: "text",
    placeholder: "e.g. remote work, creativity, helping others, high salary, autonomy, learning opportunities",
  },
];

export default function CareerChangeQuizPage() {
  return (
    <QuizShell
      title="Career Change Readiness"
      subtitle="Answer 10 questions to get your personalized career change readiness assessment"
      accentColor="indigo"
      questions={questions}
      aiAction="career_change_quiz"
      fileName="career-change-assessment-jobpilot"
    />
  );
}
