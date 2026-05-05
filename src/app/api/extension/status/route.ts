/* ============================================================
   EXTENSION STATUS API - Auth Check for Chrome Extension
   ============================================================
   GET /api/extension/status
   Returns whether the user is authenticated and basic info.
   Used by the Chrome Extension to check login state.
   Includes CORS headers for cross-origin extension requests.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/* ---- Allowed origins for CORS ---- */
const ALLOWED_ORIGINS = [
  "chrome-extension://",
];

/* ---- Add CORS headers to response ---- */
function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  /* Allow any chrome-extension origin */
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

/* ---- GET: Check if user is logged in ---- */
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { authenticated: false },
      { headers: corsHeaders(origin) }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    },
    { headers: corsHeaders(origin) }
  );
}
