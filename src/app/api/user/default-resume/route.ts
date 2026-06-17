/* ============================================================
   DEFAULT RESUME API — Get/Set the user's default resume
   ============================================================
   GET  /api/user/default-resume — returns the default resume content
   PUT  /api/user/default-resume — sets a resume ID as default
   DELETE /api/user/default-resume — clears the default resume
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setDefaultResumeSchema, formatZodError } from "@/lib/validations";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

/* ---- GET: Fetch the user's default resume ---- */
export const GET = authHandler(async (_req, session) => {

  const user = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { defaultResumeId: true },
    })
  );

  const defaultId = user?.defaultResumeId;
  if (!defaultId) {
    return NextResponse.json({ data: null });
  }

  /* Fetch the actual resume record */
  const resume = await dbRetry(() =>
    prisma.resume.findFirst({
      where: { id: defaultId, userId: session.user.id },
      select: { id: true, fileName: true, content: true },
    })
  );

  /* If the resume was deleted, clear the stale reference */
  if (!resume) {
    await dbRetry(() =>
      prisma.user.update({
        where: { id: session.user.id },
        data: { defaultResumeId: null },
      })
    );
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: resume });
});

/* ---- PUT: Set a resume as default ---- */
export const PUT = authHandler(async (req, session) => {

  const body = await req.json();
  const parsed = setDefaultResumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const { resumeId } = parsed.data;

  /* Verify the resume belongs to this user */
  const resume = await dbRetry(() =>
    prisma.resume.findFirst({
      where: { id: resumeId, userId: session.user.id },
    })
  );

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { defaultResumeId: resumeId },
    })
  );

  return NextResponse.json({ success: true });
});

/* ---- DELETE: Clear the default resume ---- */
export const DELETE = authHandler(async (_req, session) => {

  await dbRetry(() =>
    prisma.user.update({
      where: { id: session.user.id },
      data: { defaultResumeId: null },
    })
  );

  return NextResponse.json({ success: true });
});
