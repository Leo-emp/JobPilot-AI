/* ============================================================
   NEWSLETTER SUBSCRIBE API
   ============================================================
   POST /api/newsletter — capture email for career tips newsletter.
   Stores in Resend audience (contact list) for future campaigns.
   No auth required — this is a public landing page form.
   Rate limited by IP to prevent abuse.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { safeHandler } from "@/lib/api-handler";
import { createRateLimiter } from "@/lib/rate-limit";
import { z } from "zod";

/* # Simple email validation */
const schema = z.object({
  email: z.string().email("Please enter a valid email address.").max(254),
});

/* # IP-based rate limiter — 5 subscribes per minute per IP (Redis-backed) */
const newsletterLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });

export const POST = safeHandler(async (req: NextRequest) => {
  /* # Rate limit by IP (Redis-backed — consistent across all instances) */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limitCheck = await newsletterLimiter.check(`newsletter:${ip}`);
  if (!limitCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email } = parsed.data;

  /* # Add to Resend audience if API key is configured */
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (resendKey && audienceId) {
    try {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      });

      if (!res.ok && res.status !== 409) {
        /* # 409 = already subscribed, which is fine */
        console.error("[newsletter] Resend API error:", res.status);
      }
    } catch (err) {
      console.error("[newsletter] Failed to add contact:", err);
    }
  }

  return NextResponse.json({ success: true, message: "You're subscribed! Check your inbox for career tips." });
});
