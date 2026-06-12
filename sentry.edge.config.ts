/* ============================================================
   SENTRY EDGE CONFIG - Proxy/Edge Error Monitoring
   ============================================================
   Captures errors from proxy.ts (formerly middleware).
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  streamGenAiSpans: true,
  tracesSampler: ({ name, attributes, inheritOrSampleWith }) => {
    if (attributes?.["sentry.op"]?.toString().startsWith("gen_ai.")) return 1.0;
    if (name?.includes("/api/ai")) return 1.0;
    return inheritOrSampleWith(0.2);
  },
  enabled: process.env.NODE_ENV === "production",
});
