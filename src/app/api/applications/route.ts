/* ============================================================
   APPLICATIONS API - List & Create
   ============================================================
   GET  /api/applications — list all applications for the user
   POST /api/applications — create a new application
   Both endpoints require authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- GET: List all applications for the logged-in user ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

/* ---- POST: Create a new application ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobTitle, company } = await req.json();

  if (!jobTitle || !company) {
    return NextResponse.json(
      { error: "Job title and company are required." },
      { status: 400 }
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      jobTitle,
      company,
      status: "Saved",
    },
  });

  return NextResponse.json(application, { status: 201 });
}
