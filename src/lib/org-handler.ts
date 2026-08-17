/* ============================================================
   ORG HANDLER — Authorization wrapper for /api/org/* routes
   ============================================================
   Composes with authHandler: resolves OrganizationMember for the
   authenticated user + orgId from URL params. Returns 403 unless
   the member's role meets the minimum required role.

   Role hierarchy: candidate < coach < admin < owner

   Usage:
     export const GET = orgHandler(async (req, session, membership) => {
       // membership.role guaranteed >= minRole
       return NextResponse.json({ ok: true });
     }, "coach");
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { dbRetry } from "@/lib/db-retry";

/* # Role hierarchy — higher index = more permissions */
const ROLE_LEVELS: Record<string, number> = {
  candidate: 0,
  coach: 1,
  admin: 2,
  owner: 3,
};

/* # Membership info passed to route handlers */
export interface OrgMembership {
  memberId: string;
  organizationId: string;
  role: string;
  userId: string;
}

/* # Route handler type with session + membership */
type OrgRouteHandler = (
  req: NextRequest,
  session: AuthSession,
  membership: OrgMembership,
  params: Record<string, string>
) => Promise<Response | NextResponse>;

/* # Main wrapper — checks auth + org membership + role level */
export function orgHandler(handler: OrgRouteHandler, minRole: string = "candidate") {
  return authHandler(async (req: NextRequest, session: AuthSession, context: { params: Promise<Record<string, string>> }) => {
    /* # Resolve dynamic route params */
    const params = await context.params;
    const orgId = params.orgId;

    if (!orgId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 });
    }

    /* # Check cache first for membership lookups */
    const cacheKey = `org:member:${orgId}:${session.user.id}`;
    const cached = await cacheGet<string>(cacheKey);
    let membership: OrgMembership | null = null;

    if (cached) {
      try {
        membership = JSON.parse(cached);
      } catch {
        /* # Invalid cache — fall through to DB lookup */
      }
    }

    if (!membership) {
      /* # Resolve membership from DB with retry for transient failures */
      const member = await dbRetry(() =>
        prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: orgId,
              userId: session.user.id,
            },
          },
          select: {
            id: true,
            organizationId: true,
            role: true,
            userId: true,
          },
        })
      );

      if (!member) {
        return NextResponse.json({ error: "Not a member of this organization" }, { status: 403 });
      }

      membership = {
        memberId: member.id,
        organizationId: member.organizationId,
        role: member.role,
        userId: member.userId,
      };

      /* # Cache for 60s to avoid repeated DB lookups on page loads */
      await cacheSet(cacheKey, JSON.stringify(membership), 60);
    }

    /* # Check role level against minimum required */
    const userLevel = ROLE_LEVELS[membership.role] ?? 0;
    const requiredLevel = ROLE_LEVELS[minRole] ?? 0;

    if (userLevel < requiredLevel) {
      return NextResponse.json(
        { error: `Requires ${minRole} role or higher` },
        { status: 403 }
      );
    }

    return handler(req, session, membership, params);
  });
}
