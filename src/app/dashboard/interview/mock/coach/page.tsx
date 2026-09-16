/* ============================================================
   INTERVIEW LANGUAGE COACH PAGE
   ============================================================
   Post-mock-interview coaching that transforms the user's
   actual answers into professional versions, personalized
   using their resume, target role, company, and JD.

   Flow:
   1. Read mock interview data from sessionStorage
   2. Extract Q&A pairs (skip unanswered questions)
   3. Fire one non-streaming Gemini call
   4. Render coaching cards: user answer vs pro answer
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ---- Types ---- */
/* Matches the ChatMessage interface from mock/page.tsx */
interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

/* Per-question score from mock interview results */
interface QuestionScore {
  question: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

/* Full mock interview results (same as FinalScore in mock/page.tsx) */
interface FinalScore {
  overallScore: number;
  categories: Record<string, number>;
  questionScores: QuestionScore[];
  topStrengths: string[];
  keyImprovements: string[];
  overallFeedback: string;
  readinessLevel: string;
}

/* Data shape stored in sessionStorage by the mock interview page */
interface MockInterviewSession {
  role: string;
  company: string;
  companyPromptBlock: string;
  interviewType: string;
  experience: string;
  jobDescription: string;
  resume: string;
  messages: ChatMessage[];
  finalScore: FinalScore;
  elapsedTime: number;
}

/* One coaching result from the AI response */
interface CoachingResult {
  questionNumber: number;
  question: string;
  proAnswer: string;
  takeaways: string[];
  phrasesToRemember: string[];
}

/* ---- Helper: extract Q&A pairs from conversation ---- */
/* The mock interview alternates AI and user messages. Each AI message */
/* ends with a question; the next user message is the answer. We match */
/* these to questionScores which has the clean question text. */
function extractQAPairs(
  messages: ChatMessage[],
  questionScores: QuestionScore[]
): { question: string; userAnswer: string; score: number }[] {
  const pairs: { question: string; userAnswer: string; score: number }[] = [];

  for (const qs of questionScores) {
    /* Find the AI message containing this question text */
    const qLower = qs.question.toLowerCase();
    const aiIdx = messages.findIndex(
      (m) => m.role === "ai" && m.text.toLowerCase().includes(qLower.slice(0, 40))
    );
    /* The next user message after the AI question is the answer */
    if (aiIdx >= 0) {
      const userMsg = messages.find(
        (m, i) => i > aiIdx && m.role === "user"
      );
      /* Only include if user actually answered (not empty/skipped) */
      if (userMsg && userMsg.text.trim()) {
        pairs.push({
          question: qs.question,
          userAnswer: userMsg.text,
          score: qs.score,
        });
      }
    }
  }
  return pairs;
}

/* ---- Helper: format Q&A pairs into transcript for the prompt ---- */
function formatTranscript(pairs: { question: string; userAnswer: string }[]): string {
  return pairs
    .map((p, i) => `Question ${i + 1}: ${p.question}\nCandidate's Answer: ${p.userAnswer}`)
    .join("\n\n");
}

/* ---- Helper: call the /api/ai endpoint (non-streaming) ---- */
async function callAI(action: string, payload: Record<string, string>): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "AI request failed");
  if (!data?.result) throw new Error("No response from AI");
  return data.result;
}

