/* # Lightweight Sentry health tracking for client-side features.
   # Fire-and-forget — never throws, never blocks UI. */
"use client";

import * as Sentry from "@sentry/nextjs";

/* # trackEvent — sends a named health event to Sentry with optional metadata.
   # Wrapped in try/catch so it's completely safe to call anywhere.
   # Usage: trackEvent("cover_letter.save_failed", { error: "network" }) */
export function trackEvent(
  name: string,
  data?: Record<string, string | number | boolean | undefined>,
) {
  try {
    Sentry.captureMessage(`health:${name}`, {
      level: "warning",
      tags: { component: "feature_health", event: name },
      extra: data,
    });
  } catch {
    /* # Sentry itself failed — silently ignore */
  }
}
