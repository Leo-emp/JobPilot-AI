/* ============================================================
   COMPANIES API - Networking CRM
   ============================================================
   GET  /api/companies — list all target companies for the user
   POST /api/companies — add a new target company
   Both endpoints require authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: List all companies for the logged-in user ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Fetch all companies, newest first */
  const companies = await prisma.company.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(companies);
}

/* ---- POST: Add a new target company ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, industry, website, location, size, notes, priority, status } = await req.json();

  /* Company name is required */
  if (!name) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 }
    );
  }

  const company = await prisma.company.create({
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
  });

  return NextResponse.json(company, { status: 201 });
}
