/* ============================================================
   RESUMES API - Save & List Resumes
   ============================================================
   GET  /api/resumes — list resumes (paginated)
   POST /api/resumes — save a new resume to the database
   Both endpoints require authentication.

   Pagination: ?cursor=xxx&limit=20&sort=createdAt&order=desc
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createResumeSchema, formatZodError } from "@/lib/validations";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";
import { safeHandler } from "@/lib/api-handler";

export const GET = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt", "fileName"],
  });

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    ...query,
  });

  return NextResponse.json(paginatedResponse(resumes, params.limit));
});

export const POST = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createResumeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { fileName, content, analysis } = parsed.data;

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      fileName,
      content,
      analysis: analysis || null,
    },
  });

  return NextResponse.json(resume, { status: 201 });
});
