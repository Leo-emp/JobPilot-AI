/* ============================================================
   AI API ROUTE - Google Gemini AI Endpoint
   ============================================================
   POST /api/ai — accepts action + payload, calls Gemini, returns result.
   Protected: requires auth session.
   Rate limited: per-IP, per-user/min, per-user/hour.
   Usage capped: free (20/mo), pro (1000/mo), admin (unlimited).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { userPerMinute, userPerHour, ipPerMinute } from "@/lib/rate-limit";
import { aiSchema, formatZodError } from "@/lib/validations";
import { callGemini, callGeminiMultimodal, type GeminiResult } from "@/lib/gemini";
import { scrubPlaceholders } from "@/lib/ai-post-process";
import { buildPrompt } from "@/lib/prompts";
import { cacheDel, checkGlobalDailyCap } from "@/lib/redis";
import { audit } from "@/lib/audit";
import * as Sentry from "@sentry/nextjs";

/* ---- Monthly Plan Limits ---- */
const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 1000,
};

/* ---- Max input size ---- */
const MAX_PAYLOAD_SIZE = 50_000;
const MAX_MULTIMODAL_PAYLOAD_SIZE = 20_000_000;

/* ---- Build a human-readable title for AI history ---- */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function buildHistoryTitle(action: string, payload: Record<string, any>): string {
  const job = payload.jobTitle || payload.role || "";
  const company = payload.company || payload.recipientCompany || "";
  const label = action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  if (job && company) return `${label} — ${job} at ${company}`;
  if (job) return `${label} — ${job}`;
  if (company) return `${label} — ${company}`;
  return label;
}

