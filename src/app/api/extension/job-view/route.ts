/* ============================================================
   EXTENSION JOB VIEW API - Passive Browse Tracking
   ============================================================
   POST /api/extension/job-view
   Records which job pages the user visits via the content script.
   Deduplicated by URL per user. Used for career intelligence
   insights like "You viewed 15 PM roles this week."
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { extensionCorsHeaders as corsHeaders } from "@/lib/extension-cors";
import { extensionJobViewSchema, formatZodError } from "@/lib/validations";
/* # Career intelligence functions — will be wired in when skill tracking is enabled */
import { extractSkillsFromJD as _extractSkillsFromJD, extractAndStoreJobSkills as _extractAndStoreJobSkills } from "@/lib/career-intelligence";

/* ---- OPTIONS: CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

/* ---- POST: Track a job page view ---- */
export const POST = safeHandler(async (req: NextRequest) => {
  const origin = req.headers.get("origin");

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  try {
    const body = await req.json();
    const parsed = extensionJobViewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const { title, company, url, source } = parsed.data;

    /* Upsert — update viewedAt if same URL already tracked */
    await dbRetry(() => prisma.jobView.upsert({
      where: {
        userId_url: {
          userId: session.user.id,
          url,
        },
      },
      update: { viewedAt: new Date() },
      create: {
        userId: session.user.id,
        title,
        company: company || "",
        url,
        source: source || "other",
      },
    }));

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(origin) }
    );
  } catch (err) {
    console.error("[job-view] Error:", err);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
});
