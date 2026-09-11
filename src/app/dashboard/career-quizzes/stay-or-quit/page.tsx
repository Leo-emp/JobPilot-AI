/* ============================================================
   STAY OR QUIT JOB ASSESSMENT — Dashboard Page
   ============================================================
   # 14-question assessment covering all key factors:
   # 1. Work relationships & culture-fit (manager, team, culture)
   # 2. Work impact & satisfaction (purpose, role fit, daily feel)
   # 3. Growth & advancement opportunities (learning, future path)
   # 4. Career interest & compatibility (field vs job, passion)
   # Plus: compensation, WLB, financial readiness, duration,
   #        obligations, and the dealbreaker question.
   # AI provides honest verdict, satisfaction breakdown, and
   # both a stay-plan and exit strategy.
   ============================================================ */

"use client";

import QuizShell from "@/components/QuizShell";
import type { QuizQuestion } from "@/components/QuizShell";

const questions: QuizQuestion[] = [
  /* # 1 — Overall emotional baseline */
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
  /* # 2 — Duration signal: recent frustration vs chronic problem */
  {
    id: "duration",
    question: "How long have you been feeling this way about your job?",
    type: "single",
    options: [
      { label: "Less than a month — something recent triggered it", value: "less_1_month" },
      { label: "1-3 months — it's been building", value: "1_3_months" },
      { label: "3-6 months — it's a consistent pattern now", value: "3_6_months" },
      { label: "6-12 months — I've been unhappy for a while", value: "6_12_months" },
      { label: "Over a year — I've been enduring this for too long", value: "over_1_year" },
    ],
  },
  /* # 3 — Work impact & satisfaction: does your work matter? */
  {
    id: "impact",
    question: "Do you feel your work has meaning and makes a real impact?",
    type: "single",
    options: [
      { label: "Yes — I see the direct impact of what I do and it matters", value: "strong_impact" },
      { label: "Sometimes — some projects feel meaningful, others feel pointless", value: "mixed" },
      { label: "Rarely — most of what I do feels like busywork", value: "rarely" },
      { label: "Never — I feel like a cog in a machine, my work doesn't matter", value: "no_impact" },
    ],
  },
  /* # 4 — Growth & advancement */
  {
    id: "growth",
    question: "Are you learning and growing in your current role?",
    type: "single",
    options: [
      { label: "Yes — I'm constantly challenged and developing new skills", value: "strong_growth" },
      { label: "Somewhat — I learn occasionally but it's slowing down", value: "some_growth" },
      { label: "No — I've plateaued and there's no room to grow", value: "no_growth" },
      { label: "I'm going backwards — my skills are getting stale", value: "regressing" },
    ],
  },
  /* # 5 — Advancement path */
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
  /* # 6 — Manager relationship */
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
  /* # 7 — Team & coworker relationships */
  {
    id: "team",
    question: "How are your relationships with your team and coworkers?",
    type: "single",
    options: [
      { label: "Great — I genuinely like and respect the people I work with", value: "great" },
      { label: "Good — professional and friendly, a few close connections", value: "good" },
      { label: "Neutral — we get along but I wouldn't miss them", value: "neutral" },
      { label: "Strained — there's tension, cliques, or people I actively avoid", value: "strained" },
      { label: "Toxic — backstabbing, bullying, or a hostile team dynamic", value: "toxic" },
    ],
  },
  /* # 8 — Culture & values alignment */
  {
    id: "culture",
    question: "How well does the company culture align with your values?",
    type: "single",
    options: [
      { label: "Strong alignment — I believe in what we're doing and how we do it", value: "strong_alignment" },
      { label: "Mostly aligned — a few things bother me but nothing major", value: "mostly_aligned" },
      { label: "Misaligned — the culture doesn't match what they told me in interviews", value: "misaligned" },
      { label: "Actively clashing — the values here go against my own", value: "clashing" },
    ],
  },
  /* # 9 — Career interest & compatibility: is it the JOB or the CAREER? */
  {
    id: "career_interest",
    question: "Are you still genuinely interested in your field/industry — or is the career itself the problem?",
    type: "single",
    options: [
      { label: "I love my field — it's this specific job/company that's the problem", value: "love_field" },
      { label: "I'm still interested but my enthusiasm has faded over time", value: "fading" },
      { label: "I'm not sure anymore — maybe I've outgrown this entire career", value: "unsure" },
      { label: "I've lost interest in the field entirely — I want something completely different", value: "lost_interest" },
    ],
  },
  /* # 10 — Compensation */
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
  /* # 11 — Work-life balance */
  {
    id: "wlb",
    question: "How's your work-life balance?",
    type: "single",
    options: [
      { label: "Great — I have time and energy for life outside work", value: "great" },
      { label: "Acceptable — some busy periods but generally balanced", value: "acceptable" },
      { label: "Poor — work regularly bleeds into personal time", value: "poor" },
      { label: "Non-existent — I'm always on, always stressed, it's affecting my health", value: "terrible" },
    ],
  },
  /* # 12 — Financial readiness */
  {
    id: "financial_runway",
    question: "If you decided to leave, how long could you support yourself without a paycheck?",
    type: "single",
    options: [
      { label: "I can't — I'd need another job lined up before giving notice", value: "zero" },
      { label: "1-2 months of savings", value: "1_2_months" },
      { label: "3-6 months of runway", value: "3_6_months" },
      { label: "6-12 months — I've been saving", value: "6_12_months" },
      { label: "12+ months — finances aren't the constraint", value: "12_plus" },
    ],
  },
  /* # 13 — Job search readiness: have they already started looking? */
  {
    id: "search_readiness",
    question: "Have you already started looking for other opportunities?",
    type: "single",
    options: [
      { label: "No — I'm just thinking about it, haven't taken any action", value: "just_thinking" },
      { label: "Passively — I browse job boards occasionally but haven't applied", value: "passive" },
      { label: "Actively — I've updated my resume and started applying", value: "active" },
      { label: "Advanced — I've had interviews or received offers", value: "advanced" },
    ],
  },
  /* # 14 — Best thing (what they'd lose) */
  {
    id: "best_thing",
    question: "What's the single best thing about your current job — the thing that makes you hesitate to leave?",
    type: "text",
    placeholder: "e.g. great team, flexible hours, interesting projects, good salary, short commute, job security, benefits",
  },
  /* # 15 — Dealbreaker (the core issue) */
  {
    id: "worst_thing",
    question: "What's the single worst thing — the one thing that, if fixed, would change everything?",
    type: "text",
    placeholder: "e.g. my manager, the salary, no growth path, toxic culture, boring work, long hours, no remote option",
  },
];

export default function StayOrQuitQuizPage() {
  return (
    <QuizShell
      title="Stay or Quit Assessment"
      subtitle="Answer 15 questions to get an honest, personalized recommendation"
      accentColor="amber"
      questions={questions}
      aiAction="stay_or_quit_quiz"
      fileName="stay-or-quit-assessment-jobpilot"
    />
  );
}
