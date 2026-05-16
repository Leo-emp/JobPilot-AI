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
import { callGemini, callGeminiMultimodal } from "@/lib/gemini";
import { buildPrompt } from "@/lib/prompts";
import { cacheDel } from "@/lib/redis";
import { audit } from "@/lib/audit";
import * as Sentry from "@sentry/nextjs";

/* ---- Admin Check ---- */
function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}

/* ---- Monthly Plan Limits ---- */
const PLAN_LIMITS: Record<string, number> = {
  free: 20,
  pro: 1000,
};

/* ---- Max input size ---- */
const MAX_PAYLOAD_SIZE = 50_000;
const MAX_MULTIMODAL_PAYLOAD_SIZE = 20_000_000;

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

    /* ---- Check admin status ---- */
    const admin = isAdmin(session.user.email);

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

    /* Build the prompt and call Gemini */
    const prompt = buildPrompt(action, payload);
    const result = isMultimodal
      ? await callGeminiMultimodal(prompt, payload.images)
      : await callGemini(prompt);

    /* Increment usage counter and invalidate plan cache */
    await dbRetry(() =>
      prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: { increment: 1 } },
      })
    );
    await cacheDel(`plan:${session.user.id}`);

    /* Calculate remaining calls */
    const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
    const remaining = admin ? "unlimited" : Math.max(0, limit - user.aiUsageCount - 1);

    return NextResponse.json({ result, remaining });
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