/* ---- Main POST Handler ---- */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to use AI features." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = aiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const action = parsed.data.action;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const payload = parsed.data.payload as Record<string, any>;

    /* ---- Input size validation ---- */
    const isMultimodal = action === "linkedin_audit" && payload.images?.length > 0;
    const sizeLimit = isMultimodal ? MAX_MULTIMODAL_PAYLOAD_SIZE : MAX_PAYLOAD_SIZE;
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > sizeLimit) {
      return NextResponse.json(
        { error: isMultimodal ? "Images too large. Please use smaller screenshots." : "Input too large. Please shorten your resume or job description." },
        { status: 413 }
      );
    }

    /* ---- Check admin status (set in JWT by auth.ts) ---- */
    const admin = session.user.isAdmin;

    /* ---- Burst Rate Limiting (skip for admins) ---- */
    if (!admin) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const ipCheck = await ipPerMinute.check(ip);
      if (!ipCheck.allowed) {
        return NextResponse.json(
          { error: "Too many requests from this network. Please wait a moment." },
          { status: 429, headers: { "Retry-After": String(Math.ceil(ipCheck.resetIn / 1000)) } }
        );
      }

      const minuteCheck = await userPerMinute.check(session.user.id);
      if (!minuteCheck.allowed) {
        return NextResponse.json(
          { error: "Slow down! You can make 6 AI requests per minute." },
          { status: 429, headers: { "Retry-After": String(Math.ceil(minuteCheck.resetIn / 1000)) } }
        );
      }

      const hourCheck = await userPerHour.check(session.user.id);
      if (!hourCheck.allowed) {
        return NextResponse.json(
          { error: "You've hit the hourly limit (40 requests). Take a break and come back shortly." },
          { status: 429, headers: { "Retry-After": String(Math.ceil(hourCheck.resetIn / 1000)) } }
        );
      }
    }

    /* ---- Global Daily Cap — circuit breaker across all users ---- */
    const globalCheck = await checkGlobalDailyCap();
    if (!globalCheck.allowed) {
      return NextResponse.json(
        { error: "AI service has reached its daily capacity. Please try again tomorrow." },
        { status: 503 }
      );
    }

    /* ---- Usage Limit Check ---- */
    const user = await dbRetry(() =>
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, aiUsageCount: true, usageResetDate: true, email: true },
      })
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    /* Reset monthly counter if needed */
    const now = new Date();
    if (user.usageResetDate < now) {
      const nextReset = new Date(now);
      nextReset.setMonth(nextReset.getMonth() + 1);
      await dbRetry(() =>
        prisma.user.update({
          where: { id: session.user.id },
          data: { aiUsageCount: 0, usageResetDate: nextReset },
        })
      );
      user.aiUsageCount = 0;
      await cacheDel(`plan:${session.user.id}`);
    }

    /* Enforce limits for non-admin users */
    if (!admin) {
      const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
      if (user.aiUsageCount >= limit) {
        const upgradeMsg = user.plan === "free"
          ? `You've used all ${limit} free AI calls this month. Upgrade to Pro for 1,000 calls/month.`
          : `You've reached your monthly limit of ${limit} calls. Contact support if you need more.`;
        audit("ai.limit.reached", { userId: session.user.id, plan: user.plan, action });
        return NextResponse.json(
          { error: upgradeMsg },
          { status: 429 }
        );
      }
    }

    /* Inject career intelligence context for relevant actions */
    const contextActions = ["optimize_resume", "rebuild_resume", "career_pivot", "cover_letter", "interview_questions"];
    if (contextActions.includes(action)) {
      try {
        const userData = await prisma.user.findUnique({ where: { id: session.user.id }, select: { topSkills: true } });
        const topSkills: string[] = userData?.topSkills ? JSON.parse(userData.topSkills) : [];
        if (topSkills.length > 0) {
          const savedJobs = await prisma.savedJob.findMany({ where: { userId: session.user.id, requiredSkills: { not: null } }, select: { requiredSkills: true }, take: 20 });
          const jobSkillCounts = new Map<string, number>();
          for (const j of savedJobs) {
            const skills: string[] = JSON.parse(j.requiredSkills!);
            for (const s of skills) jobSkillCounts.set(s, (jobSkillCounts.get(s) || 0) + 1);
          }
          const userLower = new Set(topSkills.map(s => s.toLowerCase()));
          const gaps = [...jobSkillCounts.entries()].filter(([s]) => !userLower.has(s.toLowerCase())).sort((a, b) => b[1] - a[1]).slice(0, 5);
          const parts: string[] = [];
          parts.push(`User's skills: ${topSkills.slice(0, 15).join(", ")}`);
          if (gaps.length > 0) parts.push(`Top skill gaps (missing from resume but requested in jobs): ${gaps.map(([s, c]) => `${s} (${c} jobs)`).join(", ")}`);
          payload.careerContext = parts.join("\n");
        }
      } catch { /* Non-critical — proceed without context */ }
    }

    /* Build the prompt and call Gemini */
    const prompt = buildPrompt(action, payload);
    const scoringActions = ["analyze_resume", "linkedin_audit"];
    const temp = scoringActions.includes(action) ? 0 : 0.7;
    const gemini: GeminiResult = isMultimodal
      ? await callGeminiMultimodal(prompt, payload.images)
      : await callGemini(prompt, temp);

    const result = scrubPlaceholders(gemini.text);

    /* Increment usage counter and invalidate plan cache */
    await dbRetry(() =>
      prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: { increment: 1 } },
      })
    );
    await cacheDel(`plan:${session.user.id}`);

    /* Save to AI history with model info (non-blocking) */
    const title = buildHistoryTitle(action, payload);
    prisma.aiResult.create({
      data: { userId: session.user.id, action, title, result, model: gemini.model },
    }).catch(() => {});

    /* Calculate remaining calls */
    const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
    const remaining = admin ? "unlimited" : Math.max(0, limit - user.aiUsageCount - 1);

    return NextResponse.json({ result, remaining, model: gemini.model });
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: { component: "ai_route" },
    });
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "AI is temporarily unavailable. Please try again in a moment." },
      { status: 500 }
    );
  }
}
