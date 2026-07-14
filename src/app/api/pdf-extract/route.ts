/* ============================================================
   PDF TEXT EXTRACTION API — Gemini Vision Fallback
   ============================================================
   POST /api/pdf-extract — receives a base64 PDF, sends it to
   Gemini vision to extract text when client-side pdfjs fails
   (image-based PDFs, outlined fonts, scanned documents).
   Protected: requires auth session.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { authHandler } from "@/lib/api-handler";
import { callGeminiMultimodal } from "@/lib/gemini";

/* # Max PDF size: 15MB base64 (~11MB raw) */
const MAX_BASE64_LENGTH = 20_000_000;

export const POST = authHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { pdfBase64, mimeType } = body;

  if (!pdfBase64 || typeof pdfBase64 !== "string") {
    return NextResponse.json({ error: "Missing pdfBase64" }, { status: 400 });
  }

  if (pdfBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const result = await callGeminiMultimodal(
    `Extract ALL text from this resume document. Preserve the structure: sections, headings, bullet points, dates, contact info. Return ONLY the extracted text — no commentary, no formatting suggestions, no markdown formatting. Just the raw text content exactly as it appears.`,
    [{ data: pdfBase64, mimeType: mimeType || "application/pdf" }],
  );

  return NextResponse.json({ text: result.text });
}, { timeoutMs: 30_000 });
