/* ============================================================
   CHROME EXTENSION CORS — Shared origin check + headers
   ============================================================
   When CHROME_EXTENSION_ID is set, only that extension can make
   cross-origin requests. Without it, any extension is allowed
   (dev fallback). Used by all /api/extension/* routes.
   ============================================================ */

const EXT_ID = process.env.CHROME_EXTENSION_ID || "";

if (!EXT_ID && process.env.NODE_ENV === "production") {
  console.warn("[SECURITY] CHROME_EXTENSION_ID not set — extension CORS allows ANY chrome extension. Set this env var in production.");
}

export function isAllowedExtension(origin: string | null): boolean {
  if (!origin) return false;
  if (EXT_ID) return origin === `chrome-extension://${EXT_ID}`;
  /* Without explicit ID, allow any chrome extension (auth check guards the data) */
  return origin.startsWith("chrome-extension://");
}

export function extensionCorsHeaders(origin: string | null, methods = "GET, POST, OPTIONS") {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (isAllowedExtension(origin)) {
    headers["Access-Control-Allow-Origin"] = origin!;
  }

  return headers;
}
