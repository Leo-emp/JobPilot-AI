# Interview Language Coach — Design Spec

**Date:** 2026-09-16
**Status:** Draft
**Author:** Leo / Claude

---

## 1. Problem

International students know English but struggle with corporate/professional language in interviews. They say "my boss was not good" instead of "I was seeking a more growth-oriented environment." This isn't a vocabulary problem — it's a register problem. They don't know the phrases, frameworks, and tone that hiring managers expect.

Existing JP Arc features (Interview Prep, Mock Interview) test interview performance but don't teach the language itself.

## 2. Solution

**Interview Language Coach** — a post-mock-interview coaching experience that transforms the user's actual answers into professional versions, personalized using their resume, target role, company, and job description.

## 3. Scope

### In Scope
- New page at `/dashboard/interview/mock/coach`
- Coaching button in mock interview results (conditional on score)
- New Gemini prompt (`interview_coaching`)
- New prompt builder in `src/lib/prompts/interview.ts`
- New action registered in `src/lib/prompts/index.ts`
- Persist mock interview results to sessionStorage (enables "Back to Results")

### Out of Scope (future)
- Standalone phrase practice gym (no mock interview required)
- Tone Checker / Role Translator tools
- Static corporate jargon glossary
- Saved phrase bank / progress tracking across sessions

---

## 4. User Flow

```
User completes mock interview
        ↓
Results phase renders with scores
  → Results also saved to sessionStorage (enables Back navigation)
        ↓
readinessLevel is "Not Ready" / "Needs Work" / "Almost There"?
    YES → Show "Interview Coach" CTA card
    NO  → Don't show (user scored "Interview Ready" or "Excellent")
        ↓
User clicks "Get Pro Answers"
        ↓
Navigate to /dashboard/interview/mock/coach
(reads interview data from sessionStorage)
        ↓
Page loads → fires 1 non-streaming Gemini call
  → Shows loading spinner: "Building your personalized pro answers..."
        ↓
JSON response parsed → renders coaching cards:
  For each answered question:
    1. The question + user's score
    2. "YOUR ANSWER" — from stored transcript
    3. "PRO ANSWER" — from AI response
    4. "WHAT TO LEARN" — from AI response
        ↓
User scrolls through all questions, learning the gaps
        ↓
[Practice Another Interview]  [Back to Results]
  → "Back to Results" restores from sessionStorage
```

## 5. Pass Score Threshold

The coach button appears when `readinessLevel` is one of:
- **"Not Ready"** (score 0-29)
- **"Needs Work"** (score 30-50)
- **"Almost There"** (score 51-70)

Does NOT appear for:
- **"Interview Ready"** (score 71-85)
- **"Excellent"** (score 86-100)

## 6. Data Flow

### 6.1 Persisting Mock Interview State

When the results phase renders (after `finalScore` is set), save the full interview context to sessionStorage. This serves two purposes:
1. The coach page reads it to build the coaching request
2. "Back to Results" from the coach page can restore the results view

```typescript
// Saved when results phase renders
interface MockInterviewSession {
  // Setup context (needed by both results + coaching)
  role: string;
  company: string;
  companyPromptBlock: string;
  interviewType: string;
  experience: string;
  jobDescription: string;
  resume: string;

  // Results (needed to restore results page + display in coaching)
  messages: ChatMessage[];
  finalScore: FinalScore;
  elapsedTime: number;
}
```

Key: `"mockInterviewSession"`

The results page saves this once when `finalScore` is set. On mount, it checks sessionStorage and restores if data exists (handles browser back navigation).

### 6.2 Transcript Extraction

The coach page extracts Q&A pairs from `messages[]` before calling the API. The mock interview conversation alternates: AI asks → user answers → AI responds → user answers...

