/* ============================================================
   ORG INVITES — GET/POST/DELETE /api/org/[orgId]/invites
   ============================================================
   GET: admin+ — list pending/accepted invites.
   POST: admin+ — bulk invite candidates by email.
   DELETE: admin+ — revoke a pending invite.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { orgHandler } from "@/lib/org-handler";
import { bulkInviteSchema } from "@/lib/org-validations";
import { formatZodError } from "@/lib/validations";
import { buildInviteEmail } from "@/lib/invite-email";
import { dbRetry } from "@/lib/db-retry";
import { audit, getClientIp } from "@/lib/audit";
import { createRateLimiter } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

/* # 10 invite batches per hour per user — prevents spam */
const inviteLimit = createRateLimiter({ maxRequests: 10, windowMs: 60 * 60_000 });

/* # SHA-256 hash for storing invite tokens securely */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* # GET: list invites — admin+ role */
export const GET = orgHandler(async (req: NextRequest, _session, membership) => {
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // # pending, accepted, expired

  /* # Fetch all invites for this org */
  const invites = await dbRetry(() =>
    prisma.organizationInvite.findMany({
      where: { organizationId: membership.organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        cohort: true,
        expiresAt: true,
        acceptedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  );

  /* # Add computed status to each invite */
  const now = new Date();
  const withStatus = invites.map((inv) => ({
    ...inv,
    status: inv.acceptedAt
      ? "accepted"
      : inv.expiresAt < now
        ? "expired"
        : "pending",
  }));

  /* # Filter by status if requested */
  const filtered = status
    ? withStatus.filter((inv) => inv.status === status)
    : withStatus;

  return NextResponse.json({ invites: filtered });
}, "admin");

/* # POST: bulk invite — admin+ role */
export const POST = orgHandler(async (req: NextRequest, session, membership) => {
  /* # Rate limit */
  const { allowed } = await inviteLimit.check(session.user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many invite requests. Try again later." },
      { status: 429 }
    );
  }

  /* # Validate input */
  const body = await req.json();
  const parsed = bulkInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  /* # Check seat limit before sending */
  const [memberCount, pendingCount, org] = await Promise.all([
    dbRetry(() =>
      prisma.organizationMember.count({
        where: { organizationId: membership.organizationId },
      })
    ),
    dbRetry(() =>
      prisma.organizationInvite.count({
        where: {
          organizationId: membership.organizationId,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
      })
    ),
    dbRetry(() =>
      prisma.organization.findUnique({
        where: { id: membership.organizationId },
        select: { seatLimit: true, name: true },
      })
    ),
  ]);

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const available = org.seatLimit - memberCount - pendingCount;
  if (parsed.data.invites.length > available) {
    return NextResponse.json(
      { error: `Only ${available} seats available. Current: ${memberCount} members + ${pendingCount} pending invites.` },
      { status: 400 }
    );
  }

  /* # Get inviter name for the email */
  const inviter = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    })
  );

  /* # Process each invite */
  const results: { email: string; status: string }[] = [];
  const baseUrl = process.env.NEXTAUTH_URL || "https://jobpilotai.co";

  for (const invite of parsed.data.invites) {
    try {
      /* # Skip if already a member */
      const existingMember = await prisma.organizationMember.findFirst({
        where: {
          organizationId: membership.organizationId,
          user: { email: invite.email },
        },
      });
      if (existingMember) {
        results.push({ email: invite.email, status: "already_member" });
        continue;
      }

      /* # Skip if already has a pending invite */
      const existingInvite = await prisma.organizationInvite.findFirst({
        where: {
          organizationId: membership.organizationId,
          email: invite.email,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
      });
      if (existingInvite) {
        results.push({ email: invite.email, status: "already_invited" });
        continue;
      }

      /* # Generate a secure random token */
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);

      /* # Create the invite record */
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // # 14 days

      await dbRetry(() =>
        prisma.organizationInvite.create({
          data: {
            organizationId: membership.organizationId,
            email: invite.email,
            role: invite.role || "candidate",
            cohort: invite.cohort,
            tokenHash,
            expiresAt,
          },
        })
      );

      /* # Build accept URL with raw token */
      const acceptUrl = `${baseUrl}/invite/${rawToken}`;

      /* # Send email via Resend */
      const { subject, html } = buildInviteEmail({
        orgName: org.name,
        inviterName: inviter?.name || "A team member",
        acceptUrl,
        role: invite.role || "candidate",
        cohort: invite.cohort,
      });

      await resend.emails.send({
        from: "JobPilot AI <noreply@jobpilotai.co>",
        to: invite.email,
        subject,
        html,
      });

      results.push({ email: invite.email, status: "sent" });
    } catch (err) {
      console.error(`[org-invite] Failed for ${invite.email}:`, err);
      results.push({ email: invite.email, status: "failed" });
    }
  }

  audit("org.member.invited", {
    userId: session.user.id,
    detail: `Invited ${results.filter((r) => r.status === "sent").length} to org ${membership.organizationId}`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({
    results,
    sent: results.filter((r) => r.status === "sent").length,
    skipped: results.filter((r) => r.status !== "sent" && r.status !== "failed").length,
    failed: results.filter((r) => r.status === "failed").length,
  });
}, "admin");

/* # DELETE: revoke an invite — admin+ role */
export const DELETE = orgHandler(async (req: NextRequest, session, membership) => {
  const url = new URL(req.url);
  const inviteId = url.searchParams.get("id");

  if (!inviteId) {
    return NextResponse.json({ error: "Invite ID required" }, { status: 400 });
  }

  /* # Verify invite belongs to this org */
  const invite = await dbRetry(() =>
    prisma.organizationInvite.findFirst({
      where: {
        id: inviteId,
        organizationId: membership.organizationId,
      },
    })
  );

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.acceptedAt) {
    return NextResponse.json({ error: "Cannot revoke an accepted invite" }, { status: 400 });
  }

  /* # Delete the invite */
  await dbRetry(() =>
    prisma.organizationInvite.delete({ where: { id: inviteId } })
  );

  audit("org.member.invited", {
    userId: session.user.id,
    detail: `Revoked invite ${inviteId} for ${invite.email}`,
    ip: getClientIp(req.headers),
  });

  return NextResponse.json({ revoked: true });
}, "admin");
