/* ============================================================
   AUTH PROXY - Route Protection & Security Headers
   ============================================================
   Runs on every matched request BEFORE the route handler.
   - Redirects unauthenticated users away from /dashboard
   - Blocks unauthenticated API requests with 401
   - Adds security headers (CSP, CORS, HSTS) to all responses
   - Enforces body size limits and CSRF origin verification
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { audit } from "@/lib/audit";

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
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
    audit("security.body_size.blocked", { ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown", detail: `${contentLength} bytes on ${pathname}` });
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 413 }
    );
  }

  /* ---- CSRF Origin Verification for state-changing requests ---- */
  const method = req.method;
  if (method === "POST" || method === "PATCH" || method === "DELETE") {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const host = req.headers.get("host") || "";
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);

    const isSameOrigin = requestOrigin && (
      requestOrigin === `https://${host}` ||
      requestOrigin === `http://${host}`
    );
    const isChromeExtension = requestOrigin?.startsWith("chrome-extension://");
    const isAuthCallback = pathname.startsWith("/api/auth");
    const isWebhook = pathname.startsWith("/api/stripe/webhook");
    const isServerCall = !origin && !referer;

    if (!isSameOrigin && !isChromeExtension && !isAuthCallback && !isWebhook && !isServerCall) {
      audit("security.csrf.blocked", { ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown", detail: `origin:${requestOrigin} on ${pathname}` });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  /* ---- Security Headers + Request Tracing ---- */
  const response = NextResponse.next();

  /* Unique request ID for tracing errors across logs */
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-Id", requestId);

  /* ---- Content Security Policy (CSP) ---- */
  /* Strongest XSS defense — only allows scripts/styles from trusted sources */
  const csp = [
    "default-src 'self'",
    /* Scripts: self + inline (Next.js needs it) + eval (dev only hot reload) + Stripe + PostHog + Sentry */
    `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://js.stripe.com https://us.i.posthog.com https://*.sentry.io`,
    /* Styles: self + inline (Tailwind injects styles) */
    "style-src 'self' 'unsafe-inline'",
    /* Images: self + data URIs (base64) + blob (PDF previews) + common CDNs */
    "img-src 'self' data: blob: https://*.googleusercontent.com https://*.licdn.com",
    /* Fonts: self + Google Fonts */
    "font-src 'self' https://fonts.gstatic.com",
    /* API calls: self + Stripe + Gemini + PostHog + Sentry */
    "connect-src 'self' https://api.stripe.com https://generativelanguage.googleapis.com https://us.i.posthog.com https://*.sentry.io",
    /* Frames: only Stripe checkout iframe */
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    /* Block all other embeds */
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    /* Upgrade insecure requests in production */
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  /* ---- HSTS — force HTTPS in production ---- */
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  /* ---- Standard Security Headers ---- */
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");

  /* ---- CORS — restrict API access to own origin + Chrome extension ---- */
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin");

    if (pathname.startsWith("/api/extension")) {
      /* Chrome extension gets its own CORS */
      if (origin && origin.startsWith("chrome-extension://")) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      }
    } else if (origin) {
      /* All other API routes: only allow same-origin requests */
      const host = req.headers.get("host") || "";
      const isSameOrigin =
        origin === `https://${host}` || origin === `http://${host}`;

      if (isSameOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      }
      /* If not same-origin: no CORS headers = browser blocks the request */
    }
  }

  return response;
}

/* Only run proxy on dashboard and API routes */
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
