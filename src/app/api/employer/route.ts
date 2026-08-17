/* ============================================================
   EMPLOYER ACCOUNT — GET/POST /api/employer
   ============================================================
   GET: list employer accounts the user belongs to.
   POST: create a new employer account (user becomes owner).
   Rate limited: 3 creations/hour per user.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { createEmployerSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { createRateLimiter } from "@/lib/rate-limit";
import { audit, getClientIp } from "@/lib/audit";
import { dbRetry } from "@/lib/db-retry";

/* # 3 employer accounts per hour per user — prevents spam */
const employerCreateLimit = createRateLimiter({ maxRequests: 3, windowMs: 60 * 60_000 });

/* # GET: list employer accounts the user belongs to */
export const GET = authHandler(async (_req, session) => {
  const memberships = await dbRetry(() =>
    prisma.employerMember.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        employer: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            logoUrl: true,
            plan: true,
            verifiedAt: true,
            deletedAt: true,
          },
        },
      },
    })
  );

  /* # Filter out soft-deleted employers */
  const active = memberships.filter(m => !m.employer.deletedAt);

  return NextResponse.json({ employers: active });
});

/* # POST: create new employer account */
export const POST = authHandler(async (req: NextRequest, session) => {
  /* # Rate limit check */
  const { allowed } = await employerCreateLimit.check(session.user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  /* # Validate input */
  const body = await req.json();
  const parsed = createEmployerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Check slug uniqueness */
  const existing = await prisma.employer.findFirst({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This URL slug is already taken" },
      { status: 409 }
    );
  }

  /* # Create employer + add creator as owner in a transaction */
  const employer = await dbRetry(() =>
    prisma.$transaction(async (tx) => {
      const emp = await tx.employer.create({
        data: {
          name: parsed.data.name,
          slug: parsed.data.slug,
          industry: parsed.data.industry,
          size: parsed.data.size,
          website: parsed.data.website || null,
          description: parsed.data.description,
          location: parsed.data.location,
          remoteFriendly: parsed.data.remoteFriendly,
        },
      });

      /* # Creator becomes the owner */
      await tx.employerMember.create({
        data: {
          employerId: emp.id,
          userId: session.user.id,
          role: "owner",
        },
      });

      return emp;
    })
  );

  audit("employer.created", {
    userId: session.user.id,
    detail: `Created employer: ${employer.name} (${employer.id})`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ employer }, { status: 201 });
});
