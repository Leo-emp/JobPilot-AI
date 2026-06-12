/* ============================================================
   SENTRY SERVER CONFIG - Server-Side Error Monitoring
   ============================================================
   Captures unhandled exceptions in API routes, server
   components, and middleware. Only active in production.
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  /* AI spans sent as standalone items (avoids payload size limits) */
  streamGenAiSpans: true,

  /* 100% for AI routes, 20% for everything else */
  tracesSampler: ({ name, attributes, inheritOrSampleWith }) => {
    if (attributes?.["sentry.op"]?.toString().startsWith("gen_ai.")) return 1.0;
    if (name?.includes("/api/ai")) return 1.0;
    return inheritOrSampleWith(0.2);
  },

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
      delete event.request.headers["x-goog-api-key"];
    }
    return event;
  },

  /* Strip API keys from breadcrumb URLs */
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.data?.url) {
      breadcrumb.data.url = breadcrumb.data.url.replace(/[?&]key=[^&]+/g, "");
    }
    return breadcrumb;
  },
});
