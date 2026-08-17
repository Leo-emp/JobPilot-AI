/* ============================================================
   EMPLOYER HANDLER — Authorization wrapper for /api/employer/* routes
   ============================================================
   Mirrors orgHandler: resolves EmployerMember for the authenticated
   user + empId from URL params. Returns 403 unless the member's
   role meets the minimum required role.

   Role hierarchy: recruiter < admin < owner

   Usage:
     export const GET = employerHandler(async (req, session, membership) => {
       return NextResponse.json({ ok: true });
     }, "recruiter");
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { cacheGet, cacheSet } from "@/lib/redis";
import { dbRetry } from "@/lib/db-retry";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # Role hierarchy — higher index = more permissions */
const ROLE_LEVELS: Record<string, number> = {
  recruiter: 0,
  admin: 1,
  owner: 2,
};

/* # Membership info passed to route handlers */
export interface EmployerMembership {
  memberId: string;
  employerId: string;
  role: string;
  userId: string;
}

/* # Route handler type with session + membership */
type EmployerRouteHandler = (
  req: NextRequest,
  session: AuthSession,
  membership: EmployerMembership,
  params: Record<string, string>
) => Promise<Response | NextResponse>;

/* # Main wrapper — checks auth + employer membership + role level */
export function employerHandler(handler: EmployerRouteHandler, minRole: string = "recruiter") {
  return authHandler(async (req: NextRequest, session: AuthSession, context: { params: Promise<Record<string, string>> }) => {
    /* # B2B feature gate — all employer routes return 404 when B2B is disabled */
    if (!isB2BEnabled()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    /* # Resolve dynamic route params */
    const params = await context.params;
    const empId = params.empId;

    if (!empId) {
      return NextResponse.json({ error: "Employer ID required" }, { status: 400 });
    }

    /* # Check cache first */
    const cacheKey = `emp:member:${empId}:${session.user.id}`;
    const cached = await cacheGet<string>(cacheKey);
    let membership: EmployerMembership | null = null;

    if (cached) {
      try {
        membership = JSON.parse(cached);
      } catch {
        /* # Invalid cache — fall through to DB */
      }
    }

    if (!membership) {
      /* # Resolve membership from DB */
      const member = await dbRetry(() =>
        prisma.employerMember.findUnique({
          where: {
            employerId_userId: {
              employerId: empId,
              userId: session.user.id,
            },
          },
          select: {
            id: true,
            employerId: true,
            role: true,
            userId: true,
          },
        })
      );

      if (!member) {
        return NextResponse.json({ error: "Not a member of this employer" }, { status: 403 });
      }

      membership = {
        memberId: member.id,
        employerId: member.employerId,
        role: member.role,
        userId: member.userId,
      };

      /* # Cache for 60s */
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
