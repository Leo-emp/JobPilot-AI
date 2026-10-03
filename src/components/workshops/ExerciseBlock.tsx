/* ============================================================
   EXERCISE BLOCK — Interactive Exercise Component
   ============================================================
   # Renders coding/non-coding exercises with:
   #   - Problem statement + constraints
   #   - Input/output examples (for coding)
   #   - Progressive hints (3, each behind a click)
   #   - Collapsible solution with brute force + optimal
   # Used inside workshop section pages.
   ============================================================ */

"use client";

import { useState } from "react";

interface ExerciseHint {
  /* # Each hint is a progressive clue */
  text: string;
}

interface ExerciseSolution {
  /* # Approach name, e.g. "Brute Force" or "Optimal" */
  approach: string;
  /* # Code solution */
  code: string;
  /* # Language for syntax label */
  language?: string;
  /* # Time/space complexity */
  complexity?: string;
  /* # Explanation of the approach */
  explanation: string;
}

interface ExerciseBlockProps {
  /* # Exercise number within the section */
  number: number;
  /* # Total exercises in the section */
  total: number;
  /* # Exercise title */
  title: string;
  /* # Problem description (markdown-ish text) */
  problem: string;
  /* # Constraints list */
  constraints?: string[];
  /* # Input/output examples for coding exercises */
  examples?: { input: string; output: string; explanation?: string }[];
  /* # Progressive hints */
  hints?: ExerciseHint[];
  /* # One or more solution approaches */
  solutions?: ExerciseSolution[];
  /* # Why interviewers ask this */
  interviewContext?: string;
  /* # Similar problems to practice */
  similarProblems?: string[];
  /* # Difficulty level */
  difficulty?: "beginner" | "intermediate" | "advanced";
  /* # Profession accent color */
  color: string;
}

export default function ExerciseBlock({
  number,
  total,
  title,
  problem,
  constraints,
  examples,
  hints,
  solutions,
  interviewContext,
  similarProblems,
  difficulty,
  color,
}: ExerciseBlockProps) {
  /* # Track which hints have been revealed */
  const [revealedHints, setRevealedHints] = useState(0);
  /* # Track if solution is shown */
  const [showSolution, setShowSolution] = useState(false);

  /* # Difficulty badge styles */
  const diffBadge: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="my-8 rounded-xl border border-card-border bg-black/30 overflow-hidden">
      {/* # Exercise header bar */}
      <div
        className="px-6 py-3 flex items-center justify-between border-b border-card-border"
        style={{ backgroundColor: `${color}10` }}
      >
        <div className="flex items-center gap-3">
          {/* # Exercise icon */}
          <svg className="w-5 h-5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color }}>
            Exercise {number} of {total}
          </span>
        </div>
        {difficulty && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${diffBadge[difficulty] || ""}`}>
            {difficulty}
          </span>
        )}
      </div>

      {/* # Exercise body */}
      <div className="p-6 space-y-5">
        {/* # Title */}
        <h4 className="text-lg font-bold text-white font-[family-name:var(--font-space-grotesk)]">
          {title}
        </h4>

        {/* # Problem statement */}
        <p className="text-text-secondary leading-relaxed">{problem}</p>

        {/* # Constraints */}
        {constraints && constraints.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-white mb-2">Constraints:</p>
            <ul className="space-y-1 pl-5 list-disc">
              {constraints.map((c, i) => (
                <li key={i} className="text-sm text-text-muted">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* # Input/Output examples */}
        {examples && examples.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Examples:</p>
            {examples.map((ex, i) => (
              <div key={i} className="bg-black/30 rounded-lg p-4 border border-card-border/50">
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <span className="text-text-muted text-xs block mb-1">Input:</span>
                    <pre className="text-gray-300 whitespace-pre-wrap">{ex.input}</pre>
                  </div>
                  <div>
                    <span className="text-text-muted text-xs block mb-1">Output:</span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{ex.output}</pre>
                  </div>
                </div>
                {ex.explanation && (
                  <p className="text-xs text-text-muted mt-2 border-t border-card-border/30 pt-2">
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* # Progressive hints */}
        {hints && hints.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">Hints:</p>
            {hints.map((hint, i) => (
              <div key={i}>
                {i < revealedHints ? (
                  /* # Revealed hint */
                  <div className="flex items-start gap-3 text-sm text-text-secondary bg-white/5 rounded-lg px-4 py-3">
                    <span className="text-text-muted shrink-0">💡 Hint {i + 1}:</span>
                    <span>{hint.text}</span>
                  </div>
                ) : i === revealedHints ? (
                  /* # Next hint to reveal */
                  <button
                    onClick={() => setRevealedHints(revealedHints + 1)}
                    className="text-sm px-4 py-2 rounded-lg border border-dashed border-white/20 text-text-muted hover:text-white hover:border-white/40 transition-colors w-full text-left"
                  >
                    Click to reveal Hint {i + 1}
                  </button>
                ) : (
                  /* # Locked hint */
                  <div className="text-sm px-4 py-2 rounded-lg border border-dashed border-white/10 text-text-muted/50 w-full">
                    Hint {i + 1} (reveal previous hint first)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* # Solution toggle */}
        {solutions && solutions.length > 0 && (
          <div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                borderColor: showSolution ? `${color}40` : "rgba(255,255,255,0.15)",
                color: showSolution ? color : "rgba(255,255,255,0.7)",
                backgroundColor: showSolution ? `${color}10` : "transparent",
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform ${showSolution ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>

            {showSolution && (
              <div className="mt-4 space-y-6">
                {solutions.map((sol, i) => (
                  <div key={i} className="space-y-3">
                    {/* # Approach label */}
                    <div className="flex items-center gap-3">
                      <h5 className="text-sm font-bold text-white">{sol.approach}</h5>
                      {sol.complexity && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-text-muted">
                          {sol.complexity}
                        </span>
                      )}
                    </div>
                    {/* # Explanation */}
                    <p className="text-sm text-text-secondary">{sol.explanation}</p>
                    {/* # Code block */}
                    <div className="relative">
                      {sol.language && (
                        <div
                          className="absolute top-0 right-0 px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-bl-lg rounded-tr-lg"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {sol.language}
                        </div>
                      )}
                      <pre className="bg-black/40 border border-card-border rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                          {sol.code}
                        </code>
                      </pre>
                    </div>
                  </div>
                ))}

                {/* # Interview context */}
                {interviewContext && (
                  <div className="bg-white/5 rounded-lg p-4 border border-card-border/50">
                    <p className="text-xs font-semibold text-white mb-1">Why interviewers ask this:</p>
                    <p className="text-sm text-text-secondary">{interviewContext}</p>
                  </div>
                )}

                {/* # Similar problems */}
                {similarProblems && similarProblems.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-2">Similar problems:</p>
                    <div className="flex flex-wrap gap-2">
                      {similarProblems.map((p, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-card-border/50"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
