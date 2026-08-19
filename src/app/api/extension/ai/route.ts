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
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { userPerMinute, userPerHour, ipPerMinute } from "@/lib/rate-limit";
import { extensionAiSchema, formatZodError } from "@/lib/validations";
import { extensionCorsHeaders as corsHeaders } from "@/lib/extension-cors";
import { checkGlobalDailyCap } from "@/lib/redis";
import { scrubPlaceholders } from "@/lib/ai-post-process";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { getEffectivePlan } from "@/lib/effective-plan";
import { cacheDel } from "@/lib/redis";
import { audit } from "@/lib/audit";

/* ---- OPTIONS: Handle CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/* ---- Max input size ---- */
const MAX_PAYLOAD_SIZE = 50_000;
const AI_TIMEOUT_MS = 25_000;
const MAX_RESUME_CHARS = 3000;
const MAX_DESC_CHARS = 2000;

/* ---- Gemini Model Fallback List ---- */
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-2.5-flash",
];

/* ---- Call Gemini with automatic fallback and timeout ---- */
async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI features are not configured yet.");
  }

  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

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
export const POST = safeHandler(async (req: NextRequest) => {
  const origin = req.headers.get("origin");

  /* Check authentication */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please log in to JobPilot AI first." },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  /* ---- Burst Rate Limiting ---- */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipCheck = await ipPerMinute.check(ip);
  if (!ipCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  const minuteCheck = await userPerMinute.check(session.user.id);
  if (!minuteCheck.allowed) {
    return NextResponse.json(
      { error: "Slow down! 6 requests per minute max." },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  const hourCheck = await userPerHour.check(session.user.id);
  if (!hourCheck.allowed) {
    return NextResponse.json(
      { error: "Hourly limit reached. Try again soon." },
      { status: 429, headers: corsHeaders(origin) }
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

  /* ---- Input size validation ---- */
  const payloadSize = JSON.stringify(body).length;
  if (payloadSize > MAX_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: "Input too large. Please shorten the job description." },
      { status: 413, headers: corsHeaders(origin) }
    );
  }

  /* Fetch the user's most recent resume for AI context */
  const latestResume = await dbRetry(() => prisma.resume.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { content: true },
  }));

  const resumeText = latestResume?.content || "No resume uploaded yet.";

  /* ---- Global Daily Cap ---- */
  const globalCheck = await checkGlobalDailyCap();
  if (!globalCheck.allowed) {
    return NextResponse.json(
      { error: "AI service has reached its daily capacity. Please try again tomorrow." },
      { status: 503, headers: corsHeaders(origin) }
    );
  }

  /* ---- Check usage limits ---- */
  const user = await dbRetry(() => prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, aiUsageCount: true, usageResetDate: true },
  }));

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404, headers: corsHeaders(origin) }
    );
  }

  /* # Resolve effective plan — considers org sponsorship */
  const effectivePlan = await getEffectivePlan(session.user.id);

  /* Reset usage counter if needed */
  const now = new Date();
  if (user.usageResetDate < now) {
    const nextReset = new Date(now);
    nextReset.setMonth(nextReset.getMonth() + 1);
    await dbRetry(() => prisma.user.update({
      where: { id: session.user.id },
      data: { aiUsageCount: 0, usageResetDate: nextReset },
    }));
    user.aiUsageCount = 0;
  }

  const limit = PLAN_LIMITS[effectivePlan] ?? PLAN_LIMITS.free;

  if (user.aiUsageCount >= limit) {
    return NextResponse.json(
      { error: `You've used all ${limit} AI calls this month. Upgrade to Pro for more.` },
      { status: 429, headers: corsHeaders(origin) }
    );
  }

  /* # Atomically increment BEFORE calling Gemini — prevents race condition */
  const updated = await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { aiUsageCount: { increment: 1 } },
      select: { aiUsageCount: true },
    })
  );
  if (updated.aiUsageCount > limit) {
    await dbRetry(() =>
      prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: { decrement: 1 } },
      })
    );
    audit("ai.limit.reached", { userId: session.user.id, plan: effectivePlan, action, detail: "extension_concurrent_race" });
    return NextResponse.json(
      { error: "You've reached your monthly AI limit." },
      { status: 429, headers: corsHeaders(origin) }
    );
  }
  await cacheDel(`plan:${session.user.id}`);

  /* ---- Trim inputs for speed ---- */
  const trimmedResume = resumeText.slice(0, MAX_RESUME_CHARS);
  const trimmedDesc = (description || "").slice(0, MAX_DESC_CHARS);

  /* ---- Build prompt based on action ---- */
  let prompt: string;

  if (action === "match_score") {
    prompt = `Analyze how well this resume matches the job. Be concise.
Return MATCH_SCORE: X/100 on the first line.
Then 3 short bullet lists:
1. **Matching Skills**
2. **Missing Skills**
3. **Recommendations**

Resume:
${trimmedResume}

Job Description:
${trimmedDesc}`;
  } else if (action === "cover_letter") {
    prompt = `Write a compelling cover letter for this job application.

CRITICAL RULES:
- Use the candidate's REAL name and details from the resume — never use [Your Name] or placeholders
- Reference SPECIFIC achievements, projects, and skills from their actual resume
- Sound human and confident — not robotic
- Keep it under 350 words

Resume:
${trimmedResume}

Job Title: ${jobTitle || "Not specified"}
Company: ${company || "Not specified"}
Job Description: ${trimmedDesc}`;
  } else {
    return NextResponse.json(
      { error: "Unsupported action. Use match_score or cover_letter." },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  try {
    const raw = await callGemini(prompt);
    const result = scrubPlaceholders(raw);

    /* # Usage already incremented atomically above */

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
});
