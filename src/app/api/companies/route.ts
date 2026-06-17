/* ============================================================
   COMPANIES API - Networking CRM
   ============================================================
   GET  /api/companies — list target companies (paginated)
   POST /api/companies — add a new target company
   Both endpoints require authentication.

   Pagination: ?cursor=xxx&limit=20&sort=updatedAt&order=desc
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { authHandler } from "@/lib/api-handler";
import { createCompanySchema, formatZodError } from "@/lib/validations";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";

/* ---- GET: List companies for the logged-in user (paginated) ---- */
export const GET = authHandler(async (req, session) => {

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt", "updatedAt", "name", "priority", "status"],
  });

  const companies = await dbRetry(() => prisma.company.findMany({
    where: { userId: session.user.id },
    ...query,
  }));

  return NextResponse.json(paginatedResponse(companies, params.limit));
});

/* ---- POST: Add a new target company ---- */
export const POST = authHandler(async (req, session) => {

  const body = await req.json();
  const parsed = createCompanySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { name, industry, website, location, size, notes, priority, status } = parsed.data;

  const company = await dbRetry(() => prisma.company.create({
    data: {
      userId: session.user.id,
      name,
      industry: industry || null,
      website: website || null,
      location: location || null,
      size: size || null,
      notes: notes || null,
      priority: priority || "Medium",
      status: status || "Researching",
    },
  }));

  return NextResponse.json(company, { status: 201 });
});
