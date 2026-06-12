/* ============================================================
   SENTRY CLIENT CONFIG - Browser Error Monitoring
   ============================================================
   Captures unhandled exceptions, promise rejections, and
   performance data from the user's browser.
   Only active when NEXT_PUBLIC_SENTRY_DSN is set.
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  /* Send 100% of errors, sample 20% of performance transactions */
  tracesSampleRate: 0.2,

  /* AI span streaming (server-side AI, but keeps config consistent) */
  streamGenAiSpans: true,

  /* Only enable in production to keep dev console clean */
  enabled: process.env.NODE_ENV === "production",

  /* Tag environment for filtering in Sentry dashboard */
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,

  /* Replay captures user session on error (helps reproduce bugs) */
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,

  /* Ignore common noise that isn't actionable */
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection",
    "Load failed",
    "Failed to fetch",
    "NetworkError",
    "AbortError",
    "ChunkLoadError",
  ],
});
