/* ============================================================
   AI API ROUTE - Google Gemini AI Endpoint
   ============================================================
   Handles POST requests to /api/ai
   Accepts an action type and payload, calls Gemini AI,
   and returns the AI response. Protected — requires auth session.

   Supported actions:
   - analyze_resume: Analyze a resume for ATS compatibility
   - optimize_resume: Quick-optimize a resume for a job
   - rebuild_resume: Full resume rebuild for a specific job
   - match_score: Calculate job match percentage
   - cover_letter: Generate a tailored cover letter
   - interview_questions: Predict interview questions
   - interview_answer: Generate an answer to a question
   - career_pivot: Rebuild resume for a career change
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- Gemini Model Fallback List ---- */
/* If the primary model hits a rate limit (429), we try the next one */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

/* ---- Call Gemini API with Automatic Fallback ---- */
/* Tries each model in order. If one returns 429 (rate limited), */
/* waits 2 seconds and tries the next model in the list. */
async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      /* If rate limited, try the next model */
      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Gemini API error");
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error: unknown) {
      /* If it's a rate limit issue, try next model */
      if (error instanceof Error && error.message.includes("429")) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw error;
    }
  }

  throw new Error("All AI models are currently at capacity. Please try again later.");
}

/* ---- Build Prompt Based on Action Type ---- */
/* Each action has a specific prompt template optimized for that task */
function buildPrompt(action: string, payload: Record<string, string>): string {
  switch (action) {
    case "analyze_resume":
      return `You are a professional resume analyst and ATS expert. Analyze this resume and provide:
1. **ATS Score** (0-100) with explanation
2. **Strengths** (what's working well)
3. **Weaknesses** (what needs improvement)
4. **Missing Keywords** for the industry
5. **Formatting Issues** that might trip up ATS systems
6. **Action Items** (specific, prioritized improvements)

Resume:
${payload.resume}`;

    case "optimize_resume":
      return `You are an ATS optimization expert. Optimize this resume for the following job description.
Improve keyword matching, strengthen bullet points with action verbs, and ensure ATS compatibility.
Return the COMPLETE optimized resume in clean markdown format.

Resume:
${payload.resume}

Job Description:
${payload.jobDescription}`;

    case "rebuild_resume":
      return `You are an expert resume writer. Completely rebuild this resume to perfectly target the job below.

RULES:
- Use this EXACT structure: Contact Info → Professional Summary → Core Competencies → Professional Experience → Education → Certifications
- Start EVERY bullet point with a POWER ACTION VERB (Led, Spearheaded, Orchestrated, Engineered, Transformed, Accelerated, etc.)
- Inject keywords from the job description naturally throughout
- Quantify achievements with numbers, percentages, dollar amounts wherever possible
- Keep it to 1-2 pages maximum
- Make it ATS-friendly: no tables, no graphics, clean formatting
- Return the COMPLETE rebuilt resume in clean markdown format

Original Resume:
${payload.resume}

Target Job:
Title: ${payload.jobTitle}
Company: ${payload.company}
Description: ${payload.jobDescription}`;

    case "match_score":
      return `Analyze how well this resume matches the job description below.
Return a MATCH_SCORE: X/100 on the first line (just the number).
Then provide:
1. **Matching Skills** (what aligns)
2. **Missing Skills** (gaps to address)
3. **Recommendations** (how to improve the match)

Resume:
${payload.resume}

Job Description:
${payload.jobDescription}`;

    case "cover_letter":
      return `Write a professional, compelling cover letter for this job application.
Make it personalized, confident, and specific to the role.
Reference relevant experience from the resume.
Keep it under 400 words. Use a modern, professional tone — not overly formal.
Return only the cover letter text (no extra commentary).

Resume:
${payload.resume}

Job Title: ${payload.jobTitle}
Company: ${payload.company}
Job Description: ${payload.jobDescription}`;

    case "interview_questions":
      return `You are an interview preparation expert. Based on this job description, predict the 10 most likely interview questions.
Include a mix of:
- Technical/skill-based questions
- Behavioral questions (STAR method)
- Company/role-specific questions
- Culture fit questions

For each question, provide a brief note on what the interviewer is looking for.

Job Title: ${payload.jobTitle}
Company: ${payload.company}
Job Description: ${payload.jobDescription}`;

    case "interview_answer":
      return `You are an interview coach. Help craft a strong answer to this interview question.
Use the STAR method (Situation, Task, Action, Result) where applicable.
Base the answer on the candidate's actual experience from their resume.
Make it natural and conversational, not robotic.

Question: ${payload.question}

Candidate's Resume:
${payload.resume}

Job Description:
${payload.jobDescription}`;

    case "career_pivot":
      return `You are a career transition specialist. This person is changing careers.
Rebuild their resume to target a completely different role.

FOCUS ON:
- Transferable skills that apply to the new field
- Reframing past experience to show relevance
- Adding a "Professional Development" section if they have relevant coursework/certifications
- A strong Professional Summary that addresses the career change transparently
- Keep it honest — don't fabricate experience

Original Resume:
${payload.resume}

Target Role: ${payload.jobTitle}
Target Industry: ${payload.company}
Target Job Description: ${payload.jobDescription}

Return the COMPLETE rebuilt resume in clean markdown format.`;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/* ---- Plan Limits ---- */
/* Each plan has a maximum number of AI calls per month */
/* "unlimited" plans use -1 to indicate no cap */
const PLAN_LIMITS: Record<string, number> = {
  free: 3,        /* Free users get 3 AI calls per month */
  pro: -1,        /* Pro users get unlimited AI calls */
  enterprise: -1, /* Enterprise users get unlimited AI calls */
};

/* ---- Main POST Handler ---- */
export async function POST(req: NextRequest) {
  try {
    /* Check authentication — user must be logged in */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to use AI features." },
        { status: 401 }
      );
    }

    /* Parse request body */
    const { action, payload } = await req.json();

    if (!action || !payload) {
      return NextResponse.json(
        { error: "Action and payload are required." },
        { status: 400 }
      );
    }

    /* ---- Usage Limit Check ---- */
    /* Fetch the user's current plan and usage from the database */
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, aiUsageCount: true, usageResetDate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    /* Check if usage counter needs a monthly reset */
    /* If the reset date is in the past, reset the counter to 0 */
    const now = new Date();
    if (user.usageResetDate < now) {
      /* Calculate next reset date (1 month from now) */
      const nextReset = new Date(now);
      nextReset.setMonth(nextReset.getMonth() + 1);

      await prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: 0, usageResetDate: nextReset },
      });
      user.aiUsageCount = 0;
    }

    /* Check if user has exceeded their plan limit */
    const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
    if (limit !== -1 && user.aiUsageCount >= limit) {
      return NextResponse.json(
        {
          error: `You've used all ${limit} AI calls for this month. Upgrade to Pro for unlimited access.`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    /* Build the prompt and call Gemini */
    const prompt = buildPrompt(action, payload);
    const result = await callGemini(prompt);

    /* ---- Increment Usage Counter ---- */
    /* Only count successful AI calls (don't charge for errors) */
    await prisma.user.update({
      where: { id: session.user.id },
      data: { aiUsageCount: { increment: 1 } },
    });

    /* Return the result along with remaining usage info */
    const remaining = limit === -1 ? "unlimited" : limit - user.aiUsageCount - 1;
    return NextResponse.json({ result, remaining });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
