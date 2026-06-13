/* ============================================================
   AUTH PROXY - Route Protection & Security Headers
   ============================================================
   Runs on every matched request BEFORE the route handler.
   - Maintenance mode toggle (env var MAINTENANCE_MODE)
   - Redirects unauthenticated users away from /dashboard
   - Blocks unauthenticated API requests with 401
   - IP-based rate limiting for unauthenticated routes
   - Adds security headers (CSP, CORS, HSTS) to all responses
   - Enforces body size limits and CSRF origin verification
   ============================================================ */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { audit } from "@/lib/audit";

/* ---- Maintenance mode check ---- */
/* # Set MAINTENANCE_MODE=true in env vars to block all traffic except /api/health */
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

/* ---- Chrome extension ID whitelist ---- */
/* # Set CHROME_EXTENSION_ID in env to lock CORS to your published extension */
const ALLOWED_EXTENSION_ID = process.env.CHROME_EXTENSION_ID || "";

/* ---- In-memory IP rate limiter for unauthenticated API routes ---- */
/* # Edge-compatible burst protection — Redis handles sustained limits in route handlers */
const ipStore = new Map<string, { count: number; resetAt: number }>();
const IP_MAX_REQUESTS = 30;
const IP_WINDOW_MS = 60_000;

function checkIpLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    return { allowed: true, remaining: IP_MAX_REQUESTS - 1 };
  }

  if (entry.count >= IP_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: IP_MAX_REQUESTS - entry.count };
}

/* # Clean up expired entries every 2 minutes */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipStore.entries()) {
    if (now > entry.resetAt) ipStore.delete(key);
  }
}, 120_000);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ---- Maintenance mode — block everything except health check ---- */
  if (MAINTENANCE_MODE && pathname !== "/api/health") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. We're performing scheduled maintenance." },
        { status: 503, headers: { "Retry-After": "300" } }
      );
    }
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Maintenance</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a1a;color:#e2e8f0;text-align:center;padding:2rem}.box{max-width:480px}h1{font-size:2rem;margin-bottom:1rem}p{color:#94a3b8;line-height:1.6}</style></head><body><div class="box"><h1>We'll be right back</h1><p>JobPilot AI is undergoing scheduled maintenance. This usually takes less than 5 minutes. Please check back shortly.</p></div></body></html>`,
      { status: 503, headers: { "Content-Type": "text/html", "Retry-After": "300" } }
    );
  }

  /* ---- WAF: Block common attack patterns in URL path ---- */
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  const wafBlocked =
    /(\.\.[/\\])/.test(decodedPath) ||          /* Path traversal */
    /(union\s+select|drop\s+table|;\s*delete|;\s*insert|;\s*update)/i.test(decodedPath) || /* SQL injection */
    /(<script|javascript:|data:text\/html|vbscript:)/i.test(decodedPath) || /* XSS in URL */
    /\.(env|git|svn|htaccess|htpasswd|DS_Store)/i.test(decodedPath) || /* Sensitive file probing */
    /\/?(wp-admin|wp-login|xmlrpc|phpmyadmin|\.well-known\/security\.txt)/i.test(decodedPath); /* Scanner noise */

  if (wafBlocked) {
    audit("security.waf.blocked", { ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown", detail: pathname });
    return new NextResponse(null, { status: 403 });
  }

  /* ---- IP rate limiting for unauthenticated API routes ---- */
  /* # Burst protection at the edge — prevents brute-force attacks on auth routes */
  const isPublicApi = (
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/health" ||
    pathname === "/api/newsletter" ||
    pathname.startsWith("/api/extension/")
  );

  if (isPublicApi) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("x-real-ip") ||
               "unknown";

    const { allowed, remaining: _remaining } = checkIpLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

  }

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
      pathname.startsWith("/api/portfolio/public/") ||
      pathname.startsWith("/api/cron/") ||
      pathname === "/api/newsletter" ||
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
    const isChromeExtension = ALLOWED_EXTENSION_ID
      ? requestOrigin === `chrome-extension://${ALLOWED_EXTENSION_ID}`
      : (process.env.NODE_ENV !== "production" && requestOrigin?.startsWith("chrome-extension://"));
    const isAuthCallback = pathname.startsWith("/api/auth");
    const isWebhook = pathname.startsWith("/api/stripe/webhook");
    const isServerCall = !origin && !referer;

    if (!isSameOrigin && !isChromeExtension && !isAuthCallback && !isWebhook && !isServerCall) {
      audit("security.csrf.blocked", { ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown", detail: `origin:${requestOrigin} on ${pathname}` });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  /* ---- Security Headers + Request Tracing ---- */
  /* Generate a per-request nonce for CSP script/style whitelisting */
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  /* Unique request ID for tracing errors across logs */
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-Id", requestId);

  /* ---- Content Security Policy (CSP) ---- */
  /* Nonce-based: scripts/styles must carry the per-request nonce.
     'unsafe-inline' kept as fallback for browsers that don't support nonces.
     In CSP2+ browsers, 'unsafe-inline' is ignored when a nonce is present. */
  const csp = [
    "default-src 'self'",
    /* Scripts: nonce + fallback unsafe-inline + eval (dev only) + trusted third parties */
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://js.stripe.com https://us.i.posthog.com https://*.sentry.io https://challenges.cloudflare.com`,
    /* Styles: unsafe-inline needed for Tailwind + template preview iframes */
    "style-src 'self' 'unsafe-inline'",
    /* Images: self + data URIs (base64) + blob (PDF previews) + common CDNs */
    "img-src 'self' data: blob: https://*.googleusercontent.com https://*.licdn.com https://images.unsplash.com",
    /* Fonts: self + Google Fonts */
    "font-src 'self' https://fonts.gstatic.com",
    /* API calls: self + Stripe + Gemini + PostHog + Sentry */
    "connect-src 'self' https://api.stripe.com https://generativelanguage.googleapis.com https://us.i.posthog.com https://*.sentry.io",
    /* Frames: self (srcDoc iframes for template previews) + Stripe checkout */
    "frame-src 'self' blob: https://js.stripe.com https://hooks.stripe.com https://player.vimeo.com https://challenges.cloudflare.com",
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
  /* Allow camera + mic for the mock interview feature, block geolocation */
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  /* Prevent other sites from embedding this site in iframes or reading its resources */
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  /* ---- CORS — restrict API access to own origin + Chrome extension ---- */
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin");

    if (pathname.startsWith("/api/extension")) {
      /* Chrome extension gets its own CORS — locked to specific ID when configured */
      const isAllowedExtension = ALLOWED_EXTENSION_ID
        ? origin === `chrome-extension://${ALLOWED_EXTENSION_ID}`
        : (process.env.NODE_ENV !== "production" && origin?.startsWith("chrome-extension://"));
      if (origin && isAllowedExtension) {
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

/* # Run on all routes except static assets (for maintenance mode coverage) */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
