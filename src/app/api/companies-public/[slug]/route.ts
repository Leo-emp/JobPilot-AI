/* ============================================================
   PUBLIC COMPANY PROFILE — GET /api/companies-public/[slug]
   ============================================================
   Public route. Shows employer profile + their active roles.
   Uses slug (not ID) for SEO-friendly URLs.
   Rate limited by IP.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/audit";
import { dbRetry } from "@/lib/db-retry";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # Rate limit: 60 requests/minute per IP */
const companyLimit = createRateLimiter({ maxRequests: 60, windowMs: 60_000 });

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  /* # Rate limit by IP */
  const ip = getClientIp(req.headers) || "unknown";
  const { allowed } = await companyLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { slug } = await context.params;

  /* # Fetch employer by slug with their active roles */
  const employer = await dbRetry(() =>
    prisma.employer.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        size: true,
        website: true,
        description: true,
        location: true,
        remoteFriendly: true,
        logoUrl: true,
        verifiedAt: true,
        createdAt: true,
        /* # Only include active published roles */
        roles: {
          where: {
            status: "active",
            publishedAt: { not: null },
          },
          select: {
            id: true,
            title: true,
            locationType: true,
            location: true,
            employmentType: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            industry: true,
            urgency: true,
            publishedAt: true,
          },
          orderBy: { publishedAt: "desc" },
        },
      },
    })
  );

  if (!employer) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ employer });
}
