/* ============================================================
   PDF TEXT EXTRACTION API — Gemini Vision Fallback
   ============================================================
   POST /api/pdf-extract — receives JPEG images of PDF pages
   (rendered client-side by pdfjs), sends them to Gemini vision
   to extract text. Used when pdfjs cannot extract text from
   image-based PDFs, outlined fonts, or scanned documents.
   Protected: requires auth session.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { authHandler } from "@/lib/api-handler";
import { callGeminiMultimodal } from "@/lib/gemini";

export const POST = authHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { images } = body;

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json({ error: "Missing images" }, { status: 400 });
  }

  if (images.length > 10) {
    return NextResponse.json({ error: "Too many pages" }, { status: 400 });
  }

  const result = await callGeminiMultimodal(
    `Extract ALL text from this resume document. Preserve the structure: sections, headings, bullet points, dates, contact info. Return ONLY the extracted text — no commentary, no formatting suggestions, no markdown formatting. Just the raw text content exactly as it appears.`,
    images,
  );

  return NextResponse.json({ text: result.text });
}, { timeoutMs: 30_000 });
