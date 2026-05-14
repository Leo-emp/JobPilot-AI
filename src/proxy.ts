/* ============================================================
   AUTH PROXY - Route Protection & Security Headers
   ============================================================
   Runs on every matched request BEFORE the route handler.
   - Redirects unauthenticated users away from /dashboard
   - Blocks unauthenticated API requests with 401
   - Adds security headers to all responses
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* Check for session token in cookies */
  const token =
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value;

  const isLoggedIn = !!token;

  /* ---- Protect /dashboard routes ---- */
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ---- Protect /api routes (except auth, public endpoints) ---- */
  if (pathname.startsWith("/api") && !isLoggedIn) {
    const isPublic =
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/stripe/webhook") ||
      pathname === "/api/health";

    if (!isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  /* ---- Request Body Size Limit (2MB) ---- */
  /* Reject oversized payloads before they're parsed by route handlers */
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 413 }
    );
  }

  /* ---- CSRF Origin Verification for state-changing requests ---- */
  /* POST/PATCH/DELETE must come from our own origin or a trusted source */
  const method = req.method;
  if (method === "POST" || method === "PATCH" || method === "DELETE") {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const host = req.headers.get("host") || "";
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);

    /* Allow: same-origin, Chrome Extension, NextAuth callbacks (no origin on server-side), Stripe webhooks */
    const isSameOrigin = requestOrigin && (
      requestOrigin === `https://${host}` ||
      requestOrigin === `http://${host}`
    );
    const isChromeExtension = requestOrigin?.startsWith("chrome-extension://");
    const isAuthCallback = pathname.startsWith("/api/auth");
    const isWebhook = pathname.startsWith("/api/stripe/webhook");
    /* Server-to-server calls (e.g. NextAuth) send no origin header */
    const isServerCall = !origin && !referer;

    if (!isSameOrigin && !isChromeExtension && !isAuthCallback && !isWebhook && !isServerCall) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  /* ---- Security Headers + Request Tracing ---- */
  const response = NextResponse.next();

  /* Unique request ID for tracing errors across logs */
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-Id", requestId);

  /* Security headers — prevent common attacks */
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  /* Prevent MIME type confusion attacks */
  response.headers.set("X-DNS-Prefetch-Control", "off");

  /* ---- CORS for Chrome Extension routes ---- */
  if (pathname.startsWith("/api/extension")) {
    const origin = req.headers.get("origin");
    if (origin && origin.startsWith("chrome-extension://")) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }
  }

  return response;
}

/* Only run proxy on dashboard and API routes */
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
