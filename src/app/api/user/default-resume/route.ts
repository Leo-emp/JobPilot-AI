/* ============================================================
   DEFAULT RESUME API — Get/Set the user's default resume
   ============================================================
   GET  /api/user/default-resume — returns the default resume content
   PUT  /api/user/default-resume — sets a resume ID as default
   DELETE /api/user/default-resume — clears the default resume
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: Fetch the user's default resume ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { defaultResumeId: true },
  });

  if (!user?.defaultResumeId) {
    return NextResponse.json({ data: null });
  }

  /* Fetch the actual resume record */
  const resume = await prisma.resume.findFirst({
    where: { id: user.defaultResumeId, userId: session.user.id },
    select: { id: true, fileName: true, content: true },
  });

  /* If the resume was deleted, clear the stale reference */
  if (!resume) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { defaultResumeId: null },
    });
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: resume });
}

/* ---- PUT: Set a resume as default ---- */
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { resumeId } = body;

  if (!resumeId || typeof resumeId !== "string") {
    return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
  }

  /* Verify the resume belongs to this user */
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { defaultResumeId: resumeId },
  });

  return NextResponse.json({ success: true });
}

/* ---- DELETE: Clear the default resume ---- */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { defaultResumeId: null },
  });

  return NextResponse.json({ success: true });
}
