/* ============================================================
   AI HISTORY API - List & Save AI Results
   ============================================================
   GET  /api/ai-history — list past AI results (paginated)
   POST /api/ai-history — save a new AI result
   Both endpoints require authentication.

   Query params: ?action=analyze_resume&cursor=xxx&limit=20
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";

/* ---- GET: List AI results for the logged-in user ---- */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt"],
  });

  const url = new URL(req.url);
  const actionFilter = url.searchParams.get("action");

  const results = await prisma.aiResult.findMany({
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
  });

  return NextResponse.json(paginatedResponse(results, params.limit));
}

/* ---- POST: Save a new AI result ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, title, result } = body;

  if (!action || !title || !result) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const saved = await prisma.aiResult.create({
    data: {
      userId: session.user.id,
      action,
      title: title.slice(0, 200),
      result,
    },
  });

  return NextResponse.json({ id: saved.id }, { status: 201 });
}
