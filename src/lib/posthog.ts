/* ============================================================
   POSTHOG CLIENT - Product Analytics
   ============================================================
   Tracks user behavior: page views, feature usage, funnels.
   Free tier: 1M events/month. Only active when env var is set.
   Lazy-loaded — posthog-js is not included in the initial bundle.

   Usage in components:
     import { getPosthog } from "@/lib/posthog";
     const ph = await getPosthog();
     ph?.capture("ai_tool_used", { action: "resume_rebuild" });
   ============================================================ */

import type { PostHog } from "posthog-js";

let instance: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

export async function getPosthog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (instance) return instance;

  if (!loading) {
    loading = import("posthog-js").then((mod) => {
      instance = mod.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        respect_dnt: true,
        capture_pageview: true,
        capture_pageleave: true,
        mask_all_text: false,
        mask_all_element_attributes: false,
        disable_session_recording: true,
      }) ?? null;
      return instance;
    });
  }

  return loading;
}
