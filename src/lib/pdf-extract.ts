/* ============================================================
   PDF TEXT EXTRACTION - Client-Side
   ============================================================
   Shared utility for extracting text from PDF files in the browser.
   Uses pdfjs-dist (dynamically imported to keep bundle small).
   Line-aware: uses Y-position transform to preserve line breaks.
   Falls back to Gemini vision via /api/pdf-extract for
   image-based PDFs, outlined fonts, and scanned documents.
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* # Convert a File to a base64 string for the API fallback */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* # Gemini vision fallback — sends the PDF as an image for OCR */
async function extractWithGemini(file: File): Promise<string> {
  const base64 = await fileToBase64(file);
  const res = await fetch("/api/pdf-extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pdfBase64: base64, mimeType: file.type || "application/pdf" }),
  });
  if (!res.ok) throw new Error("Vision extraction failed");
  const data = await res.json();
  return data.text || "";
}

export async function extractTextFromPdf(file: File): Promise<string> {
  /* # Step 1: Try pdfjs extraction (fast, works for normal PDFs) */
  const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: "/cmaps/",
    cMapPacked: true,
    useSystemFonts: true,
  }).promise;

  const pages: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let lineText = "";
    const lines: string[] = [];

    for (const item of content.items as any[]) {
      if (!("str" in item) || !item.str) continue;
      const y = item.transform[5];

      if (lastY !== null && Math.abs(y - lastY) > 3) {
        if (lineText.trim()) lines.push(lineText.trim());
        lineText = item.str;
      } else {
        lineText += (lineText && !lineText.endsWith(" ") ? " " : "") + item.str;
      }
      lastY = y;
    }
    if (lineText.trim()) lines.push(lineText.trim());

    pages.push(lines.join("\n"));
  }

  const pdfjsText = pages.join("\n\n");

  /* # Step 2: If pdfjs got enough text, return it */
  if (pdfjsText.trim().length >= 50) {
    return pdfjsText;
  }

  /* # Step 3: Fallback to Gemini vision for image-based/outlined PDFs */
  return extractWithGemini(file);
}
