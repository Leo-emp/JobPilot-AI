# Interview Language Coach — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a post-mock-interview coaching page that transforms user answers into professional versions using their resume, company, and JD context.

**Architecture:** One new page (`/dashboard/interview/mock/coach`) renders coaching cards from a single non-streaming Gemini call. Data passes from mock interview results via sessionStorage. All changes to existing files are pure insertions — no existing lines are modified or deleted.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Gemini API (non-streaming JSON), Vitest

**Spec:** `docs/superpowers/specs/2026-09-16-interview-language-coach-design.md`

## Global Constraints

- **Zero existing lines modified or deleted** — all changes to existing files are insertions only
- **No new dependencies** — uses existing `react-markdown`, Gemini client, UI classes
- **No database changes** — data is ephemeral via sessionStorage
- **No new sidebar item** — feature is discovered through mock interview results only
- **Comments on every function and block** — user requires heavily commented code
- **Test runner:** Vitest (`npx vitest run`)
- **Existing test file for validations:** `src/__tests__/validations.test.ts` — has a hardcoded action list that must be updated

---

### Task 1: Add `interviewCoaching` Prompt Builder

**Files:**
- Modify: `src/lib/prompts/interview.ts` (append after line 571)
- Modify: `src/lib/prompts/index.ts` (insert import on line 15, insert case after line 67)
- Modify: `src/lib/validations.ts` (insert `"interview_coaching"` after line 85)
- Modify: `src/__tests__/validations.test.ts` (add to hardcoded action list on line 136)

**Interfaces:**
- Consumes: nothing new — follows existing prompt builder pattern
- Produces: `interviewCoaching(payload)` → returns prompt string. Payload shape: `{ role, company, companyPromptBlock, interviewType, experience, jobDescription, resume, transcript, questionsAnswered }`

- [ ] **Step 1: Add the prompt builder function to `interview.ts`**

Append at the end of `src/lib/prompts/interview.ts` (after line 571):

```typescript
/* ============================================================
   INTERVIEW LANGUAGE COACH
   ============================================================
   Generates professional versions of the candidate's mock
   interview answers, personalized with their resume, target
   company, and JD. Returns JSON array of coaching objects.
   ============================================================ */
export function interviewCoaching(payload: Record<string, any>): string {
  const company = payload.company || "the company";
  const companyBlock = payload.companyPromptBlock || "";

  /* Company-specific language coaching rules */
  /* Different companies expect different communication styles */
  const companyLanguageRules = companyBlock
    ? `COMPANY-SPECIFIC LANGUAGE FOR ${company}:
Use language and frameworks that ${company} interviewers value.
${companyBlock}
Frame every answer to align with ${company}'s culture and evaluation criteria.
If ${company} uses specific frameworks (e.g., Amazon Leadership Principles, Google Googleyness), weave that language naturally into pro answers.`
    : `Use standard professional business English. Quantify outcomes, use action verbs, show initiative. Frame answers for a ${payload.interviewType || "general"} interview context.`;

  return `You are an elite interview language coach specializing in helping international professionals sound polished and confident in corporate interviews. The candidate just completed a mock interview. They understand the questions and have relevant experience, but their language lacks the polish that hiring managers expect.

YOUR TASK: For each question below, write a professional version of the candidate's answer and explain what they should learn.

RULES FOR PRO ANSWERS:
1. Use the candidate's ACTUAL experiences, skills, and projects from their resume. NEVER invent achievements, metrics, or skills they don't have.
2. Keep answers 150-200 words (60-90 seconds spoken). Concise and punchy.
3. Only use STAR method for behavioral questions ("Tell me about a time..."). For motivation/technical/opinion questions — answer directly and naturally.
4. NEVER open with filler ("That's a great question", "I believe I would be a great fit"). Jump straight into the answer.
5. Replace every casual phrase with a professional equivalent:
   - "my boss was not good" → never criticize; reframe as YOUR growth need
   - "it was boring" → "I'd maximized my growth in that role"
   - "I did stuff with data" → "I led data-driven process optimization"
   - "I'm good at teamwork" → name a specific collaboration with measurable outcome
   - "I left because..." → "I'm seeking an environment where I can..."