/* ---- Helper: parse JSON from AI response (strips code fences) ---- */
function parseAIJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function InterviewCoachPage() {
  const router = useRouter();

  /* ---- State ---- */
  const [session, setSession] = useState<MockInterviewSession | null>(null); /* mock interview data from sessionStorage */
  const [qaPairs, setQaPairs] = useState<{ question: string; userAnswer: string; score: number }[]>([]); /* extracted Q&A pairs */
  const [coachingResults, setCoachingResults] = useState<CoachingResult[]>([]); /* AI coaching output */
  const [loading, setLoading] = useState(false); /* waiting for AI response */
  const [error, setError] = useState(""); /* error message */
  const [noData, setNoData] = useState(false); /* sessionStorage was empty */

  /* ---- Load session data from sessionStorage on mount ---- */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("mockInterviewSession");
      if (!saved) { setNoData(true); return; }

      const data: MockInterviewSession = JSON.parse(saved);
      if (!data.finalScore || !data.messages?.length) { setNoData(true); return; }

      setSession(data);

      /* Extract Q&A pairs, skipping unanswered questions */
      const pairs = extractQAPairs(data.messages, data.finalScore.questionScores);
      setQaPairs(pairs);
    } catch {
      setNoData(true);
    }
  }, []);

  /* ---- Fetch coaching from AI ---- */
  const fetchCoaching = useCallback(async () => {
    if (!session || qaPairs.length === 0) return;

    setLoading(true);
    setError("");

    try {
      /* Format the transcript from extracted Q&A pairs */
      const transcript = formatTranscript(qaPairs);

      /* One non-streaming call to Gemini */
      const result = await callAI("interview_coaching", {
        role: session.role,
        company: session.company,
        companyPromptBlock: session.companyPromptBlock,
        interviewType: session.interviewType,
        experience: session.experience,
        jobDescription: session.jobDescription,
        resume: session.resume,
        transcript,
        questionsAnswered: String(qaPairs.length),
      });

      /* Parse the JSON response */
      const parsed = parseAIJson<CoachingResult[]>(result);
      setCoachingResults(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate coaching. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session, qaPairs]);

  /* ---- Auto-fetch coaching when Q&A pairs are ready ---- */
  useEffect(() => {
    if (qaPairs.length > 0 && coachingResults.length === 0 && !loading && !error) {
      fetchCoaching();
    }
  }, [qaPairs, coachingResults.length, loading, error, fetchCoaching]);

  /* ============================================================
     RENDER: NO DATA STATE
     ============================================================ */
  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-3">No Interview Data Found</h1>
        <p className="text-text-secondary mb-6">Complete a mock interview first to get personalized coaching.</p>
        <Link
          href="/dashboard/interview/mock"
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all"
        >
          Start Mock Interview
        </Link>
      </div>
    );
  }

  /* ============================================================
     RENDER: MAIN COACHING VIEW
     ============================================================ */
  return (
    <div>
      {/* ---- Header ---- */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="text-text-secondary hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Interview Language Coach</h1>
      </div>
      {session && (
        <p className="text-text-secondary mb-8">
          {session.role} &bull; {session.company || "General"} &bull; {session.interviewType} Interview
        </p>
      )}

      {/* ---- Loading State ---- */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-brand-indigo mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-text-secondary">Building your personalized pro answers...</p>
          <p className="text-xs text-text-secondary mt-2">Analyzing {qaPairs.length} answers against your resume and target role</p>
        </div>
      )}

      {/* ---- Error State ---- */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => { setError(""); fetchCoaching(); }}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ---- Coaching Cards ---- */}
      {coachingResults.length > 0 && !loading && (
        <div className="space-y-6">
          {coachingResults.map((result, idx) => {
            /* Find the matching Q&A pair for the user's original answer */
            const qa = qaPairs[idx] || qaPairs.find(
              (p) => p.question.toLowerCase().includes(result.question.toLowerCase().slice(0, 30))
            );
            const score = qa?.score ?? 0;

            return (
              <div key={idx} className="rounded-2xl bg-space-700/80 border border-card-border overflow-hidden">
                {/* ---- Question header with score badge ---- */}
                <div className="p-4 border-b border-card-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Question {idx + 1}</span>
                    <p className="text-white text-sm mt-1">&ldquo;{result.question}&rdquo;</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    score >= 7 ? "bg-green-500/20 text-green-400" : score >= 5 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {score}/10
                  </span>
                </div>

                <div className="p-5 space-y-5">
                  {/* ---- User's original answer ---- */}
                  {qa?.userAnswer && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Your Answer</p>
                      <div className="bg-space-600/30 border border-card-border rounded-xl p-4">
                        <p className="text-sm text-text-secondary leading-relaxed">{qa.userAnswer}</p>
                      </div>
                    </div>
                  )}

                  {/* ---- Pro answer ---- */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-2">Pro Answer</p>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <p className="text-sm text-white leading-relaxed">{result.proAnswer}</p>
                    </div>
                  </div>

                  {/* ---- What to learn ---- */}
                  {result.takeaways?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">What to Learn</p>
                      <div className="space-y-2">
                        {result.takeaways.map((t, i) => (
                          <p key={i} className="text-sm text-text-secondary">
                            <span className="text-brand-light">&rarr;</span> {t}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ---- Phrases to remember ---- */}
                  {result.phrasesToRemember?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Phrases to Remember</p>
                      <div className="bg-brand-indigo/5 border border-brand-indigo/20 rounded-xl p-4 space-y-1.5">
                        {result.phrasesToRemember.map((p, i) => (
                          <p key={i} className="text-sm text-brand-light font-mono">&ldquo;{p}&rdquo;</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ---- Action buttons ---- */}
          <div className="flex gap-4 pt-2">
            <Link
              href="/dashboard/interview/mock"
              onClick={() => { try { sessionStorage.removeItem("mockInterviewSession"); } catch {} }}
              className="flex-1 py-3 rounded-xl font-semibold text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all"
            >
              Practice Another Interview
            </Link>
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl font-semibold bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all"
            >
              Back to Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
