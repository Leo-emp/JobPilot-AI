/* ============================================================
   AI STREAMING ROUTE - Token-by-token AI responses
   ============================================================
   POST /api/ai/stream — same auth/rate-limiting as /api/ai
   but returns a streaming response instead of waiting for the
   full result. The frontend sees text appear in real-time.
   ============================================================ */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { userPerMinute, userPerHour, ipPerMinute } from "@/lib/rate-limit";
import { aiSchema, formatZodError } from "@/lib/validations";
import { streamGemini, streamGeminiMultimodal, type StreamResult } from "@/lib/gemini-stream";
import { scrubPlaceholders } from "@/lib/ai-post-process";
import { buildPrompt } from "@/lib/prompts";
import { cacheDel, checkGlobalDailyCap } from "@/lib/redis";
import { audit } from "@/lib/audit";
import * as Sentry from "@sentry/nextjs";

const PLAN_LIMITS: Record<string, number> = { free: 20, pro: 1000 };
const MAX_PAYLOAD_SIZE = 50_000;
const MAX_MULTIMODAL_PAYLOAD_SIZE = 20_000_000;

function buildHistoryTitle(action: string, payload: Record<string, unknown>): string {
  const job = (payload.jobTitle || payload.role || "") as string;
  const company = (payload.company || payload.recipientCompany || "") as string;
  const label = action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  if (job && company) return `${label} — ${job} at ${company}`;
  if (job) return `${label} — ${job}`;
  if (company) return `${label} — ${company}`;
  return label;
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return jsonError("Please log in to use AI features.", 401);
    }

    const body = await req.json();
    const parsed = aiSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400);
    }

    const action = parsed.data.action;
    const payload = parsed.data.payload as Record<string, unknown>;

    /* Input size validation */
    const isMultimodal = action === "linkedin_audit" && Array.isArray(payload.images) && (payload.images as unknown[]).length > 0;
    const sizeLimit = isMultimodal ? MAX_MULTIMODAL_PAYLOAD_SIZE : MAX_PAYLOAD_SIZE;
    if (JSON.stringify(payload).length > sizeLimit) {
      return jsonError(isMultimodal ? "Images too large." : "Input too large.", 413);
    }

    const admin = session.user.isAdmin;

    /* Rate limiting (skip for admins) */
    if (!admin) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const ipCheck = await ipPerMinute.check(ip);
      if (!ipCheck.allowed) return jsonError("Too many requests. Please wait.", 429);

      const minuteCheck = await userPerMinute.check(session.user.id);
      if (!minuteCheck.allowed) return jsonError("Slow down! 6 requests per minute max.", 429);

      const hourCheck = await userPerHour.check(session.user.id);
      if (!hourCheck.allowed) return jsonError("Hourly limit reached. Try again soon.", 429);
    }

    /* ---- Global Daily Cap ---- */
    const globalCheck = await checkGlobalDailyCap();
    if (!globalCheck.allowed) {
      return jsonError("AI service has reached its daily capacity. Please try again tomorrow.", 503);
    }

    /* Usage limit check */
    const user = await dbRetry(() =>
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, aiUsageCount: true, usageResetDate: true, email: true },
      })
    );

    if (!user) return jsonError("User not found.", 404);

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

    /* Enforce plan limits */
    if (!admin) {
      const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
      if (user.aiUsageCount >= limit) {
        const msg = user.plan === "free"
          ? `You've used all ${limit} free AI calls this month. Upgrade to Pro for 1,000/month.`
          : `Monthly limit of ${limit} reached.`;
        audit("ai.limit.reached", { userId: session.user.id, plan: user.plan, action });
        return jsonError(msg, 429);
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
      } catch { /* Non-critical */ }
    }

    /* Build prompt and get stream */
    const prompt = buildPrompt(action, payload);
    const gemini: StreamResult = isMultimodal
      ? await streamGeminiMultimodal(prompt, payload.images as { data: string; mimeType: string }[])
      : await streamGemini(prompt);

    /* Increment usage (don't wait for stream to finish) */
    dbRetry(() =>
      prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: { increment: 1 } },
      })
    ).then(() => cacheDel(`plan:${session.user.id}`)).catch(() => {});

    /* Collect full text for history saving, while streaming to client */
    const encoder = new TextEncoder();
    const reader = gemini.stream.getReader();
    let fullText = "";

    const outputStream = new ReadableStream({
      async pull(ctrl) {
        const { done, value } = await reader.read();
        if (done) {
          /* Save to AI history with model info after stream completes */
          const title = buildHistoryTitle(action, payload);
          const cleaned = scrubPlaceholders(fullText);
          prisma.aiResult.create({
            data: { userId: session.user.id, action, title, result: cleaned, model: gemini.model },
          }).catch(() => {});

          ctrl.close();
          return;
        }
        const text = new TextDecoder().decode(value);
        fullText += text;
        ctrl.enqueue(encoder.encode(text));
      },
      cancel() {
        reader.cancel();
      },
    });

    return new Response(outputStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    Sentry.captureException(error, { tags: { component: "ai_stream_route" } });
    console.error("AI stream error:", error);
    return jsonError("AI is temporarily unavailable. Please try again.", 500);
  }
}
