/* ============================================================
   ORG LIST — GET /api/org
   ============================================================
   Returns all organizations the authenticated user belongs to.
   Used for the org switcher in the UI header.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

/* # GET: list all orgs the current user is a member of */
export const GET = authHandler(async (_req, session) => {
  /* # Fetch memberships with org details for the switcher */
  const memberships = await dbRetry(() =>
    prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        cohort: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            plan: true,
            logoUrl: true,
            deletedAt: true,
          },
        },
      },
    })
  );

  /* # Filter out soft-deleted orgs */
  const active = memberships.filter(m => !m.organization.deletedAt);

  return NextResponse.json({ organizations: active });
});
