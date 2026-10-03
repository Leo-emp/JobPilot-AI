/* ============================================================
   WORKSHOP PROGRESS API — Save User Progress
   ============================================================
   # POST: Upsert progress for a section (complete, bookmark, notes, quiz)
   # GET:  Fetch all progress for the current user (optional workshopSlug filter)
   # Authenticated — requires valid session.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { z } from "zod";

/* # Validation schema for progress updates */
const progressSchema = z.object({
  sectionId: z.string().min(1),
  completed: z.boolean().optional(),
  completedAt: z.string().nullable().optional(),
  bookmarked: z.boolean().optional(),
  notes: z.string().optional(),
  quizScore: z.number().int().min(0).optional(),
  quizAnswers: z.string().optional(),
});

export async function POST(req: NextRequest) {
  /* # Authenticate */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Parse and validate body */
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { sectionId, completed, completedAt, bookmarked, notes, quizScore, quizAnswers } = parsed.data;

  /* # Verify the section exists — catch table-not-found errors */
  let section;
  try {
    section = await dbRetry(() =>
      prisma.workshopSection.findUnique({ where: { id: sectionId }, select: { id: true } })
    );
  } catch {
    return NextResponse.json({ error: "Workshop tables not available" }, { status: 503 });
  }

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  /* # Build the update data (only include provided fields) */
  const updateData: Record<string, unknown> = {};
  if (completed !== undefined) updateData.completed = completed;
  if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null;
  if (bookmarked !== undefined) updateData.bookmarked = bookmarked;
  if (notes !== undefined) updateData.notes = notes;
  if (quizScore !== undefined) updateData.quizScore = quizScore;
  if (quizAnswers !== undefined) updateData.quizAnswers = quizAnswers;

  /* # Upsert: create if not exists, update if exists */
  const progress = await dbRetry(() =>
    prisma.workshopProgress.upsert({
      where: {
        userId_sectionId: { userId: session.user.id, sectionId },
      },
      create: {
        userId: session.user.id,
        sectionId,
        completed: completed ?? false,
        completedAt: completedAt ? new Date(completedAt) : completed ? new Date() : null,
        bookmarked: bookmarked ?? false,
        notes: notes ?? null,
        quizScore: quizScore ?? null,
        quizAnswers: quizAnswers ?? null,
      },
      update: updateData,
    })
  );

  return NextResponse.json({ success: true, progress });
}

export async function GET() {
  /* # Authenticate */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Fetch all progress — catch table-not-found errors */
  let progress;
  try {
    progress = await dbRetry(() =>
      prisma.workshopProgress.findMany({
        where: { userId: session.user.id },
        select: {
          sectionId: true,
          completed: true,
          completedAt: true,
          bookmarked: true,
          quizScore: true,
        },
      })
    );
  } catch {
    return NextResponse.json({ progress: [] });
  }

  return NextResponse.json({ progress });
}
