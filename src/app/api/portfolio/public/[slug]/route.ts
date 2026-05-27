/* ============================================================
   PUBLIC PORTFOLIO API - Fetch published portfolio by slug
   ============================================================
   GET /api/portfolio/public/[slug] — no auth required
   Returns portfolio data only if published is true.
   Used by the /p/[slug] public page for SSR.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
  });

  /* # Only return published portfolios */
  if (!portfolio || !portfolio.published) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  return NextResponse.json({
    portfolio: {
      id: portfolio.id,
      slug: portfolio.slug,
      title: portfolio.title,
      tagline: portfolio.tagline,
      bio: portfolio.bio,
      template: portfolio.template,
      themeColors: portfolio.themeColors ? JSON.parse(portfolio.themeColors) : null,
      socialLinks: portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : null,
      avatarUrl: portfolio.avatarUrl,
      published: portfolio.published,
      sections: JSON.parse(portfolio.sections),
      userName: portfolio.user.name,
      userImage: portfolio.user.image,
    },
  });
}
