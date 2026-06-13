/* ============================================================
   EXTENSION QUICK MATCH API - Instant Keyword Match
   ============================================================
   GET /api/extension/quick-match?description=...
   Returns a fast keyword-based match score (no AI call).
   Compares JD keywords against the user's cached topSkills.
   Designed for real-time badge display (<200ms response).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { extensionCorsHeaders as corsHeaders } from "@/lib/extension-cors";
import { extractSkillsFromJD } from "@/lib/career-intelligence";

/* ---- OPTIONS: CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

/* ---- GET: Compute quick keyword match ---- */
export const GET = safeHandler(async (req: NextRequest) => {
  const origin = req.headers.get("origin");

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  const description = req.nextUrl.searchParams.get("description") || "";
  if (!description) {
    return NextResponse.json(
      { score: null, reason: "No description provided" },
      { headers: corsHeaders(origin) }
    );
  }

  try {
    /* Get user's cached skills */
    const user = await dbRetry(() => prisma.user.findUnique({
      where: { id: session.user.id },
      select: { topSkills: true },
    }));

    if (!user?.topSkills) {
      return NextResponse.json(
        { score: null, reason: "No resume analyzed yet" },
        { headers: corsHeaders(origin) }
      );
    }

    const userSkills: string[] = JSON.parse(user.topSkills);
    if (userSkills.length === 0) {
      return NextResponse.json(
        { score: null, reason: "No skills extracted" },
        { headers: corsHeaders(origin) }
      );
    }

    /* Extract skills from JD using keyword matching (fast, no AI) */
    const jdSkills = extractSkillsFromJD(description);

    if (jdSkills.length === 0) {
      return NextResponse.json(
        { score: 50, reason: "Could not extract skills from description" },
        { headers: corsHeaders(origin) }
      );
    }

    /* Compute overlap */
    const userLower = new Set(userSkills.map(s => s.toLowerCase()));
    const matching = jdSkills.filter(s => userLower.has(s.toLowerCase()));
    const score = Math.round((matching.length / jdSkills.length) * 100);

    return NextResponse.json(
      {
        score: Math.min(score, 100),
        matching: matching.length,
        total: jdSkills.length,
      },
      { headers: corsHeaders(origin) }
    );
  } catch (err) {
    console.error("[quick-match] Error:", err);
    return NextResponse.json(
      { score: null, reason: "Match failed" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
});
