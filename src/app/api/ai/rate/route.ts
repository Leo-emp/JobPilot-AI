/* ============================================================
   AI RATING ENDPOINT — Thumbs up/down on AI results
   ============================================================
   PATCH /api/ai/rate — saves user feedback on AI output quality.
   Used to identify which prompts/models produce good results.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { resultId, rating } = body;

  if (!resultId || typeof rating !== "boolean") {
    return NextResponse.json({ error: "resultId (string) and rating (boolean) required." }, { status: 400 });
  }

  const record = await prisma.aiResult.findFirst({
    where: { id: resultId, userId: session.user.id },
    select: { id: true },
  });

  if (!record) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }

  await prisma.aiResult.update({
    where: { id: resultId },
    data: { rating },
  });

  return NextResponse.json({ ok: true });
}
