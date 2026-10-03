/* ============================================================
   QUIZ BLOCK — Interactive Quiz Component
   ============================================================
   # Multiple choice quiz with instant feedback.
   # Features:
   #   - 4 options per question, click to answer
   #   - Instant correct/wrong feedback + explanation
   #   - End-of-quiz summary with score
   #   - Score saved to DB via API call
   #   - Retakeable (resets state)
   ============================================================ */

"use client";

import { useState, useCallback } from "react";

interface QuizQuestion {
  /* # The question text */
  question: string;
  /* # 4 answer options */
  options: string[];
  /* # Index of the correct answer (0-3) */
  correctIndex: number;
  /* # Explanation shown after answering */
  explanation: string;
}

interface QuizBlockProps {
  /* # Array of quiz questions */
  questions: QuizQuestion[];
  /* # Section ID for saving score to DB */
  sectionId: string;
  /* # Profession accent color */
  color: string;
}

export default function QuizBlock({ questions, sectionId, color }: QuizBlockProps) {
  /* # Track which question we're on */
  const [currentQ, setCurrentQ] = useState(0);
  /* # Track user's answers: index = question, value = chosen option index */
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  /* # Whether quiz is complete */
  const [finished, setFinished] = useState(false);
  /* # Whether the current question has been answered */
  const [answered, setAnswered] = useState(false);
  /* # Track save status */
  const [saved, setSaved] = useState(false);

  const question = questions[currentQ];
  const totalCorrect = answers.filter((a, i) => a === questions[i].correctIndex).length;

  /* # Handle selecting an answer */
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered) return; /* # Already answered this question */
      const newAnswers = [...answers];
      newAnswers[currentQ] = optionIndex;
      setAnswers(newAnswers);
      setAnswered(true);
    },
    [answered, answers, currentQ]
  );

  /* # Move to next question or finish */
  const handleNext = useCallback(async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswered(false);
    } else {
      setFinished(true);
      /* # Save score to DB */
      try {
        await fetch("/api/workshops/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId,
            quizScore: totalCorrect,
            quizAnswers: JSON.stringify(answers),
            completed: true,
          }),
        });
        setSaved(true);
      } catch {
        /* # Silently fail — score not critical */
      }
    }
  }, [currentQ, questions.length, sectionId, totalCorrect, answers]);

  /* # Retake quiz */
  const handleRetake = useCallback(() => {
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setFinished(false);
    setAnswered(false);
    setSaved(false);
  }, [questions.length]);

  /* # Quiz complete summary */
  if (finished) {
    const pct = Math.round((totalCorrect / questions.length) * 100);
    return (
      <div className="my-8 rounded-xl border border-card-border bg-black/30 overflow-hidden">
        <div
          className="px-6 py-3 border-b border-card-border"
          style={{ backgroundColor: `${color}10` }}
        >
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color }}>
            Quiz Complete
          </span>
        </div>
        <div className="p-8 text-center space-y-6">
          {/* # Score ring */}
          <div className="relative w-28 h-28 mx-auto">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-white/10" strokeWidth={6} />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{pct}%</span>
            </div>
          </div>

          <div>
            <p className="text-xl font-bold text-white">
              {totalCorrect} / {questions.length} correct
            </p>
            <p className="text-sm text-text-muted mt-1">
              {pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good effort, review the explanations below." : "Keep studying and try again!"}
            </p>
            {saved && <p className="text-xs text-text-muted mt-2">Score saved</p>}
          </div>

          {/* # Answer review */}
          <div className="text-left space-y-3 max-w-lg mx-auto">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`text-sm p-3 rounded-lg border ${correct ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <p className="text-text-secondary mb-1">
                    <span className={correct ? "text-emerald-400" : "text-red-400"}>
                      {correct ? "✓" : "✗"}
                    </span>{" "}
                    {q.question}
                  </p>
                  {!correct && (
                    <p className="text-xs text-text-muted">
                      Correct: {q.options[q.correctIndex]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* # Retake button */}
          <button
            onClick={handleRetake}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: `${color}40`, color }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  /* # Active quiz question */
  return (
    <div className="my-8 rounded-xl border border-card-border bg-black/30 overflow-hidden">
      {/* # Quiz header */}
      <div
        className="px-6 py-3 flex items-center justify-between border-b border-card-border"
        style={{ backgroundColor: `${color}10` }}
      >
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color }}>
          Quiz — Question {currentQ + 1} of {questions.length}
        </span>
        {/* # Progress dots */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  i < currentQ
                    ? answers[i] === questions[i].correctIndex
                      ? "#10b981" /* # Correct = green */
                      : "#ef4444" /* # Wrong = red */
                    : i === currentQ
                    ? color
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* # Question body */}
      <div className="p-6 space-y-5">
        <p className="text-base font-medium text-white leading-relaxed">{question.question}</p>

        {/* # Options */}
        <div className="space-y-2.5">
          {question.options.map((option, i) => {
            const selected = answers[currentQ] === i;
            const isCorrect = i === question.correctIndex;
            let optionStyle = "border-white/10 hover:border-white/25 text-text-secondary";

            if (answered) {
              if (isCorrect) {
                optionStyle = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
              } else if (selected && !isCorrect) {
                optionStyle = "border-red-500/40 bg-red-500/10 text-red-400";
              } else {
                optionStyle = "border-white/5 text-text-muted opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${optionStyle} ${
                  !answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="font-mono text-xs text-text-muted mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* # Feedback after answering */}
        {answered && (
          <div className="space-y-4">
            <div
              className={`text-sm p-4 rounded-lg border ${
                answers[currentQ] === question.correctIndex
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                  : "border-red-500/20 bg-red-500/5 text-red-300"
              }`}
            >
              <p className="font-semibold mb-1">
                {answers[currentQ] === question.correctIndex ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-text-secondary">{question.explanation}</p>
            </div>

            {/* # Next button */}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: color }}
            >
              {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
