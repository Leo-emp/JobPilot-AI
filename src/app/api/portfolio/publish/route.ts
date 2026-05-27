/* ============================================================
   PORTFOLIO PUBLISH API - Toggle public visibility
   ============================================================
   POST /api/portfolio/publish — set published true/false
   Requires at least one visible section before publishing.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishPortfolioSchema, formatZodError } from "@/lib/validations";
import type { PortfolioSection } from "@/lib/portfolio-types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
  });
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

  const updated = await prisma.portfolio.update({
    where: { userId: session.user.id },
    data: { published: parsed.data.published },
  });

  return NextResponse.json({
    published: updated.published,
    url: updated.published ? `/p/${updated.slug}` : null,
  });
}
