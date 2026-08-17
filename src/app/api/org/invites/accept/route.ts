/* ============================================================
   ACCEPT INVITE — POST /api/org/invites/accept
   ============================================================
   Public route (no session required — token-based auth).
   Validates the invite token, creates org membership,
   and marks the invite as accepted.

   Flow:
   1. Hash the provided token → lookup invite by tokenHash
   2. If user is logged in → create membership immediately
   3. If not logged in → return login redirect URL
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { acceptInviteSchema } from "@/lib/org-validations";
import { formatZodError } from "@/lib/validations";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { audit, getClientIp } from "@/lib/audit";
import { cacheDel } from "@/lib/redis";
import { createRateLimiter } from "@/lib/rate-limit";

/* # 20 accept attempts per hour per IP — prevents brute-forcing tokens */
const acceptLimit = createRateLimiter({ maxRequests: 20, windowMs: 60 * 60_000 });

/* # SHA-256 to match how we stored the token */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const POST = safeHandler(async (req: NextRequest) => {
  /* # Rate limit by IP since this is a public route */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = await acceptLimit.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  /* # Validate input */
  const body = await req.json();
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Hash the token to look up the invite */
  const tokenHash = hashToken(parsed.data.token);

  /* # Find the invite by hashed token */
  const invite = await dbRetry(() =>
    prisma.organizationInvite.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        organizationId: true,
        email: true,
        role: true,
        cohort: true,
        expiresAt: true,
        acceptedAt: true,
        organization: {
          select: { name: true, deletedAt: true },
        },
      },
    })
  );

  if (!invite) {
    return NextResponse.json(
      { error: "Invalid or expired invite link." },
      { status: 404 }
    );
  }

  /* # Check if already accepted */
  if (invite.acceptedAt) {
    return NextResponse.json(
      { error: "This invite has already been accepted." },
      { status: 400 }
    );
  }

  /* # Check if expired */
  if (invite.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This invite has expired. Ask your admin to send a new one." },
      { status: 410 }
    );
  }

  /* # Check if org is still active */
  if (invite.organization.deletedAt) {
    return NextResponse.json(
      { error: "This organization is no longer active." },
      { status: 410 }
    );
  }

  /* # Check if user is logged in */
  const session = await auth();

  if (!session?.user?.id) {
    /* # Not logged in — return org info + redirect hint */
    return NextResponse.json({
      requiresAuth: true,
      orgName: invite.organization.name,
      email: invite.email,
      role: invite.role,
    });
  }

  /* # Check if already a member */
  const existingMember = await dbRetry(() =>
    prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: invite.organizationId,
          userId: session.user.id,
        },
      },
    })
  );

  if (existingMember) {
    /* # Already a member — mark invite as accepted and return success */
    await dbRetry(() =>
      prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      })
    );
    return NextResponse.json({
      accepted: true,
      orgId: invite.organizationId,
      orgName: invite.organization.name,
      alreadyMember: true,
    });
  }

  /* # Create membership + mark invite accepted in a transaction */
  await dbRetry(() =>
    prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          organizationId: invite.organizationId,
          userId: session.user.id,
          role: invite.role,
          cohort: invite.cohort,
        },
      }),
      prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      }),
    ])
  );

  audit("org.member.accepted", {
    userId: session.user.id,
    detail: `Accepted invite to ${invite.organization.name} (${invite.organizationId}) as ${invite.role}`,
    ip: getClientIp(req.headers),
  });

  /* # Clear effective plan cache so sponsorship kicks in immediately */
  await cacheDel(`effectivePlan:${session.user.id}`);

  return NextResponse.json({
    accepted: true,
    orgId: invite.organizationId,
    orgName: invite.organization.name,
    role: invite.role,
  });
});
