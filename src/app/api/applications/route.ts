/* ============================================================
   APPLICATIONS API - List & Create
   ============================================================
   GET  /api/applications — list all applications for the user
   POST /api/applications — create a new application
   Both endpoints require authentication.
   Includes CORS headers for Chrome Extension access.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createApplicationSchema, formatZodError } from "@/lib/validations";

/* ---- Add CORS headers for Chrome Extension ---- */
function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (origin && origin.startsWith("chrome-extension://")) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

/* ---- OPTIONS: Handle CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/* ---- GET: List all applications for the logged-in user ---- */
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(origin) });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications, { headers: corsHeaders(origin) });
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