${companyLanguageRules}

RULES FOR TAKEAWAYS (max 3 per question):
- Each takeaway identifies a specific pattern: "You said [X] → say [Y] instead — here's why: [reason]"
- Focus on REUSABLE patterns they can apply to any question, not one-off fixes
- Be specific — quote their actual words and show the exact replacement

RULES FOR PHRASES TO REMEMBER (2-3 per question):
- Extract professional phrases from each pro answer that the candidate should memorize
- These must be plug-and-play templates: "[X] years of experience driving [outcome]" — they fill in their own details
- Only include phrases that sound natural when spoken aloud

CANDIDATE CONTEXT:
- Target Role: ${payload.role || "Not specified"}
- Target Company: ${company}
- Interview Type: ${payload.interviewType || "General"}
- Experience Level: ${payload.experience || "Mid-level"}

${payload.jobDescription ? `JOB DESCRIPTION:\n${payload.jobDescription}` : ""}

CANDIDATE'S RESUME:
${payload.resume || "No resume provided"}

INTERVIEW TRANSCRIPT (${payload.questionsAnswered || "unknown"} questions answered):
${payload.transcript || "No transcript provided"}

Return ONLY valid JSON (no markdown, no code fences) as an array:
[
  {
    "questionNumber": 1,
    "question": "short version of the question asked",
    "proAnswer": "the professional answer using their real experience (150-200 words)",
    "takeaways": ["specific pattern: You said X → say Y — here's why", "pattern 2", "pattern 3"],
    "phrasesToRemember": ["reusable phrase template 1", "reusable phrase template 2"]
  }
]`;
}
```

- [ ] **Step 2: Add the import in `prompts/index.ts`**

On line 15 of `src/lib/prompts/index.ts`, add `interviewCoaching` to the import:

Change:
```typescript
import { coverLetter, interviewQuestions, interviewAnswer, interviewFeedback, mockInterviewRespond, mockInterviewStart, mockInterviewEvaluate, mockInterviewSummary, resignationLetter } from "./interview";
```
To:
```typescript
import { coverLetter, interviewQuestions, interviewAnswer, interviewFeedback, mockInterviewRespond, mockInterviewStart, mockInterviewEvaluate, mockInterviewSummary, resignationLetter, interviewCoaching } from "./interview";
```

- [ ] **Step 3: Register the action in the switch statement in `prompts/index.ts`**

After line 67 (`case "mock_interview_summary"`), insert:

```typescript
    case "interview_coaching": return { prompt: interviewCoaching(payload) };
```

- [ ] **Step 4: Add `"interview_coaching"` to the validation schema in `validations.ts`**

After `"mock_interview_summary"` on line 85, insert:

```typescript
  "interview_coaching",
```

- [ ] **Step 5: Update the test's hardcoded action list in `validations.test.ts`**

On line 136 of `src/__tests__/validations.test.ts`, add `"interview_coaching"` to the array:

Change:
```typescript
      "mock_interview_respond", "mock_interview_evaluate", "mock_interview_summary",
      "craft_outreach", "parse_resume_fields",
```
To:
```typescript
      "mock_interview_respond", "mock_interview_evaluate", "mock_interview_summary",
      "interview_coaching", "craft_outreach", "parse_resume_fields",
```

- [ ] **Step 6: Run existing tests to verify nothing is broken**

```bash
cd jobpilot-website && npx vitest run src/__tests__/validations.test.ts
```

Expected: ALL existing tests pass, including the updated "accepts all valid action types" test.

- [ ] **Step 7: Commit**

```bash
git add src/lib/prompts/interview.ts src/lib/prompts/index.ts src/lib/validations.ts src/__tests__/validations.test.ts
git commit -m "feat(interview-coach): add interviewCoaching prompt builder and register action"
```

---

### Task 2: Add sessionStorage Persistence to Mock Interview Results

**Files:**
- Modify: `src/app/dashboard/interview/mock/page.tsx` (~25 lines inserted)

**Interfaces:**
- Consumes: existing state variables (`finalScore`, `messages`, `role`, `company`, etc.)
- Produces: sessionStorage key `"mockInterviewSession"` containing `MockInterviewSession` JSON. Later tasks read this key.

