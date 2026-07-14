/* ============================================================
   PDF TEXT EXTRACTION - Client-Side
   ============================================================
   Shared utility for extracting text from PDF files in the browser.
   Uses pdfjs-dist (dynamically imported to keep bundle small).
   Line-aware: uses Y-position transform to preserve line breaks.
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function extractTextFromPdf(file: File): Promise<string> {
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

  return pages.join("\n\n");
}
