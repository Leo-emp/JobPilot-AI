/* ============================================================
   EXTENSION SAVE JOB API - Save Job from Chrome Extension
   ============================================================
   POST /api/extension/save-job
   Saves a job listing to the user's applications tracker.
   Creates both a SavedJob record and an Application record.
   Includes CORS headers for cross-origin extension requests.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ---- Add CORS headers to response ---- */
function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

/* ---- POST: Save a job from the extension ---- */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  /* Check authentication */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Please log in to JobPilot AI first." },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  /* Parse request body */
  const { jobTitle, company, location, url, description } = await req.json();

  if (!jobTitle || !company) {
    return NextResponse.json(
      { error: "Job title and company are required." },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  /* Save the job listing */
  const savedJob = await prisma.savedJob.create({
    data: {
      userId: session.user.id,
      title: jobTitle,
      company,
      location: location || null,
      url: url || null,
      description: description || "",
    },
  });

  /* Create an application record linked to the saved job */
  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      jobId: savedJob.id,
      jobTitle,
      company,
      status: "Saved",
    },
  });

  return NextResponse.json(
    { success: true, jobId: savedJob.id, applicationId: application.id },
    { status: 201, headers: corsHeaders(origin) }
  );
}
