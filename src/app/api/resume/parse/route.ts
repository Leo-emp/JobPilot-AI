/* ============================================================
   RESUME PDF PARSER API
   ============================================================
   POST /api/resume/parse
   Accepts a PDF file upload, extracts the text content,
   and returns it as a string for use in AI tools.
   Uses unpdf — serverless-friendly, no canvas dependency.
   Dynamic import avoids build-time module evaluation crash.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeHandler } from "@/lib/api-handler";
import { createRateLimiter } from "@/lib/rate-limit";

/* Force dynamic — never evaluate at build time */
export const dynamic = "force-dynamic";

/* 10 uploads per minute per user — prevents storage/compute abuse */
const uploadLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });

export const POST = safeHandler(async (req: NextRequest) => {
  /* Check authentication */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Rate limit file uploads per user */
  const limitCheck = await uploadLimiter.check(`resume-upload:${session.user.id}`);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limitCheck.resetIn / 1000)) } }
    );
  }

  try {
    /* Get the uploaded file from the form data */
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    /* Validate file type */
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    /* Validate file size (max 5MB) */
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
    }

    /* Read the file and parse with unpdf (dynamic import to avoid build crash) */
    const arrayBuffer = await file.arrayBuffer();
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text, totalPages } = await extractText(pdf);

    /* Return the extracted text */
    return NextResponse.json({
      text,
      pages: totalPages,
      fileName: file.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse PDF. Please try a different file or paste your resume text." },
      { status: 500 }
    );
  }
});
