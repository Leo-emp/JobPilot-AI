/* ============================================================
   ORG DETAIL — GET/PATCH /api/org/[orgId]
   ============================================================
   GET: coach+ role — view org profile and member counts.
   PATCH: admin+ role — update org name, logo, billing email.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { updateOrgSchema } from "@/lib/org-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";

/* # GET: org profile with member counts — coach+ role */
export const GET = orgHandler(async (_req, _session, membership) => {
  const org = await dbRetry(() =>
    prisma.organization.findUnique({
      where: { id: membership.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        plan: true,
        seatLimit: true,
        billingEmail: true,
        logoUrl: true,
        createdAt: true,
        _count: {
          select: { members: true, invites: true },
        },
      },
    })
  );

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  return NextResponse.json({ organization: org, role: membership.role });
}, "coach");

/* # PATCH: update org profile — admin+ role */
export const PATCH = orgHandler(async (req: NextRequest, session, membership) => {
  /* # Validate input */
  const body = await req.json();
  const parsed = updateOrgSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Update org record */
  const updated = await dbRetry(() =>
    prisma.organization.update({
      where: { id: membership.organizationId },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        plan: true,
        seatLimit: true,
        billingEmail: true,
        logoUrl: true,
      },
    })
  );

  audit("org.updated", {
    userId: session.user.id,
    detail: `Updated org: ${updated.name} (${updated.id})`,
    ip: getClientIp(req.headers),
  });

  /* # Clear membership caches so changes propagate */
  await cacheDel(`org:member:${membership.organizationId}:${session.user.id}`);

  return NextResponse.json({ organization: updated });
}, "admin");
