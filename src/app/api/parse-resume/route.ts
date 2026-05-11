/* ============================================================
   PARSE RESUME API — Extracts text from uploaded PDF or TXT files
   ============================================================ */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PDFParse } from "pdf-parse";

export async function POST(req: Request) {
  /* Auth check */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    /* 5MB limit */
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (file.name.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else if (file.name.endsWith(".pdf")) {
      /* pdf-parse v2: pass binary data via LoadParameters, then extract text */
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      return NextResponse.json({ error: "Unsupported file type. Upload a PDF or TXT file." }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file. Try pasting your resume instead." }, { status: 400 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch {
    return NextResponse.json({ error: "Failed to parse file. Try pasting your resume instead." }, { status: 500 });
  }
}
