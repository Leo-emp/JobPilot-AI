/* ============================================================
   AI HISTORY API - List & Save AI Results
   ============================================================
   GET  /api/ai-history — list past AI results (paginated)
   POST /api/ai-history — save a new AI result
   Both endpoints require authentication.

   Query params: ?action=analyze_resume&cursor=xxx&limit=20
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";
import { createAiHistorySchema, formatZodError } from "@/lib/validations";

/* ---- GET: List AI results for the logged-in user ---- */
export const GET = authHandler(async (req, session) => {

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt"],
  });

  const url = new URL(req.url);
  const actionFilter = url.searchParams.get("action");

  const results = await dbRetry(() => prisma.aiResult.findMany({
    where: {
      userId: session.user.id,
      ...(actionFilter ? { action: actionFilter } : {}),
    },
    select: {
      id: true,
      action: true,
      title: true,
      createdAt: true,
    },
    ...query,
  }));

  return NextResponse.json(paginatedResponse(results, params.limit));
});

/* ---- POST: Save a new AI result ---- */
export const POST = authHandler(async (req, session) => {

  const body = await req.json();
  const parsed = createAiHistorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const { action, title, result } = parsed.data;

  const saved = await dbRetry(() => prisma.aiResult.create({
    data: {
      userId: session.user.id,
      action,
      title,
      result,
    },
  }));

  return NextResponse.json({ id: saved.id }, { status: 201 });
});
