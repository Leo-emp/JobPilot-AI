/* ============================================================
   INTERNAL FUNNEL EVENTS — /api/internal/funnel-events
   ============================================================
   GET: Returns user lifecycle events for Marketing HQ to poll.
   Protected by INTERNAL_API_SECRET (shared with Marketing HQ).
   NOT a public API — only called by the marketing dashboard.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";

export async function GET(req: NextRequest) {
  // # Verify internal API secret — must match INTERNAL_API_SECRET env var
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    // # Misconfigured server — secret not set
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  // # Read the Authorization header from the incoming request
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${secret}`;

  // # Timing-safe comparison prevents timing attacks on the secret
  // # Both buffers must be the same length for timingSafeEqual to work
  if (
    !authHeader ||
    authHeader.length !== expected.length ||
    !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // # Parse "since" query parameter — defaults to 30 days ago if not supplied
  const sinceParam = req.nextUrl.searchParams.get("since");
  const since = sinceParam
    ? new Date(sinceParam)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // # Validate the date — return 400 if it's malformed
  if (isNaN(since.getTime())) {
    return NextResponse.json(
      { error: "Invalid 'since' date format — use ISO 8601 (e.g. 2026-06-01T00:00:00Z)" },
      { status: 400 }
    );
  }

  try {
    // # Query all active users created since the given date
    // # _count.aiResults lets us derive first/fifth AI use milestones without extra queries
    const newUsers = await dbRetry(() =>
      prisma.user.findMany({
        where: {
          createdAt: { gte: since },
          deletedAt: null, // # Exclude soft-deleted users
        },
        select: {
          id: true,
          email: true,
          plan: true,
          referralSource: true,
          createdAt: true,
          _count: { select: { aiResults: true } }, // # Aggregate count for milestone detection
        },
      })
    );

    // # Type definition for a single funnel event
    type FunnelEvent = {
      userId: string;
      email: string;
      eventType: "signup" | "first_ai_use" | "fifth_ai_use" | "pro_upgrade";
      utmSource: string | null;
      utmMedium: string | null;
      utmCampaign: string | null;
      utmTerm: string | null;
      utmContent: string | null;
      eventDate: string;
      metadata: Record<string, unknown> | null;
    };

    // # Build the event list — each user can emit multiple events
    const events: FunnelEvent[] = [];

    for (const user of newUsers) {
      // # Parse UTM attribution data stored in referralSource as JSON
      let utm: Record<string, string | null> = {
        source: null,
        medium: null,
        campaign: null,
        term: null,
        content: null,
      };

      if (user.referralSource) {
        try {
          // # referralSource is stored as JSON by the signup route
          const parsed = JSON.parse(user.referralSource) as Record<string, string | null>;
          utm = {
            source: parsed.utm_source ?? parsed.source ?? null,
            medium: parsed.utm_medium ?? parsed.medium ?? null,
            campaign: parsed.utm_campaign ?? parsed.campaign ?? null,
            term: parsed.utm_term ?? parsed.term ?? null,
            content: parsed.utm_content ?? parsed.content ?? null,
          };
        } catch {
          // # Not valid JSON — treat the raw string as the source value
          utm.source = user.referralSource;
        }
      }

      // # ---- Event: signup ----
      // # Always emitted for every user in the window
      events.push({
        userId: user.id,
        email: user.email,
        eventType: "signup",
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        utmTerm: utm.term,
        utmContent: utm.content,
        eventDate: user.createdAt.toISOString(),
        metadata: null,
      });

      // # ---- Event: first_ai_use ----
      // # User has used at least one AI feature
      if (user._count.aiResults >= 1) {
        events.push({
          userId: user.id,
          email: user.email,
          eventType: "first_ai_use",
          utmSource: utm.source,
          utmMedium: utm.medium,
          utmCampaign: utm.campaign,
          utmTerm: utm.term,
          utmContent: utm.content,
          // # eventDate is an approximation — exact date would need AiResult ordering query
          eventDate: user.createdAt.toISOString(),
          metadata: { aiResultCount: user._count.aiResults },
        });
      }

      // # ---- Event: fifth_ai_use ----
      // # Power-user milestone — reached 5 AI uses (high upgrade intent signal)
      if (user._count.aiResults >= 5) {
        events.push({
          userId: user.id,
          email: user.email,
          eventType: "fifth_ai_use",
          utmSource: utm.source,
          utmMedium: utm.medium,
          utmCampaign: utm.campaign,
          utmTerm: utm.term,
          utmContent: utm.content,
          eventDate: user.createdAt.toISOString(),
          metadata: { aiResultCount: user._count.aiResults },
        });
      }

      // # ---- Event: pro_upgrade ----
      // # User has upgraded to a paid plan
      if (user.plan === "pro") {
        events.push({
          userId: user.id,
          email: user.email,
          eventType: "pro_upgrade",
          utmSource: utm.source,
          utmMedium: utm.medium,
          utmCampaign: utm.campaign,
          utmTerm: utm.term,
          utmContent: utm.content,
          eventDate: user.createdAt.toISOString(),
          metadata: { plan: user.plan },
        });
      }
    }

    // # Return the flat list of events — Marketing HQ aggregates them into funnel metrics
    return NextResponse.json(events);
  } catch (err) {
    console.error("Internal funnel events failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
