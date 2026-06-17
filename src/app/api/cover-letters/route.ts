/* ============================================================
   COVER LETTERS API - Save & List Cover Letters
   ============================================================
   GET  /api/cover-letters — list cover letters (paginated)
   POST /api/cover-letters — save a new cover letter
   Both endpoints require authentication.

   Pagination: ?cursor=xxx&limit=20&sort=createdAt&order=desc
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { createCoverLetterSchema, formatZodError } from "@/lib/validations";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";

/* ---- GET: List cover letters for the logged-in user (paginated) ---- */
export const GET = authHandler(async (req, session) => {

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt", "jobTitle", "company"],
  });

  const coverLetters = await dbRetry(() => prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    ...query,
  }));

  return NextResponse.json(paginatedResponse(coverLetters, params.limit));
});

/* ---- POST: Save a new cover letter ---- */
export const POST = authHandler(async (req, session) => {

  const body = await req.json();
  const parsed = createCoverLetterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { jobTitle, company, content } = parsed.data;

  const coverLetter = await dbRetry(() => prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      jobTitle,
      company,
      content,
    },
  }));

  return NextResponse.json(coverLetter, { status: 201 });
});
