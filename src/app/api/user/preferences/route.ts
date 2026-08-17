/* ============================================================
   CANDIDATE PREFERENCES — GET/PUT /api/user/preferences
   ============================================================
   Stores a candidate's job search preferences for matching with
   employer roles. Upsert pattern — creates on first save.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { candidatePreferenceSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { matchCandidateToAllRoles } from "@/lib/batch-matching";

/* # GET: fetch current preferences */
export const GET = authHandler(async (_req, session) => {
  const prefs = await dbRetry(() =>
    prisma.candidatePreference.findUnique({
      where: { userId: session.user.id },
    })
  );

  /* # Return empty defaults if none saved yet */
  if (!prefs) {
    return NextResponse.json({
      preferences: {
        openToWork: false,
        desiredTitle: null,
        desiredSkills: null,
        locationPref: "remote",
        locations: null,
        salaryMin: null,
        salaryCurrency: "USD",
        employmentType: "full-time",
        industries: null,
        companySizes: null,
      },
    });
  }

  return NextResponse.json({ preferences: prefs });
});

/* # PUT: upsert preferences */
export const PUT = authHandler(async (req: NextRequest, session) => {
  const body = await req.json();
  const parsed = candidatePreferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Upsert — create if missing, update if exists */
  const prefs = await dbRetry(() =>
    prisma.candidatePreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...parsed.data,
      },
      update: parsed.data,
    })
  );

  /* # Re-match against all active roles when preferences change (non-blocking) */
  if (parsed.data.openToWork !== false) {
    matchCandidateToAllRoles(session.user.id).catch(() => {});
  }

  return NextResponse.json({ preferences: prefs });
});
