/* ============================================================
   RESUMES API - Save & List Resumes
   ============================================================
   GET  /api/resumes — list all resumes for the logged-in user
   POST /api/resumes — save a new resume to the database
   Both endpoints require authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: List all resumes for the logged-in user ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Fetch all resumes, newest first */
  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resumes);
}

/* ---- POST: Save a new resume ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, content, analysis } = await req.json();

  /* Validate required fields */
  if (!fileName || !content) {
    return NextResponse.json(
      { error: "File name and content are required." },
      { status: 400 }
    );
  }

  /* Save the resume to the database */
  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      fileName,
      content,
      analysis: analysis || null,
    },
  });

  return NextResponse.json(resume, { status: 201 });
}
