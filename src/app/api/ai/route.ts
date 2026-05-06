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
              maxOutputTokens: 8192,
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
      return `You are a senior career coach and ATS expert with 15 years of experience in hiring. Analyze this resume thoroughly.

IMPORTANT RULES:
- Use the ACTUAL content from the resume below — reference specific job titles, companies, skills, and achievements the candidate listed
- Never use generic placeholders like [Your Name] or [Company] — use what's in the resume
- Be specific and actionable in your feedback

Provide this EXACT structure:

## ATS Score: X/100
(Explain why this score — what's helping and hurting)

## Strengths
(List 3-5 specific things this resume does well, referencing actual content)

## Weaknesses
(List 3-5 specific problems with actionable fixes)

## Missing Keywords
(Industry-specific keywords they should add based on their target field)

## Formatting Issues
(ATS-specific problems: tables, headers, file format concerns)

## Priority Action Items
(Numbered list of the top 5 changes that would have the biggest impact, in order of importance)

Resume:
${payload.resume}`;

    case "optimize_resume":
      return `You are a professional resume writer. Optimize this resume for the job description below.

CRITICAL RULES:
- Use the candidate's REAL name, contact info, experience, and education from their resume
- NEVER use placeholders like [Your Name], [Company], [X years], or [quantify] — use actual data from the resume
- Keep all real details (dates, companies, job titles) — only improve the wording and keywords
- Inject relevant keywords from the job description naturally into bullet points
- Strengthen bullet points with action verbs and quantify achievements where data exists
- If the resume doesn't have a specific number, write the bullet without one — don't add fake brackets

STRUCTURE (follow this EXACT order):
1. # Name (from resume)
   Contact info on one line: Location • Phone • Email • LinkedIn
2. ## Professional Summary (3-4 sentences tailored to the target role)
3. ## Core Skills
   List as bullet points grouped by category, e.g.:
   - **Strategy & Operations:** Market Research, Strategic Planning, Business Development
   - **Marketing & Sales:** Campaign Management, Lead Generation, CRM
   - **Technical:** Python, SQL, Google Analytics, Microsoft Office
   (Group into 3-5 categories with 3-6 skills each)
4. ## Work Experience
   For EACH role: ### Job Title, Company, Location — Dates
   Then 4-6 bullet points starting with power verbs
5. ## Education
   For each entry: ### Degree, Institution, Location — Dates
6. ## Certifications and Trainings (if applicable, list each with institution and date)
7. ## Languages (each with proficiency level, e.g., English - Fluent, Burmese - Native)

Return the COMPLETE optimized resume in clean markdown format.

Resume:
${payload.resume}

Job Description:
${payload.jobDescription}`;

    case "rebuild_resume":
      return `You are an elite resume writer hired to rebuild this resume for a specific job.

CRITICAL RULES:
- Use the candidate's REAL name, contact info, education, and work history from their resume
- NEVER use placeholders like [Your Name], [Company Name], [City, State], [X years], or [quantify, e.g., 15-20%]
- Every piece of information must come from the original resume — do NOT invent experience or details
- If the resume lacks specific metrics, write strong bullet points without fake numbers
- Rewrite and reframe existing experience to align with the target job — but keep it truthful

STRUCTURE (follow this EXACT order):
1. # Name (from resume)
   Contact info on one line: Location • Phone • Email • LinkedIn
2. ## Professional Summary (3-4 sentences tailored to the target role)
3. ## Core Skills
   List as bullet points grouped by category, e.g.:
   - **Strategy & Operations:** Market Research, Strategic Planning, Business Development
   - **Marketing & Sales:** Campaign Management, Lead Generation, CRM
   - **Technical:** Python, SQL, Google Analytics, Microsoft Office
   (Group into 3-5 categories with 3-6 skills each)
4. ## Work Experience
   For EACH role use this exact format:
   ### Job Title, Company, Location — Dates
   - Bullet point with power verb
   - Bullet point with power verb
   (4-6 bullets per role)
5. ## Education
   For each entry: ### Degree, Institution, Location — Dates
6. ## Certifications and Trainings
   List each certification/training with institution and date
7. ## Languages
   List each language with proficiency level (e.g., English - Fluent, Burmese - Native)

Start every work experience bullet with a power action verb: Led, Spearheaded, Orchestrated, Engineered, Transformed, Accelerated, Streamlined, Delivered, etc.

Return the COMPLETE rebuilt resume in clean markdown — ready to copy and use.

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
      return `Write a compelling cover letter for this job application.

CRITICAL RULES:
- Use the candidate's REAL name and details from the resume — never use [Your Name] or placeholders
- Reference SPECIFIC achievements, projects, and skills from their actual resume
- Address it to the hiring team at the real company name provided
- Sound human and confident — not robotic or overly formal
- Show genuine enthusiasm for the specific role and company
- Keep it under 350 words — hiring managers skim
- End with a clear call to action

STRUCTURE:
1. Opening: Hook the reader — mention the specific role and why you're excited
2. Body (2 paragraphs): Connect your real experience to their job requirements
3. Closing: Express enthusiasm and request an interview

