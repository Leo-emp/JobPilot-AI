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
import { createPortfolioSchema, updatePortfolioSchema, formatZodError } from "@/lib/validations";
import { getDefaultSections } from "@/lib/portfolio-types";

/* ---- GET: Fetch the logged-in user's portfolio ---- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });

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
}

/* ---- POST: Create a new portfolio ---- */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Check if user already has a portfolio */
  const existing = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a portfolio. Update it instead." }, { status: 409 });
  }

  const body = await req.json();
  const parsed = createPortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* # Check slug uniqueness */
  const slugTaken = await prisma.portfolio.findUnique({ where: { slug: parsed.data.slug } });
  if (slugTaken) {
    return NextResponse.json({ error: "This URL is already taken. Choose a different one." }, { status: 409 });
  }

  const portfolio = await prisma.portfolio.create({
    data: {
      userId: session.user.id,
      slug: parsed.data.slug,
      title: parsed.data.title,
      tagline: parsed.data.tagline || null,
      template: parsed.data.template,
      sections: JSON.stringify(getDefaultSections()),
    },
  });

  return NextResponse.json({
    portfolio: {
      ...portfolio,
      sections: JSON.parse(portfolio.sections),
    },
  }, { status: 201 });
}

/* ---- PATCH: Update the user's portfolio ---- */
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updatePortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* # If slug is changing, check uniqueness */
  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.portfolio.findUnique({ where: { slug: parsed.data.slug } });
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

  const portfolio = await prisma.portfolio.update({
    where: { userId: session.user.id },
    data: updateData,
  });

  return NextResponse.json({
    portfolio: {
      ...portfolio,
      sections: JSON.parse(portfolio.sections),
      themeColors: portfolio.themeColors ? JSON.parse(portfolio.themeColors) : null,
      socialLinks: portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : null,
    },
  });
}

/* ---- DELETE: Delete the user's portfolio ---- */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  await prisma.portfolio.delete({ where: { userId: session.user.id } });

  return NextResponse.json({ success: true });
}
