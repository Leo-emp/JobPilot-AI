/* ============================================================
   PROMPT MODULE INDEX
   ============================================================
   Re-exports buildPrompt and PromptParts for external consumers.
   Internal prompt functions are organized by domain:
   - resume.ts: analyze, optimize, rebuild, match, career pivot, parse
   - interview.ts: questions, answers, feedback, mock interview, cover letter
   - linkedin.ts: audit, rewrite, outreach, content strategy
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { RESUME_SYSTEM, SCORING_SYSTEM } from "./shared";
import { analyzeResume, optimizeResume, rebuildResume, deepTailor, matchScore, careerPivot, parseResumeFields, createResume } from "./resume";
import { coverLetter, interviewQuestions, interviewAnswer, interviewFeedback, mockInterviewRespond, mockInterviewStart, mockInterviewEvaluate, mockInterviewSummary, resignationLetter } from "./interview";
import { linkedinAudit, linkedinRewrite, craftOutreach, linkedinContentStrategy } from "./linkedin";
import { careerChangeQuiz, careerPersonalityQuiz, stayOrQuitQuiz } from "./quizzes";
import { optimizeResumeCountry, rebuildResumeCountry, deepTailorCountry, careerPivotCountry, createResumeCountry } from "./resume-country";
import type { ResumeCountry } from "./resume-country";

export type { PromptParts } from "./shared";

/* ---- FAQ AI fallback system prompt ---- */
/* # Provides product knowledge so the AI can answer questions about JobPilot AI */
const FAQ_SYSTEM = `You are a helpful customer support assistant for JobPilot AI — an AI-powered career platform.
Answer questions accurately, concisely, and helpfully. Keep responses under 150 words.
If you don't know the answer, say so and suggest contacting support@jobpilotai.co.

Key product facts:
- Free plan: 20 AI calls/month, all features. Pro plan: 500 AI calls/month.
- Features: AI resume analysis/optimization/rebuild, cover letter generator, interview prep, mock interviews, LinkedIn optimizer, job search, application tracker, networking CRM, portfolio builder, Chrome extension.
- Country-specific resumes: US (1 page, centered), UK (2 pages, CV format), AU (2-3 pages).
- Resume modes: Optimize (improve existing), Rebuild (from scratch), Deep Tailor (thorough alignment), Career Pivot (change industries).
- Security: TLS, bcrypt, JWT, encrypted database, GDPR/CCPA compliant, 2FA available, data export available.
- Payments: Stripe (Visa, MC, Amex). Cancel anytime, no refunds — free tier lets users try everything first.
- Rate limits: 6/minute, 40/hour. AI timeout: 60 seconds.
- Support: support@jobpilotai.co or /contact page.
- AI model: Google Gemini with automatic fallback chain.
- Chrome extension: saves jobs from 40+ sites automatically.
- Portfolio: templates with public URL, responsive.
- Data: resume text processed ephemerally (not stored), AI results saved to history, full data export, 30-day deletion window.
Do NOT make up features that don't exist. Do NOT promise specific upcoming features.`;

/* ---- FAQ answer prompt builder ---- */
function faqAnswer(payload: Record<string, any>): string {
  const question = payload.question || "How does JobPilot AI work?";
  return `User question: ${question}\n\nAnswer this question about JobPilot AI helpfully and concisely.`;
}

export function buildPrompt(action: string, payload: Record<string, any>): import("./shared").PromptParts {
  switch (action) {
    case "analyze_resume": return { prompt: analyzeResume(payload) };
    case "optimize_resume": return { system: RESUME_SYSTEM, prompt: optimizeResume(payload) };
    case "rebuild_resume": return { system: RESUME_SYSTEM, prompt: rebuildResume(payload) };
    case "deep_tailor": return { system: RESUME_SYSTEM, prompt: deepTailor(payload) };
    case "match_score": return { prompt: matchScore(payload) };
    case "cover_letter": return { prompt: coverLetter(payload) };
    case "interview_questions": return { prompt: interviewQuestions(payload) };
    case "interview_answer": return { prompt: interviewAnswer(payload) };
    case "interview_feedback": return { prompt: interviewFeedback(payload) };
    case "career_pivot": return { system: RESUME_SYSTEM, prompt: careerPivot(payload) };
    case "linkedin_audit": return { prompt: linkedinAudit(payload) };
    case "linkedin_rewrite": return { prompt: linkedinRewrite(payload) };
    case "mock_interview_respond": return { prompt: mockInterviewRespond(payload) };
    case "mock_interview_start": return { prompt: mockInterviewStart(payload) };
    case "mock_interview_evaluate": return { prompt: mockInterviewEvaluate(payload) };
    case "mock_interview_summary": return { prompt: mockInterviewSummary(payload) };
    case "craft_outreach": return { prompt: craftOutreach(payload) };
    case "linkedin_content_strategy": return { prompt: linkedinContentStrategy(payload) };
    case "parse_resume_fields": return { prompt: parseResumeFields(payload) };

    /* Create resume from scratch — no existing resume needed */
    case "create_resume": return { system: RESUME_SYSTEM, prompt: createResume(payload) };
    case "create_resume_us": return createResumeCountry(payload, "us");
    case "create_resume_uk": return createResumeCountry(payload, "uk");
    case "create_resume_au": return createResumeCountry(payload, "au");

    /* Country-specific resume actions — completely separate prompt system */
    case "optimize_resume_us": return optimizeResumeCountry(payload, "us");
    case "optimize_resume_uk": return optimizeResumeCountry(payload, "uk");
    case "optimize_resume_au": return optimizeResumeCountry(payload, "au");
    case "rebuild_resume_us": return rebuildResumeCountry(payload, "us");
    case "rebuild_resume_uk": return rebuildResumeCountry(payload, "uk");
    case "rebuild_resume_au": return rebuildResumeCountry(payload, "au");
    case "deep_tailor_us": return deepTailorCountry(payload, "us");
    case "deep_tailor_uk": return deepTailorCountry(payload, "uk");
    case "deep_tailor_au": return deepTailorCountry(payload, "au");
    case "career_pivot_us": return careerPivotCountry(payload, "us");
    case "career_pivot_uk": return careerPivotCountry(payload, "uk");
    case "career_pivot_au": return careerPivotCountry(payload, "au");

    /* Career tools */
    case "resignation_letter": return { prompt: resignationLetter(payload) };

    /* Career quizzes & assessments */
    case "career_change_quiz": return { prompt: careerChangeQuiz(payload) };
    case "career_personality_quiz": return { prompt: careerPersonalityQuiz(payload) };
    case "stay_or_quit_quiz": return { prompt: stayOrQuitQuiz(payload) };

    /* Help widget AI fallback — answers user questions about JobPilot AI */
    case "faq_answer": return { system: FAQ_SYSTEM, prompt: faqAnswer(payload) };

    default: throw new Error(`Unknown action: ${action}`);
  }
}