```typescript
// Extract answered Q&A pairs from the conversation
function extractQAPairs(
  messages: ChatMessage[],
  questionScores: QuestionScore[]
): { question: string; userAnswer: string }[] {
  const pairs: { question: string; userAnswer: string }[] = [];

  // questionScores already has the clean question text
  // Match each scored question to the user's answer from the transcript
  for (const qs of questionScores) {
    // Find the user message that follows this question in the conversation
    const userMsg = findUserAnswerForQuestion(messages, qs.question);
    if (userMsg && userMsg.trim()) {
      pairs.push({ question: qs.question, userAnswer: userMsg });
    }
  }
  return pairs;
}
```

Format the pairs into a transcript string for the prompt:
```
Question 1: Tell me about yourself
Candidate's Answer: I am from Myanmar and I studied business...

Question 2: Describe a time you handled conflict
Candidate's Answer: I had a problem with a teammate who wasn't doing work...
```

Skipped questions (empty answers) are excluded.

### 6.3 Coach Page → Gemini API

One **non-streaming** call to `/api/ai` with action `"interview_coaching"`.

Non-streaming because:
- Response is structured JSON (partial JSON can't be rendered)
- Same pattern as `mockInterviewSummary` (already works reliably)
- Output is ~3,500 tokens (~5-10s wait — acceptable with loading state)
- Avoids flaky partial-markdown rendering

**Payload:**
```typescript
{
  role: string;
  company: string;
  companyPromptBlock: string;
  interviewType: string;
  experience: string;
  jobDescription: string;
  resume: string;
  transcript: string;           // formatted Q&A pairs (skipped excluded)
  questionsAnswered: string;    // count for context
}
```

### 6.4 Gemini Response Format (JSON)

```json
[
  {
    "questionNumber": 1,
    "question": "Tell me about yourself",
    "proAnswer": "I'm an operations professional with 2 years of experience driving process efficiency at RealRate. My background in business administration, combined with hands-on experience optimizing cross-functional workflows, has given me a strong foundation in operational strategy. I'm now looking to bring that experience to a product-focused role where I can bridge the gap between technical teams and business outcomes.",
    "takeaways": [
      "Lead with your professional identity ('operations professional'), not your origin story",
      "'Driving process efficiency' — quantifies what you do, not just where you worked",
      "Connect your past directly to the role: 'bridge the gap between technical teams and business outcomes'"
    ],
    "phrasesToRemember": [
      "X years of experience driving [outcome]",
      "strong foundation in [relevant skill]",
      "looking to bring that experience to [target role]"
    ]
  }
]
```

**Token savings:** AI does NOT echo the user's answer back — we already have it from the transcript. AI only returns `proAnswer` + `takeaways` + `phrasesToRemember`. Saves ~1,000 output tokens.

## 7. Prompt Design

### 7.1 New Prompt: `interviewCoaching`

Location: `src/lib/prompts/interview.ts`

```
You are an elite interview language coach specializing in helping
international professionals sound polished and confident in corporate
interviews. The candidate just completed a mock interview. They
understand the questions and have relevant experience, but their
language lacks the polish that hiring managers expect.

YOUR TASK: For each question below, write a professional version of the
candidate's answer and explain what they should learn.

RULES FOR PRO ANSWERS:
1. Use the candidate's ACTUAL experiences, skills, and projects from
   their resume. NEVER invent achievements, metrics, or skills.
2. Keep answers 150-200 words (60-90 seconds spoken). Concise and punchy.
3. Only use STAR for behavioral questions ("Tell me about a time...").
   For motivation/technical/opinion questions — answer directly.
4. NEVER open with filler ("That's a great question", "I believe I would
   be a great fit"). Jump straight into the answer.
5. Replace every casual phrase with a professional equivalent:
   - "my boss was not good" → never criticize; reframe as YOUR growth
   - "it was boring" → "I'd maximized my growth in that role"
   - "I did stuff with data" → "I led data-driven process optimization"
   - "I'm good at teamwork" → name a specific collaboration with outcome

COMPANY-SPECIFIC LANGUAGE:
{companyLanguageRules}

RULES FOR TAKEAWAYS:
- Each takeaway identifies a specific pattern: "You said [X] → say [Y]
  instead — here's why it works: [reason]"
- Focus on REUSABLE patterns they can apply to any question, not
  one-off fixes
- Max 3 takeaways per question — the most impactful changes only

RULES FOR PHRASES TO REMEMBER:
- Extract 2-3 professional phrases from each pro answer that the
  candidate should memorize
- These should be plug-and-play: "[X] years of experience driving
  [outcome]" — they can fill in their own details
- Only include phrases that sound natural spoken aloud, not written-only

CANDIDATE CONTEXT:
- Target Role: {role}
- Target Company: {company}
- Interview Type: {interviewType}
- Experience Level: {experience}
{companyPromptBlock}

JOB DESCRIPTION:
{jobDescription}

CANDIDATE'S RESUME:
{resume}

INTERVIEW TRANSCRIPT ({questionsAnswered} questions answered):
{transcript}

Return ONLY valid JSON (no markdown, no code fences) as an array:
[
  {
    "questionNumber": 1,
    "question": "short version of the question",
    "proAnswer": "the professional answer using their real experience",
    "takeaways": ["pattern 1", "pattern 2", "pattern 3"],
    "phrasesToRemember": ["reusable phrase 1", "reusable phrase 2"]
  }
]
```

### 7.2 Company-Specific Language Rules

The `companyLanguageRules` variable is generated based on whether a
company was selected. Examples embedded in the prompt:

- **Google/Big Tech:** "Use data-driven language. Quantify everything.
  Frame impact at scale. 'Improved process efficiency by 20% across 3
  teams' > 'made things better'."
- **McKinsey/Consulting:** "Use structured, hypothesis-driven language.
  Lead with the 'so what'. Framework answers: 'I'd approach this in
  three dimensions...' Show you structure ambiguity."
- **Amazon:** "Map answers to Leadership Principles. Use 'customer
  obsession', 'bias for action', 'dive deep', 'disagree and commit'
  naturally in answers."
- **Startups:** "Emphasize ownership and resourcefulness. 'Wore many
  hats', 'built from zero', 'shipped in 2 weeks with no budget'."
- **Generic (no company selected):** "Use standard professional
  business English. Quantify outcomes, use action verbs, show initiative."

If `companyPromptBlock` exists (from companyProfiles.ts), it's already
included — the language rules add explicit style instructions on top.

### 7.3 Prompt Registration

Add to `src/lib/prompts/index.ts`:
```typescript
case "interview_coaching": return { prompt: interviewCoaching(payload) };
```

### 7.4 Token Estimation

- Input: ~10,000 tokens (resume ~1,500 + JD ~500 + company ~200 +
  system prompt ~800 + transcript ~7,000)
- Output: ~2,500 tokens (JSON array, no echoed user answers)
- Cost: ~$0.03 per coaching session (visible tokens, Gemini 3.6 Flash)
- With thinking overhead: ~$0.05-0.08 total

## 8. UI Design

### 8.1 Coach Button (in mock results page)

Appears after "Key Improvements" section, before "Question-by-Question
Review". Only renders when readinessLevel is NOT "Interview Ready" or
"Excellent".

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Your answers showed good thinking but the         │
│  language needs polish. See how a pro would        │
│  phrase each answer using YOUR real experience.     │
│                                                    │
│         [Get Pro Answers]                          │
│                                                    │
│           Uses 1 AI credit                         │
│                                                    │
└──────────────────────────────────────────────────┘
```

Styled: `bg-gradient-to-r from-indigo-600/10 to-purple-600/10` border
with `border-brand-indigo/30`. Button uses `btn-primary` gradient.
"Uses 1 AI credit" in `text-xs text-text-secondary`.

### 8.2 Coach Page (`/dashboard/interview/mock/coach`)

**Header:**
```
← Back to Results
Interview Language Coach
Product Manager • Google • Behavioral Interview
```

**Loading state:**
Same pattern as mock interview summary — centered spinner with
"Building your personalized pro answers..."

**Coaching cards (one per answered question, scrollable):**
```
┌──────────────────────────────────────────────────┐
│  Q1: "Tell me about yourself"            4/10    │
├──────────────────────────────────────────────────┤
│                                                    │
│  YOUR ANSWER                                       │
│  ┌─ bg-space-600/30 border-card-border ──────┐   │
│  │ I am from Myanmar and I studied business    │   │
│  │ in university. Then I worked at a company   │   │
│  │ for 2 years doing operations...             │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  PRO ANSWER                                        │
│  ┌─ bg-green-500/5 border-green-500/20 ──────┐   │
│  │ I'm an operations professional with 2       │   │
│  │ years of experience driving process         │   │
│  │ efficiency at RealRate. My background in    │   │
│  │ business administration, combined with...   │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  WHAT TO LEARN                                     │
│  • "I am from Myanmar" → Lead with professional    │
│    identity instead — interviewers care about       │
│    what you DO, not where you're FROM              │
│  • "worked at a company" → Name it and quantify:   │
│    "drove process efficiency at RealRate"           │
│  • Missing: connection to target role. Always end   │
│    with why THIS role excites you                  │
│                                                    │
│  PHRASES TO REMEMBER                               │
│  ┌────────────────────────────────────────────┐   │
│  │ "X years of experience driving [outcome]"   │   │
│  │ "strong foundation in [relevant skill]"     │   │
│  │ "looking to bring that experience to..."    │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
└──────────────────────────────────────────────────┘

     spacing between cards (space-y-6)

┌──────────────────────────────────────────────────┐
│  Q2: "Describe a time you handled conflict" 3/10 │
├──────────────────────────────────────────────────┤
│  ...                                               │
└──────────────────────────────────────────────────┘
```

**Styling details:**
- Card container: `rounded-2xl bg-space-700/80 border border-card-border`
- Question header bar: `p-4 border-b border-card-border` with score badge
- Score badge: red (<5) / yellow (5-6) / green (7+) matching existing
- "YOUR ANSWER": `bg-space-600/30 border border-card-border rounded-xl p-4`
- "PRO ANSWER": `bg-green-500/5 border border-green-500/20 rounded-xl p-4`
- Takeaway bullets: `text-text-secondary` with `text-brand-light` for
  quoted phrases
- "PHRASES TO REMEMBER": `bg-brand-indigo/5 border border-brand-indigo/20
  rounded-xl p-4 font-mono text-sm` — pill-like feel, easy to memorize
- Section labels ("YOUR ANSWER", "PRO ANSWER", etc.): `text-xs font-semibold
  uppercase tracking-wider text-text-secondary mb-2`

**Bottom actions:**
```
[Practice Another Interview]  [Back to Results]
```

"Practice Another Interview" → `/dashboard/interview/mock` (clears
sessionStorage). "Back to Results" → `router.back()` (results page
restores from sessionStorage).

### 8.3 Edge Cases

| Case | Handling |
|------|----------|
| Direct navigation (no sessionStorage) | "No interview data found. Complete a mock interview first." + link to `/dashboard/interview/mock` |
| API error / timeout | Error card with "Try Again" button (retries the same call) |
| Short interview (1-2 questions) | Coach still works — just fewer cards. No minimum. |
| Very long answers (500+ words) | Transcript is passed as-is. Prompt already caps pro answers at 150-200 words. |
| User answered 0 questions (all skipped) | Coach button doesn't appear — `questionScores` would all be empty |
| sessionStorage full (~5MB limit) | Extremely unlikely — full payload is ~25KB. No special handling needed. |

## 9. Safety: Do Not Break Existing Features

The mock interview page (`mock/page.tsx`) is 1590 lines with complex
state management (speech recognition, TTS, webcam, phase transitions,
streaming). It is the highest-risk file in this feature.

**Hard rules:**

1. **No existing function signatures change.** Do not rename, reorder
   parameters, or modify return types of any existing function.
2. **No existing state variables change.** Do not rename, remove, or
   change the type of any `useState` declaration.
3. **No existing JSX is modified.** The coach CTA card is INSERTED
   between existing sections — the sections above and below it remain
   byte-for-byte identical.
4. **sessionStorage save is additive only.** A single `useEffect` that
   fires when `finalScore` changes. No other effect is touched.
5. **sessionStorage restore is opt-in.** On mount, check sessionStorage.
   If data exists AND `phase === "setup"` AND `finalScore === null`,
   restore. Otherwise do nothing — normal flow is completely unaffected.
6. **The "Practice Another Interview" reset block (line ~1576) is not
   modified.** It already clears all state. We only ADD a
   `sessionStorage.removeItem("mockInterviewSession")` to that block.
7. **New prompt function is a standalone export.** `interviewCoaching()`
   is added at the end of `interview.ts`. Existing functions are not
   touched.
8. **Validation change is one line.** Adding `"interview_coaching"` to
   the existing action union/enum in `validations.ts`. No existing
   values removed or reordered.

**Risk matrix:**

| File | Lines changed | Risk | Why |
|------|--------------|------|-----|
| `mock/coach/page.tsx` | ~300 (NEW) | None | Brand new file |
| `prompts/interview.ts` | ~80 (ADD) | None | New function appended at end |
| `prompts/index.ts` | 1 line (ADD) | None | New case in switch |
| `validations.ts` | 1 line (ADD) | None | New value in union |
| `mock/page.tsx` | ~40 lines (ADD) | **Medium** | sessionStorage effect + CTA card + restore logic |

The mock/page.tsx changes are all **additive insertions** — no existing
line is deleted or modified. If the feature is later removed, the
insertions can be deleted with zero impact on the original code.

## 10. Files to Create/Modify

| File | Action | What changes |
|------|--------|-------------|
| `src/app/dashboard/interview/mock/coach/page.tsx` | **CREATE** | New coach page (~300 lines) |
| `src/lib/prompts/interview.ts` | APPEND | Add `interviewCoaching()` at end of file |
| `src/lib/prompts/index.ts` | INSERT 1 line | Add `case "interview_coaching"` in switch |
| `src/lib/validations.ts` | INSERT 1 line | Add `"interview_coaching"` to action union |
| `src/app/dashboard/interview/mock/page.tsx` | INSERT ~40 lines | (1) One `useEffect` to save to sessionStorage, (2) One `useEffect` to restore on mount, (3) One JSX block for coach CTA card, (4) One `sessionStorage.removeItem` in existing reset. **Zero existing lines deleted or modified.** |

**No new dependencies.** Uses existing `callAI` helper (non-streaming),
existing `parseAIJson` helper, existing UI classes.

**No database changes.** Coaching data is ephemeral via sessionStorage.

**No new sidebar item.** Discovered through mock interview results only.

## 10. Cost Model

- **1 non-streaming Gemini call** per coaching session
- Counts as **1 AI call** against user's plan (free: 20/mo, pro: 500/mo)
- Estimated cost: **~$0.03-0.08** per session (visible + thinking tokens)
- Only triggers when score < "Interview Ready" and user explicitly clicks
- No automatic triggers, no background calls

## 11. Testing Plan

- [ ] Score below 70 → coach CTA appears in results
- [ ] Score 71+ → coach CTA does NOT appear
- [ ] Click "Get Pro Answers" → navigates to coach page
- [ ] Coach page loads → loading spinner → coaching cards render
- [ ] Each card shows: question, score, user answer, pro answer, takeaways, phrases
- [ ] Pro answers reference the user's actual resume experiences
- [ ] Company-specific language visible when company is selected
- [ ] Skipped questions excluded from coaching
- [ ] Short interview (2 questions) → only 2 coaching cards
- [ ] Direct navigation to coach page with no data → error state with link
- [ ] "Back to Results" → results page renders correctly (sessionStorage restore)
- [ ] "Practice Another Interview" → fresh mock interview setup
- [ ] API error → error message with retry button
- [ ] Mobile layout → cards stack vertically, text readable
- [ ] AI call counted in usage tracking (verify in AI History)
