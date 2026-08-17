/* ============================================================
   PUBLIC JOB BOARD — GET /api/roles
   ============================================================
   Public route (no auth required). Lists active, published roles.
   Supports pagination, search, and filtering.
   Rate limited by IP to prevent scraping.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/audit";
import { dbRetry } from "@/lib/db-retry";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # Rate limit: 60 requests/minute per IP for public browsing */
const browseLimit = createRateLimiter({ maxRequests: 60, windowMs: 60_000 });

export async function GET(req: NextRequest) {
  /* # B2B gate — public job board only available when B2B is enabled */
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  /* # Rate limit by IP */
  const ip = getClientIp(req.headers) || "unknown";
  const { allowed } = await browseLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const url = new URL(req.url);

  /* # Pagination params */
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  /* # Search and filter params */
  const search = url.searchParams.get("search")?.trim();
  const locationType = url.searchParams.get("locationType");
  const employmentType = url.searchParams.get("employmentType");
  const industry = url.searchParams.get("industry");

  /* # Build where clause — only active (published) roles */
  const where: Record<string, unknown> = {
    status: "active",
    publishedAt: { not: null },
  };

  /* # Full-text search on title and description */
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { skills: { contains: search } },
    ];
  }

  if (locationType) where.locationType = locationType;
  if (employmentType) where.employmentType = employmentType;
  if (industry) where.industry = industry;

  /* # Fetch roles + count in parallel */
  const [roles, total] = await dbRetry(() =>
    Promise.all([
      prisma.role.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          locationType: true,
          location: true,
          employmentType: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          skills: true,
          industry: true,
          urgency: true,
          publishedAt: true,
          employer: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              industry: true,
              size: true,
              verifiedAt: true,
            },
          },
        },
        orderBy: [
          /* # Urgent roles first, then by publish date */
          { urgency: "desc" },
          { publishedAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.role.count({ where }),
    ])
  );

  return NextResponse.json({
    roles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
