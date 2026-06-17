/* ============================================================
   PORTFOLIO PUBLISH API - Toggle public visibility
   ============================================================
   POST /api/portfolio/publish — set published true/false
   Requires at least one visible section before publishing.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishPortfolioSchema, formatZodError } from "@/lib/validations";
import type { PortfolioSection } from "@/lib/portfolio-types";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";
import { createRateLimiter } from "@/lib/rate-limit";

/* # Publish rate limiter — 10 toggles per minute per user (Redis-backed) */
const publishLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });

export const POST = authHandler(async (req, session) => {

  const publishCheck = await publishLimiter.check(`portfolio-publish:${session.user.id}`);
  if (!publishCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const portfolio = await dbRetry(() =>
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })
  );
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found. Create one first." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = publishPortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* # Before publishing, verify at least one visible section with content */
  if (parsed.data.published) {
    const sections: PortfolioSection[] = JSON.parse(portfolio.sections);
    const hasVisibleContent = sections.some((s) => s.visible);
    if (!hasVisibleContent) {
      return NextResponse.json(
        { error: "Add at least one visible section before publishing." },
        { status: 400 }
      );
    }
  }

  const updated = await dbRetry(() =>
    prisma.portfolio.update({
      where: { userId: session.user.id },
      data: { published: parsed.data.published },
    })
  );

  return NextResponse.json({
    published: updated.published,
    url: updated.published ? `/p/${updated.slug}` : null,
  });
});
