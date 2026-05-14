/* ============================================================
   COVER LETTERS API - Save & List Cover Letters
   ============================================================
   GET  /api/cover-letters — list all cover letters for the user
   POST /api/cover-letters — save a new cover letter
   Both endpoints require authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCoverLetterSchema, formatZodError } from "@/lib/validations";

/* ---- GET: List all cover letters for the logged-in user ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Fetch all cover letters, newest first */
  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coverLetters);
}

/* ---- POST: Save a new cover letter ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createCoverLetterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { jobTitle, company, content } = parsed.data;

  /* Save the cover letter to the database */
  const coverLetter = await prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      jobTitle,
      company,
      content,
    },
  });

  return NextResponse.json(coverLetter, { status: 201 });
}
