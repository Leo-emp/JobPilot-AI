/* ============================================================
   EXTENSION AI API - AI Tools from Chrome Extension
   ============================================================
   POST /api/extension/ai
   Proxies AI requests from the Chrome Extension to the main
   AI endpoint. Fetches the user's latest resume for context.
   Supports: match_score, cover_letter
   Includes CORS headers for cross-origin extension requests.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extensionAiSchema, formatZodError } from "@/lib/validations";

/* ---- Add CORS headers to response ---- */
function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (origin && origin.startsWith("chrome-extension://")) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

/* ---- OPTIONS: Handle CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/* ---- Gemini Model Fallback List ---- */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

/* ---- Call Gemini with automatic fallback ---- */
async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI features are not configured yet.");
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
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      );

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
      if (error instanceof Error && error.message.includes("429")) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw error;
    }
  }

  throw new Error("AI is at capacity. Please try again later.");
}

/* ---- POST: Run AI tool from extension ---- */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  /* Check authentication */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please log in to JobPilot AI first." },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  const body = await req.json();
  const parsed = extensionAiSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  const { action, description, jobTitle, company } = parsed.data;

  /* Fetch the user's most recent resume for AI context */
  const latestResume = await prisma.resume.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { content: true },
  });

  const resumeText = latestResume?.content || "No resume uploaded yet.";

  /* ---- Check usage limits ---- */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, aiUsageCount: true, usageResetDate: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404, headers: corsHeaders(origin) }
    );
  }

  /* Reset usage counter if needed */
  const now = new Date();
  if (user.usageResetDate < now) {
    const nextReset = new Date(now);
    nextReset.setMonth(nextReset.getMonth() + 1);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { aiUsageCount: 0, usageResetDate: nextReset },
    });
    user.aiUsageCount = 0;
  }

  const PLAN_LIMITS: Record<string, number> = { free: 3, pro: 100 };
  const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;

  if (user.aiUsageCount >= limit) {
    return NextResponse.json(
      { error: `You've used all ${limit} AI calls this month. Upgrade to Pro for more.` },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  /* ---- Build prompt based on action ---- */
  let prompt: string;

  if (action === "match_score") {
    prompt = `Analyze how well this resume matches the job description below.
Return a MATCH_SCORE: X/100 on the first line (just the number).
Then provide:
1. **Matching Skills** (what aligns)
2. **Missing Skills** (gaps to address)
3. **Recommendations** (how to improve the match)

Resume:
${resumeText}

Job Description:
${description}`;
  } else if (action === "cover_letter") {
    prompt = `Write a compelling cover letter for this job application.

CRITICAL RULES:
- Use the candidate's REAL name and details from the resume — never use [Your Name] or placeholders
- Reference SPECIFIC achievements, projects, and skills from their actual resume
- Sound human and confident — not robotic
- Keep it under 350 words

Resume:
${resumeText}

Job Title: ${jobTitle || "Not specified"}
Company: ${company || "Not specified"}
Job Description: ${description}`;
  } else {
    return NextResponse.json(
      { error: "Unsupported action. Use match_score or cover_letter." },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  try {
    const result = await callGemini(prompt);

    /* Increment usage counter */
    await prisma.user.update({
      where: { id: session.user.id },
      data: { aiUsageCount: { increment: 1 } },
    });

    return NextResponse.json(
      { result },
      { headers: corsHeaders(origin) }
    );
  } catch (error: unknown) {
    console.error("Extension AI error:", error);
    return NextResponse.json(
      { error: "AI is temporarily unavailable. Please try again in a moment." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