- [ ] **Step 1: Add the sessionStorage save effect**

Insert after line 268 (`const [error, setError] = useState("");`) in `mock/page.tsx`:

```typescript
  /* ---- Persist results to sessionStorage ---- */
  /* Enables: (1) coach page reads interview data, (2) "Back to Results" restores state */
  useEffect(() => {
    if (!finalScore) return;
    try {
      sessionStorage.setItem("mockInterviewSession", JSON.stringify({
        role, company, companyPromptBlock, interviewType, experience,
        jobDescription, resume, messages, finalScore, elapsedTime,
      }));
    } catch { /* sessionStorage full or unavailable — non-critical, ignore */ }
  }, [finalScore, role, company, companyPromptBlock, interviewType, experience, jobDescription, resume, messages, elapsedTime]);
```

- [ ] **Step 2: Add the sessionStorage restore effect**

Insert immediately after the save effect:

```typescript
  /* ---- Restore results from sessionStorage (browser back navigation) ---- */
  /* Only restores if phase is "setup" and no finalScore exists (fresh mount) */
  useEffect(() => {
    if (phase !== "setup" || finalScore) return;
    try {
      const saved = sessionStorage.getItem("mockInterviewSession");
      if (!saved) return;
      const data = JSON.parse(saved);
      if (!data.finalScore) return;
      /* Restore all state needed to render the results phase */
      setRole(data.role || "");
      setCompany(data.company || "");
      setCompanyPromptBlock(data.companyPromptBlock || "");
      setInterviewType(data.interviewType || "Behavioral");
      setExperience(data.experience || "Mid-level");
      setJobDescription(data.jobDescription || "");
      setResume(data.resume || "");
      setMessages(data.messages || []);
      setFinalScore(data.finalScore);
      setElapsedTime(data.elapsedTime || 0);
      setPhase("results");
    } catch { /* corrupt or missing — ignore, user just sees setup page */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); /* intentionally run once on mount only */
```

- [ ] **Step 3: Clear sessionStorage in the "Practice Another Interview" reset**

On line 1576 of `mock/page.tsx`, the existing onClick handler resets all state. Append `sessionStorage.removeItem("mockInterviewSession");` at the end of the inline function:

Change:
```typescript
onClick={() => { setPhase("setup"); setFinalScore(null); setMessages([]); setCurrentAIMessage(""); setExchangeNumber(0); setQuestionNumber(0); setSkippedQuestions([]); setError(""); setWebcamReady(false); setCompanyCategory(""); setCompanySlug(""); setCompany(""); setCompanyPromptBlock(""); }}
```
To:
```typescript
onClick={() => { setPhase("setup"); setFinalScore(null); setMessages([]); setCurrentAIMessage(""); setExchangeNumber(0); setQuestionNumber(0); setSkippedQuestions([]); setError(""); setWebcamReady(false); setCompanyCategory(""); setCompanySlug(""); setCompany(""); setCompanyPromptBlock(""); try { sessionStorage.removeItem("mockInterviewSession"); } catch {} }}
```

- [ ] **Step 4: Verify build compiles**

```bash
cd jobpilot-website && npx next build --no-lint 2>&1 | tail -5
```

Expected: Build succeeds (or only pre-existing warnings). No new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/interview/mock/page.tsx
git commit -m "feat(interview-coach): persist mock interview results to sessionStorage"
```

---

### Task 3: Add Coach CTA Card to Mock Interview Results

**Files:**
- Modify: `src/app/dashboard/interview/mock/page.tsx` (~20 lines inserted)

**Interfaces:**
- Consumes: `finalScore.readinessLevel` (existing state)
- Produces: Navigates to `/dashboard/interview/mock/coach` on click

- [ ] **Step 1: Add the coach CTA card JSX**

Insert between line 1531 (end of Strengths & Improvements grid) and line 1533 (start of Per-Question Breakdown comment) in `mock/page.tsx`:

```tsx
          {/* ---- Interview Coach CTA (only when below "Interview Ready") ---- */}
          {finalScore.readinessLevel !== "Interview Ready" && finalScore.readinessLevel !== "Excellent" && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-brand-indigo/30">
              <p className="text-white text-sm mb-3">
                Your answers showed good thinking but the language needs polish. See how a pro would phrase each answer using <span className="text-brand-light font-semibold">your real experience</span>.
              </p>
              <Link
                href="/dashboard/interview/mock/coach"
                className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all"
              >
                Get Pro Answers
              </Link>
              <p className="text-xs text-text-secondary mt-2">Uses 1 AI credit</p>
            </div>
          )}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd jobpilot-website && npx next build --no-lint 2>&1 | tail -5
