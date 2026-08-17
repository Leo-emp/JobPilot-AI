/* ============================================================
   PUBLIC ROLE DETAIL — GET /api/roles/[roleId]
   ============================================================
   Public route (no auth required). Shows full details of a
   single active role. Rate limited by IP.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/audit";
import { dbRetry } from "@/lib/db-retry";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # Rate limit: 60 requests/minute per IP */
const roleDetailLimit = createRateLimiter({ maxRequests: 60, windowMs: 60_000 });

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ roleId: string }> }
) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  /* # Rate limit by IP */
  const ip = getClientIp(req.headers) || "unknown";
  const { allowed } = await roleDetailLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { roleId } = await context.params;

  /* # Only show active, published roles publicly */
  const role = await dbRetry(() =>
    prisma.role.findFirst({
      where: {
        id: roleId,
        status: "active",
        publishedAt: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        skills: true,
        niceToHaveSkills: true,
        experienceMin: true,
        experienceMax: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        locationType: true,
        location: true,
        employmentType: true,
        industry: true,
        education: true,
        urgency: true,
        candidatesNeeded: true,
        publishedAt: true,
        employer: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            industry: true,
            size: true,
            website: true,
            description: true,
            location: true,
            remoteFriendly: true,
            verifiedAt: true,
          },
        },
      },
    })
  );

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  return NextResponse.json({ role });
}
