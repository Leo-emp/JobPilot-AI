/* ============================================================
   INSTRUMENTATION - Sentry Server-Side Initialization
   ============================================================
   Next.js App Router calls this file on server startup.
   Initializes Sentry for server-side error tracking.
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    /* # Validate env vars before anything else — fail fast on missing config */
    await import("./lib/validate-env");
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