Return ONLY the cover letter — no commentary, no "Here's your cover letter" intro.

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
      return `You are a career transition specialist. This person wants to change careers.

CRITICAL RULES:
- Use the candidate's REAL name, contact info, and background from their resume
- NEVER use placeholders like [Your Name], [Company], [X years] — use actual data
- Do NOT invent experience — only reframe what actually exists
- Identify genuinely transferable skills from their background
- Be honest about the transition — don't pretend they have experience they don't

STRUCTURE (follow this EXACT order):
1. # Name (from resume)
   Contact info on one line: Location • Phone • Email • LinkedIn
2. ## Professional Summary
   Address the career change directly — 3-4 sentences showing how their background uniquely positions them for the target role
3. ## Core Skills
   List as bullet points grouped by category, e.g.:
   - **Transferable Skills:** Project Management, Stakeholder Communication, Data Analysis
   - **Target Industry:** Skills relevant to the new field
   - **Technical:** Tools and technologies
   (Group into 3-5 categories with 3-6 skills each)
4. ## Work Experience
   For EACH role use this exact format:
   ### Job Title, Company, Location — Dates
   - Bullet reframed for the target industry
   - Emphasize transferable skills relevant to the new field
   (4-6 bullets per role)
5. ## Education
   For each entry: ### Degree, Institution, Location — Dates
6. ## Certifications and Trainings
   List each certification/training with institution and date
7. ## Languages
   List each language with proficiency level (e.g., English - Fluent, Burmese - Native)

Return the COMPLETE rebuilt resume in clean markdown — ready to use, no placeholders.

Original Resume:
${payload.resume}

Target Role: ${payload.jobTitle}
Target Industry: ${payload.company}
Target Job Description: ${payload.jobDescription}`;

    case "linkedin_audit":
      return `You are a LinkedIn optimization expert and personal branding strategist. Audit this LinkedIn profile text and provide a comprehensive score and improvement plan.

IMPORTANT RULES:
- Use the person's ACTUAL name, headline, and content — never use placeholders
- Be specific — reference their actual experience and wording
- Score each section honestly, not generously

Provide this EXACT structure:

## LinkedIn Score: X/100

## Headline
**Current:** (quote their current headline)
**Score:** X/10
**Issues:** (what's wrong)
**Suggested Headline:** (write a specific improved headline using their real info)

## About / Summary
**Score:** X/10
**Issues:** (what's missing or weak)
**Suggestions:** (specific improvements with examples)

## Experience Section
**Score:** X/10
**Issues:** (vague bullets, missing metrics, weak verbs, etc.)
**Key Fixes:** (rewrite 2-3 of their weakest bullet points as examples)

## Skills & Endorsements
**Score:** X/10
**Suggestions:** (specific skills they should add based on their field)

## Recommendations
**Score:** X/10
**Suggestions:** (who to ask and how)

## Profile Completeness
**Missing Sections:** (list any missing: banner image, featured, volunteer, certifications, etc.)

## Top 5 Priority Actions
(Numbered list of the highest-impact changes they should make immediately)

LinkedIn Profile:
${payload.linkedinText}`;

    case "linkedin_rewrite":
      return `You are a LinkedIn copywriter and personal branding expert. Rewrite this person's LinkedIn profile sections to be compelling, keyword-rich, and optimized for recruiter search.

CRITICAL RULES:
- Use their REAL name, job titles, companies, and experience
- NEVER use placeholders like [Your Name] or [Industry]
- Write in first person for the About section
- Keep the tone professional but personable — not corporate-speak
- Inject relevant industry keywords naturally for LinkedIn SEO
- Quantify achievements where the original data supports it
${payload.targetRole ? `- Optimize for this target role: ${payload.targetRole}` : ""}

Provide this EXACT structure:

## Optimized Headline
(One powerful headline, max 220 characters)

## Optimized About
(3-4 paragraphs: hook, value proposition, key achievements, call to action)

## Optimized Experience
(Rewrite each role with 4-5 strong bullet points starting with action verbs)

## Recommended Skills
(List 15-20 relevant skills they should add to their profile, ordered by importance)

## Recommended Hashtags
(5-7 hashtags they should follow/use for visibility in their field)

LinkedIn Profile:
${payload.linkedinText}`;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/* ---- Plan Limits ---- */
/* Each plan has a maximum number of AI calls per month */
/* "unlimited" plans use -1 to indicate no cap */
const PLAN_LIMITS: Record<string, number> = {
  free: 3,        /* Free users get 3 AI calls per month */
  pro: 100,       /* Pro users get 100 AI calls per month */
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
    if (user.aiUsageCount >= limit) {
      return NextResponse.json(
        {
          error: `You've used all ${limit} AI calls for this month. Upgrade to Pro for more.`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    /* ---- Feature Gating ---- */
    /* Free users can only access Resume Analysis and Job Match */
    const FREE_ACTIONS = ["analyze_resume", "match_score"];
    if (user.plan === "free" && !FREE_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          error: "This feature is available on the Pro plan. Upgrade to unlock all 10 AI tools.",
          upgradeRequired: true,
        },
        { status: 403 }
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
    const remaining = limit - user.aiUsageCount - 1;
    return NextResponse.json({ result, remaining });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
