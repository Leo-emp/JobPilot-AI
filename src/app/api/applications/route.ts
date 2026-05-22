/* ============================================================
   APPLICATIONS API - List & Create
   ============================================================
   GET  /api/applications — list applications (paginated)
   POST /api/applications — create a new application
   Both endpoints require authentication.
   Includes CORS headers for Chrome Extension access.

   Pagination: ?cursor=xxx&limit=20&sort=createdAt&order=desc
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createApplicationSchema, formatZodError } from "@/lib/validations";
import { parsePaginationParams, buildPaginationQuery, paginatedResponse } from "@/lib/pagination";
import { extensionCorsHeaders as corsHeaders } from "@/lib/extension-cors";

/* ---- OPTIONS: Handle CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/* ---- GET: List applications for the logged-in user (paginated) ---- */
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(origin) });
  }

  const params = parsePaginationParams(req.url);
  const query = buildPaginationQuery({
    ...params,
    allowedSorts: ["createdAt", "updatedAt", "company", "status"],
  });

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    ...query,
    include: { job: { select: { url: true, description: true } } },
  });

  return NextResponse.json(paginatedResponse(applications, params.limit), { headers: corsHeaders(origin) });
}

/* ---- POST: Create a new application ---- */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(origin) });
  }

  const body = await req.json();
  const parsed = createApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      jobTitle: parsed.data.jobTitle,
      company: parsed.data.company,
      status: "Saved",
    },
  });

  return NextResponse.json(application, { status: 201, headers: corsHeaders(origin) });
}
