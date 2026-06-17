/* ============================================================
   ONBOARDING API — Save goal and referral source
   ============================================================
   POST /api/user/onboarding
   Saves the user's goal and how they found JobPilot.
   Called once during the onboarding wizard.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

const onboardingSchema = z.object({
  goal: z.enum(["find-job", "optimize-resume", "career-change", "interview-prep"]),
  referralSource: z.enum([
    "google", "linkedin", "twitter", "tiktok", "reddit",
    "friend", "university", "youtube", "other",
  ]),
});

export const POST = authHandler(async (req, session) => {

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        goal: parsed.data.goal,
        referralSource: parsed.data.referralSource,
      },
    })
  );

  return NextResponse.json({ success: true });
});
