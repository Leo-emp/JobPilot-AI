/* ============================================================
   EMPLOYER DETAIL — GET/PATCH /api/employer/[empId]
   ============================================================
   GET: recruiter+ — view employer profile.
   PATCH: admin+ — update employer profile.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employerHandler } from "@/lib/employer-handler";
import { updateEmployerSchema } from "@/lib/employer-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";

/* # GET: employer profile — recruiter+ role */
export const GET = employerHandler(async (_req, _session, membership) => {
  const employer = await dbRetry(() =>
    prisma.employer.findUnique({
      where: { id: membership.employerId },
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
        plan: true,
        verifiedAt: true,
        createdAt: true,
        _count: {
          select: { members: true, roles: true },
        },
      },
    })
  );

  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 });
  }

  return NextResponse.json({ employer, role: membership.role });
}, "recruiter");

/* # PATCH: update employer profile — admin+ role */
export const PATCH = employerHandler(async (req: NextRequest, session, membership) => {
  const body = await req.json();
  const parsed = updateEmployerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Filter out empty string website (convert to null) */
  const data = { ...parsed.data };
  if (data.website === "") data.website = undefined;

  const updated = await dbRetry(() =>
    prisma.employer.update({
      where: { id: membership.employerId },
      data,
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
        plan: true,
      },
    })
  );

  audit("employer.updated", {
    userId: session.user.id,
    detail: `Updated employer: ${updated.name} (${updated.id})`,
    ip: getClientIp(req.headers),
  });

  await cacheDel(`emp:member:${membership.employerId}:${session.user.id}`);

  return NextResponse.json({ employer: updated });
}, "admin");
