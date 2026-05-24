/* ============================================================
   ONBOARDING API — Save goal and referral source
   ============================================================
   POST /api/user/onboarding
   Saves the user's goal and how they found JobPilot.
   Called once during the onboarding wizard.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";

const onboardingSchema = z.object({
  goal: z.enum(["find-job", "optimize-resume", "career-change", "interview-prep"]),
  referralSource: z.enum([
    "google", "linkedin", "twitter", "tiktok", "reddit",
    "friend", "university", "youtube", "other",
  ]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      goal: parsed.data.goal,
      referralSource: parsed.data.referralSource,
    },
  });

  return NextResponse.json({ success: true });
}
