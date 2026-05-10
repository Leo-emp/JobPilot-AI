/* ============================================================
   POSTHOG CLIENT - Product Analytics
   ============================================================
   Tracks user behavior: page views, feature usage, funnels.
   Free tier: 1M events/month. Only active when env var is set.

   Usage in components:
     import { posthog } from "@/lib/posthog";
     posthog?.capture("ai_tool_used", { action: "resume_rebuild" });
   ============================================================ */

import posthogJs from "posthog-js";

/* Only initialize in browser and when key is available */
export const posthog =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY
    ? posthogJs.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        /* Respect Do Not Track browser setting */
        respect_dnt: true,
        /* Capture page views automatically */
        capture_pageview: true,
        /* Capture page leave events for session duration */
        capture_pageleave: true,
        /* Don't capture text input values (privacy) */
        mask_all_text: false,
        mask_all_element_attributes: false,
        /* Disable session recording on free tier (saves quota) */
        disable_session_recording: true,
      })
    : null;
