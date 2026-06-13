/* ============================================================
   PORTFOLIO API - CRUD for user's portfolio
   ============================================================
   GET    /api/portfolio — fetch the user's portfolio
   POST   /api/portfolio — create a new portfolio
   PATCH  /api/portfolio — update portfolio data
   DELETE /api/portfolio — delete the portfolio
   All endpoints require authentication.
   One portfolio per user (userId is unique).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortfolioSchema, updatePortfolioSchema, validateSections, formatZodError } from "@/lib/validations";
import { getDefaultSections } from "@/lib/portfolio-types";
import { safeHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";
import { createRateLimiter } from "@/lib/rate-limit";

/* # Write rate limiter — 20 writes per minute per user (Redis-backed) */
const writeLimiter = createRateLimiter({ maxRequests: 20, windowMs: 60_000 });

/* # Max request body size: 500KB */
const MAX_BODY_SIZE = 512_000;

/* ---- GET: Fetch the logged-in user's portfolio ---- */
export const GET = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await dbRetry(() =>
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })
  );

  if (!portfolio) {
    return NextResponse.json({ portfolio: null });
  }

  return NextResponse.json({
    portfolio: {
      ...portfolio,
      sections: JSON.parse(portfolio.sections),
      themeColors: portfolio.themeColors ? JSON.parse(portfolio.themeColors) : null,
      socialLinks: portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : null,
    },
  });
});

/* ---- POST: Create a new portfolio ---- */
export const POST = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const writeCheck = await writeLimiter.check(`portfolio-write:${session.user.id}`);
  if (!writeCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  /* # Enforce body size limit */
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 });
  }

  /* # Check if user already has a portfolio */
  const existing = await dbRetry(() =>
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })
  );
  if (existing) {
    return NextResponse.json({ error: "You already have a portfolio. Update it instead." }, { status: 409 });
  }

  const body = await req.json();
  const parsed = createPortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* # Check slug uniqueness */
  const slugTaken = await dbRetry(() =>
    prisma.portfolio.findUnique({ where: { slug: parsed.data.slug } })
  );
  if (slugTaken) {
    return NextResponse.json({ error: "This URL is already taken. Choose a different one." }, { status: 409 });
  }

  const portfolio = await dbRetry(() =>
    prisma.portfolio.create({
      data: {
        userId: session.user.id,
        slug: parsed.data.slug,
        title: parsed.data.title,
        tagline: parsed.data.tagline || null,
        template: parsed.data.template,
        sections: JSON.stringify(getDefaultSections()),
      },
    })
  );

  return NextResponse.json({
    portfolio: {
      ...portfolio,
      sections: JSON.parse(portfolio.sections),
    },
  }, { status: 201 });
});

/* ---- PATCH: Update the user's portfolio ---- */
export const PATCH = safeHandler(async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const writeCheck = await writeLimiter.check(`portfolio-write:${session.user.id}`);
  if (!writeCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  /* # Enforce body size limit */
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json({ error: "Request body too large (max 500KB)." }, { status: 413 });
  }

  const existing = await dbRetry(() =>
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })
  );
  if (!existing) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updatePortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* # Deep-validate sections JSON structure if provided */
  if (parsed.data.sections) {
    const sectionsCheck = validateSections(parsed.data.sections);
    if (!sectionsCheck.valid) {
      return NextResponse.json({ error: sectionsCheck.error }, { status: 400 });
    }
  }

  /* # If slug is changing, check uniqueness */
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await dbRetry(() =>
      prisma.portfolio.findUnique({ where: { slug: parsed.data.slug } })
    );
    if (slugTaken) {
      return NextResponse.json({ error: "This URL is already taken." }, { status: 409 });
    }
  }

  /* # Build update data — only include fields that were provided */
  const updateData: Record<string, unknown> = {};
  if (parsed.data.slug !== undefined) updateData.slug = parsed.data.slug;
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.tagline !== undefined) updateData.tagline = parsed.data.tagline || null;
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio || null;
  if (parsed.data.template !== undefined) updateData.template = parsed.data.template;
  if (parsed.data.themeColors !== undefined) updateData.themeColors = parsed.data.themeColors || null;
  if (parsed.data.socialLinks !== undefined) updateData.socialLinks = parsed.data.socialLinks || null;
  if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl || null;
  if (parsed.data.sections !== undefined) updateData.sections = parsed.data.sections;

  const portfolio = await dbRetry(() =>
    prisma.portfolio.update({
      where: { userId: session.user.id },
      data: updateData,
    })
  );

  return NextResponse.json({
    portfolio: {
      ...portfolio,
      sections: JSON.parse(portfolio.sections),
      themeColors: portfolio.themeColors ? JSON.parse(portfolio.themeColors) : null,
      socialLinks: portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : null,
    },
  });
});

/* ---- DELETE: Delete the user's portfolio ---- */
export const DELETE = safeHandler(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const writeCheck = await writeLimiter.check(`portfolio-write:${session.user.id}`);
  if (!writeCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const existing = await dbRetry(() =>
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })
  );
  if (!existing) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  await dbRetry(() =>
    prisma.portfolio.delete({ where: { userId: session.user.id } })
  );

  return NextResponse.json({ success: true });
});
