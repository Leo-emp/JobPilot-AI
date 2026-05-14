/* ============================================================
   SENTRY SERVER CONFIG - Server-Side Error Monitoring
   ============================================================
   Captures unhandled exceptions in API routes, server
   components, and middleware. Only active in production.
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  /* Send 100% of errors, sample 20% of performance transactions */
  tracesSampleRate: 0.2,

  /* Only enable in production */
  enabled: process.env.NODE_ENV === "production",

  /* Tag environment for filtering in Sentry dashboard */
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,

  /* Attach server-side context to errors */
  beforeSend(event) {
    /* Strip sensitive headers */
    if (event.request?.headers) {
      delete event.request.headers["cookie"];
      delete event.request.headers["authorization"];
    }
    return event;
  },
});
