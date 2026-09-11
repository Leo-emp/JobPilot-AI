/* ============================================================
   QUIZ SHELL — Reusable Multi-Step Quiz Component
   ============================================================
   # Handles the quiz flow: progress bar, question navigation,
   # answer collection, and AI result display. Used by all 3
   # career quizzes for a consistent experience.
   ============================================================ */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAIStream } from "@/hooks/useAIStream";
import MarkdownResult from "@/components/MarkdownResult";
import UpgradePrompt from "@/components/UpgradePrompt";

/* ---- Types ---- */
export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "text";
  options?: QuizOption[];
  placeholder?: string;
}

/* # Next-step CTA shown after quiz results */
export interface QuizNextStep {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface QuizShellProps {
  title: string;
  subtitle: string;
  accentColor: "indigo" | "purple" | "amber";
  questions: QuizQuestion[];
  aiAction: string;
  fileName: string;
  nextSteps?: QuizNextStep[];
}

/* # Color token maps for the 3 quiz accent colors */
const accents = {
  indigo: {
    bg: "bg-brand-indigo/10",
    border: "border-brand-indigo/30",
    text: "text-brand-light",
    progressBg: "bg-brand-indigo/20",
    progressBar: "bg-brand-indigo",
    btnPrimary: "bg-brand-indigo hover:bg-brand-indigo/80",
    selectedBg: "bg-brand-indigo/15",
    selectedBorder: "border-brand-indigo/40",
    selectedRing: "ring-brand-indigo/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    progressBg: "bg-purple-500/20",
    progressBar: "bg-purple-500",
    btnPrimary: "bg-purple-600 hover:bg-purple-500",
    selectedBg: "bg-purple-500/15",
    selectedBorder: "border-purple-500/40",
    selectedRing: "ring-purple-500/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    progressBg: "bg-amber-500/20",
    progressBar: "bg-amber-500",
    btnPrimary: "bg-amber-600 hover:bg-amber-500",
    selectedBg: "bg-amber-500/15",
    selectedBorder: "border-amber-500/40",
    selectedRing: "ring-amber-500/30",
  },
};

export default function QuizShell({ title, subtitle, accentColor, questions, aiAction, fileName, nextSteps }: QuizShellProps) {
  /* # State: current question index, answers map, quiz phase */
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"quiz" | "results">("quiz");
  const { result, loading, streaming, error, plan, remaining, callAI, reset } = useAIStream();
  const c = accents[accentColor];
  const q = questions[current];
  const total = questions.length;
  const progress = ((current + 1) / total) * 100;

  /* # Save answer and advance */
  const selectAnswer = useCallback((value: string) => {
    const qText = questions[current].question;
    setAnswers((prev) => ({ ...prev, [qText]: value }));

    /* Auto-advance for single-choice questions */
    if (questions[current].type === "single") {
      if (current < total - 1) {
        setTimeout(() => setCurrent((c) => c + 1), 300);
      }
    }
  }, [current, questions, total]);

  /* # Handle text input changes */
  const handleTextChange = (value: string) => {
    const qText = questions[current].question;
    setAnswers((prev) => ({ ...prev, [qText]: value }));
  };

  /* # Submit quiz — send answers to AI */
  const submitQuiz = async () => {
    setPhase("results");
    await callAI(aiAction, { answers });
  };

  /* # Restart quiz */
  const restartQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setPhase("quiz");
    reset();
  };

  /* # Check if current question has been answered */
  const currentAnswer = answers[q?.question] || "";
  const canProceed = currentAnswer.trim().length > 0;
  const isLastQuestion = current === total - 1;

  /* ============================================================
     RESULTS VIEW — AI-generated personalized insights
     ============================================================ */
  if (phase === "results") {
    return (
      <div className="max-w-4xl mx-auto">
        {/* # Header */}
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold glow-text-strong mb-2">
            {title} — Your Results
          </h1>
          <p className="text-text-secondary">
            Personalized insights based on your {total} answers
          </p>
        </div>

        {/* # Loading State */}
        {loading && !result && (
          <div className="glass-card p-10 text-center">
            <div className="inline-flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-brand-light" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-text-secondary">Analyzing your answers...</span>
            </div>
          </div>
        )}

        {/* # Error State */}
        {error && (
          <div className="glass-card p-6 border-red-500/30 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={restartQuiz} className="mt-3 text-sm text-brand-light hover:underline">
              Try Again
            </button>
          </div>
        )}

        {/* # AI Result */}
        {result && (
          <MarkdownResult result={result} fileName={fileName} />
        )}

        {/* # Actions after results */}
        {result && !loading && !streaming && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={restartQuiz} className="px-6 py-2.5 rounded-xl text-sm font-medium border border-card-border text-text-secondary hover:text-white hover:border-white/30 transition-colors">
              Retake Quiz
            </button>
          </div>
        )}

        {/* # Next Steps — CTA cards linking to other tools */}
        {result && !loading && !streaming && nextSteps && nextSteps.length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold mb-4">
              Your Next Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nextSteps.map((step) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="glass-card p-5 flex items-start gap-4 hover:border-brand-indigo/40 transition-all group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-light">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-brand-light transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* # AI usage */}
        <div className="mt-6">
          {remaining !== null && <UpgradePrompt plan={plan} remaining={remaining} />}
        </div>
      </div>
    );
  }

  /* ============================================================
     QUIZ VIEW — Multi-step question flow
     ============================================================ */
  return (
    <div className="max-w-3xl mx-auto">
      {/* # Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold glow-text-strong mb-2">
          {title}
        </h1>
        <p className="text-text-secondary">{subtitle}</p>
      </div>

      {/* # Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Question {current + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={`h-2 rounded-full ${c.progressBg}`}>
          <div
            className={`h-full rounded-full ${c.progressBar} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* # Question Card */}
      <div className="glass-card p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">{q.question}</h2>

        {/* # Single-choice options */}
        {q.type === "single" && q.options && (
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                    isSelected
                      ? `${c.selectedBg} ${c.selectedBorder} ${c.text} ring-2 ${c.selectedRing}`
                      : "border-card-border text-text-secondary hover:border-white/20 hover:text-white hover:bg-space-600/50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* # Text input */}
        {q.type === "text" && (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={q.placeholder || "Type your answer..."}
            className="w-full h-32 bg-space-700 border border-card-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 outline-none resize-none"
          />
        )}
      </div>

      {/* # Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-medium border border-card-border text-text-secondary hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>

        <div className="flex gap-3">
          {/* # Question dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? c.progressBar : i < current && answers[questions[i].question] ? "bg-white/40" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={submitQuiz}
              disabled={!canProceed}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white ${c.btnPrimary} transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Get My Results
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
              disabled={!canProceed}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white ${c.btnPrimary} transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
