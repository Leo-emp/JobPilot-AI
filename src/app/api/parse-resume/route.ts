/* ============================================================
   PARSE RESUME API - Extract Text from PDF/DOCX Files
   ============================================================
   POST /api/parse-resume
   Accepts a file upload and extracts plain text content.
   Supports PDF files using pdf-parse library.
   Returns the extracted text for AI processing.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    /* Get the uploaded file from the form data */
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    /* Convert the file to an ArrayBuffer for processing */
    const bytes = await file.arrayBuffer();

    let text = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      /* ---- PDF Parsing ---- */
      /* PDFParse v2: pass data as Uint8Array in constructor, then getText() */
      const parser = new PDFParse({ data: new Uint8Array(bytes) });
      const result = await parser.getText();
      text = result.text;
    } else if (file.name.toLowerCase().endsWith(".txt")) {
      /* ---- Plain Text ---- */
      text = new TextDecoder().decode(bytes);
    } else if (file.name.toLowerCase().endsWith(".docx")) {
      /* ---- DOCX Parsing (basic) ---- */
      /* DOCX is a ZIP of XML files — extract raw text from the XML */
      const content = new TextDecoder().decode(bytes);
      /* Strip XML tags to get plain text */
      text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    /* Clean up extracted text */
    /* Remove excessive whitespace and blank lines */
    text = text.replace(/\n{3,}/g, "\n\n").trim();

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from this file. Try pasting your resume text directly." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text, length: text.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to parse file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
