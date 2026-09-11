/* ============================================================
   STAY OR QUIT JOB ASSESSMENT — Dashboard Page
   ============================================================
   # 10-question assessment to help users decide whether to
   # stay at their current job or start planning to leave.
   # AI provides honest verdict, satisfaction breakdown, and
   # both a stay-plan and exit strategy.
   ============================================================ */

"use client";

import QuizShell from "@/components/QuizShell";
import type { QuizQuestion } from "@/components/QuizShell";

/* # 10 questions covering the 7 satisfaction dimensions:
   Growth, Compensation, Manager, Culture, WLB, Role, Future */
const questions: QuizQuestion[] = [
  {
    id: "overall",
    question: "How do you feel on a typical Sunday evening about going to work on Monday?",
    type: "single",
    options: [
      { label: "I look forward to it — I enjoy my work", value: "positive" },
      { label: "Neutral — it's fine, just a job", value: "neutral" },
      { label: "Mild dread — I don't want to but I manage", value: "mild_dread" },
      { label: "Significant anxiety — it's affecting my mood and health", value: "significant_dread" },
      { label: "Pure dread — I've cried, lost sleep, or had panic attacks over it", value: "severe" },
    ],
  },
  {
    id: "growth",
    question: "Are you learning and growing in your current role?",
    type: "single",
    options: [
      { label: "Yes — I'm constantly challenged and developing new skills", value: "strong_growth" },
      { label: "Somewhat — I learn occasionally but it's slowing down", value: "some_growth" },
      { label: "No — I've plateaued and there's no room to grow", value: "no_growth" },
      { label: "I'm actually going backwards — my skills are getting stale", value: "regressing" },
    ],
  },
  {
    id: "compensation",
    question: "How do you feel about your compensation?",
    type: "single",
    options: [
      { label: "I'm paid fairly — at or above market rate", value: "fair" },
      { label: "Slightly below market but the benefits/perks compensate", value: "slightly_below" },
      { label: "Underpaid — and I know it", value: "underpaid" },
      { label: "Significantly underpaid — it's a sore point", value: "significantly_underpaid" },
    ],
  },
  {
    id: "manager",
    question: "How would you describe your relationship with your manager?",
    type: "single",
    options: [
      { label: "Excellent — they support, mentor, and advocate for me", value: "excellent" },
      { label: "Good — professional and respectful", value: "good" },
      { label: "Tolerable — not great but not a dealbreaker", value: "tolerable" },
      { label: "Bad — they micromanage, ignore, or undermine me", value: "bad" },
      { label: "Toxic — they create a hostile work environment", value: "toxic" },
    ],
  },
  {
    id: "culture",
    question: "How well does the company culture align with your values?",
    type: "single",
    options: [
      { label: "Strong alignment — I believe in what we're doing", value: "strong_alignment" },
      { label: "Mostly aligned — a few things bother me", value: "mostly_aligned" },
      { label: "Misaligned — the culture doesn't match what they told me", value: "misaligned" },
      { label: "Actively clashing — the values here go against my own", value: "clashing" },
    ],
  },
  {
    id: "wlb",
    question: "How's your work-life balance?",
    type: "single",
    options: [
      { label: "Great — I have time for life outside work", value: "great" },
      { label: "Acceptable — some busy periods but generally balanced", value: "acceptable" },
      { label: "Poor — work regularly bleeds into personal time", value: "poor" },
      { label: "Non-existent — I'm always on, always stressed", value: "terrible" },
    ],
  },
  {
    id: "role_fit",
    question: "Does your daily work match what you were hired to do — and what you enjoy?",
    type: "single",
    options: [
      { label: "Yes — my role is exactly what I expected and I enjoy it", value: "perfect_fit" },
      { label: "Mostly — some tasks aren't ideal but the core work is good", value: "mostly_fit" },
      { label: "Drifted — my role has changed into something I didn't sign up for", value: "drifted" },
      { label: "Wrong fit — I don't enjoy the fundamental work anymore", value: "wrong_fit" },
    ],
  },
  {
    id: "future",
    question: "Where do you see yourself at this company in 2 years?",
    type: "single",
    options: [
      { label: "Promoted or in a more senior role — the path is clear", value: "clear_path" },
      { label: "Same role but still happy — no need to climb", value: "stable_happy" },
      { label: "Unclear — there's no obvious next step for me here", value: "unclear" },
      { label: "Gone — I can't see myself lasting that long", value: "gone" },
    ],
  },
  {
    id: "best_thing",
    question: "What's the single best thing about your current job?",
    type: "text",
    placeholder: "e.g. great team, flexible hours, interesting projects, good salary, short commute",
  },
  {
    id: "worst_thing",
    question: "What's the single worst thing — the one thing that, if fixed, would change everything?",
    type: "text",
    placeholder: "e.g. my manager, the salary, no growth, toxic culture, boring work, long hours",
  },
];

export default function StayOrQuitQuizPage() {
  return (
    <QuizShell
      title="Stay or Quit Assessment"
      subtitle="Answer 10 questions to get an honest, personalized recommendation"
      accentColor="amber"
      questions={questions}
      aiAction="stay_or_quit_quiz"
      fileName="stay-or-quit-assessment-jobpilot"
    />
  );
}
