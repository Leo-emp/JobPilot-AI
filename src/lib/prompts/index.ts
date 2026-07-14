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
import { analyzeResume, optimizeResume, rebuildResume, deepTailor, matchScore, careerPivot, parseResumeFields } from "./resume";
import { coverLetter, interviewQuestions, interviewAnswer, interviewFeedback, mockInterviewRespond, mockInterviewStart, mockInterviewEvaluate, mockInterviewSummary } from "./interview";
import { linkedinAudit, linkedinRewrite, craftOutreach, linkedinContentStrategy } from "./linkedin";

export type { PromptParts } from "./shared";

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
    default: throw new Error(`Unknown action: ${action}`);
  }
}