```

Expected: Build succeeds. `Link` is already imported at line 18.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/interview/mock/page.tsx
git commit -m "feat(interview-coach): add coach CTA card in mock interview results"
```

---

### Task 4: Create the Coach Page

**Files:**
- Create: `src/app/dashboard/interview/mock/coach/page.tsx`

**Interfaces:**
- Consumes: sessionStorage key `"mockInterviewSession"` (from Task 2), `/api/ai` endpoint with action `"interview_coaching"` (from Task 1)
- Produces: Rendered coaching page at `/dashboard/interview/mock/coach`

- [ ] **Step 1: Create the coach page**

Create `src/app/dashboard/interview/mock/coach/page.tsx`:

```tsx
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
          {session.role} • {session.company || "General"} • {session.interviewType} Interview
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
                            <span className="text-brand-light">→</span> {t}
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
```

- [ ] **Step 2: Verify build compiles**

```bash
cd jobpilot-website && npx next build --no-lint 2>&1 | tail -5
```

Expected: Build succeeds. The new page is automatically routed at `/dashboard/interview/mock/coach`.

- [ ] **Step 3: Run all existing tests to confirm nothing is broken**

```bash
cd jobpilot-website && npx vitest run
```

Expected: ALL existing tests pass. No regressions.

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/interview/mock/coach/page.tsx
git commit -m "feat(interview-coach): add coach page with coaching cards UI"
```

---

### Task 5: Manual End-to-End Verification

**Files:** None — this is a testing task.

- [ ] **Step 1: Start dev server**

```bash
cd jobpilot-website && npm run dev
```

- [ ] **Step 2: Complete a mock interview with a low score**

1. Go to `/dashboard/interview/mock`
2. Set up: any role, any company, Behavioral, paste a JD, upload/load resume
3. Complete the interview — give short, casual answers to get a low score
4. Verify: results page renders with score below 70

- [ ] **Step 3: Verify coach CTA appears**

1. In the results page, scroll to the area between "Key Improvements" and "Question-by-Question Review"
2. Verify: the coach CTA card is visible with "Get Pro Answers" button
3. Verify: "Uses 1 AI credit" text shows below the button

- [ ] **Step 4: Click through to coach page**

1. Click "Get Pro Answers"
2. Verify: navigates to `/dashboard/interview/mock/coach`
3. Verify: loading spinner with "Building your personalized pro answers..."
4. Verify: coaching cards render after ~5-10 seconds
5. Verify: each card shows the question, score, user answer, pro answer, takeaways, phrases

- [ ] **Step 5: Check pro answer quality**

1. Pro answers reference the actual resume (company names, skills, projects)
2. Pro answers are 150-200 words (not too short, not too long)
3. Takeaways use "You said X → say Y" pattern
4. Phrases to remember are plug-and-play templates

- [ ] **Step 6: Test navigation**

1. Click "Back to Results" → verify results page renders correctly (restored from sessionStorage)
2. Go back to coach page → verify it still works (sessionStorage still has data)
3. Click "Practice Another Interview" → verify navigates to fresh setup page
4. Navigate directly to `/dashboard/interview/mock/coach` without doing a mock interview → verify error state

- [ ] **Step 7: Test high score (coach should NOT appear)**

1. Complete a mock interview with detailed, structured answers (score 71+)
2. Verify: coach CTA does NOT appear in results

- [ ] **Step 8: Test mobile layout**

1. Open browser DevTools → toggle mobile view (375px width)
2. Verify: coaching cards stack vertically, text is readable, no horizontal scroll

- [ ] **Step 9: Final commit with any fixes**

If any fixes were needed during testing:
```bash
git add -A
git commit -m "fix(interview-coach): polish based on manual testing"
```
