/* ============================================================
   OUTREACH QUEUE — Process queued outreach emails
   ============================================================
   Called by the /api/cron/outreach cron every 15 minutes.
   Processes up to 20 queued outreach emails per run:

   1. Fetch queued outreach records (oldest first)
   2. Check suppression list for each email
   3. Send via Resend
   4. Update status to "sent"
   5. Generate follow-ups for sent emails (3-day, 7-day)

   Also handles:
   - Bounce rate monitoring (auto-pause at > 10%)
   - Follow-up scheduling
   - Role deletion → cancel all queued outreach
   ============================================================ */

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

/* # Lazy-init Resend client */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/* # Max emails to send per cron run */
const BATCH_SIZE = 20;

/* # Max outreach emails per role per day */
const MAX_PER_ROLE_PER_DAY = 50;

/* # Max follow-ups per candidate */
const MAX_FOLLOW_UPS = 2;

/* # Follow-up delays in days */
const FOLLOW_UP_DELAYS = [3, 7];

/* # Bounce rate threshold for auto-pause */
const BOUNCE_RATE_THRESHOLD = 0.10;

/* # Result of processing the outreach queue */
export interface QueueProcessResult {
  sent: number;
  suppressed: number;
  failed: number;
  skippedRateLimit: number;
  paused: string[];    // Role IDs auto-paused due to bounce rate
}

/* # Process the outreach queue */
export async function processOutreachQueue(): Promise<QueueProcessResult> {
  const result: QueueProcessResult = {
    sent: 0,
    suppressed: 0,
    failed: 0,
    skippedRateLimit: 0,
    paused: [],
  };

  /* # Fetch queued outreach emails, oldest first */
  const queued = await dbRetry(() =>
    prisma.outreach.findMany({
      where: { status: "queued" },
      orderBy: { createdAt: "asc" },
      take: BATCH_SIZE,
    })
  );

  if (queued.length === 0) return result;

  /* # Track per-role daily send counts to enforce limits */
  const roleDailyCounts = new Map<string, number>();

  for (const outreach of queued) {
    /* # Check per-role daily limit */
    if (!roleDailyCounts.has(outreach.roleId)) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const count = await prisma.outreach.count({
        where: {
          roleId: outreach.roleId,
          status: "sent",
          sentAt: { gte: today },
        },
      });
      roleDailyCounts.set(outreach.roleId, count);
    }

    if ((roleDailyCounts.get(outreach.roleId) ?? 0) >= MAX_PER_ROLE_PER_DAY) {
      result.skippedRateLimit++;
      continue;
    }

    /* # Check suppression list */
    const suppressed = await dbRetry(() =>
      prisma.emailSuppression.findUnique({
        where: { email: outreach.email.toLowerCase() },
      })
    );

    if (suppressed) {
      await dbRetry(() =>
        prisma.outreach.update({
          where: { id: outreach.id },
          data: { status: "cancelled" },
        })
      );
      audit("outreach.suppressed", {
        detail: `email:${outreach.email} reason:${suppressed.reason}`,
      });
      result.suppressed++;
      continue;
    }

    /* # Check bounce rate for this role */
    const bounceCheck = await checkBounceRate(outreach.roleId);
    if (bounceCheck.shouldPause) {
      if (!result.paused.includes(outreach.roleId)) {
        result.paused.push(outreach.roleId);
        /* # Notify employer about high bounce rate */
        await notifyBounceRateAlert(outreach.roleId);
      }
      continue;
    }

    /* # Send the email via Resend */
    try {
      await getResend().emails.send({
        from: "JobPilot AI <noreply@jobpilotai.co>",
        to: outreach.email,
        subject: outreach.subject,
        text: outreach.body,
      });

      /* # Update status to sent */
      await dbRetry(() =>
        prisma.outreach.update({
          where: { id: outreach.id },
          data: { status: "sent", sentAt: new Date() },
        })
      );

      /* # Update the CandidateMatch status if linked */
      if (outreach.candidateMatchId) {
        await prisma.candidateMatch.updateMany({
          where: { id: outreach.candidateMatchId, status: "new" },
          data: { status: "contacted" },
        }).catch(() => {});
      }

      audit("outreach.sent", {
        detail: `role:${outreach.roleId} email:${outreach.email} followUp:${outreach.followUpNumber}`,
      });

      roleDailyCounts.set(
        outreach.roleId,
        (roleDailyCounts.get(outreach.roleId) ?? 0) + 1,
      );
      result.sent++;
    } catch (err) {
      console.error("[outreach-queue] Send failed:", err);
      result.failed++;
    }
  }

  return result;
}

/* # Check bounce rate for a role — auto-pause if > 10% */
async function checkBounceRate(roleId: string): Promise<{
  shouldPause: boolean;
  bounceRate: number;
}> {
  const [total, bounced] = await Promise.all([
    prisma.outreach.count({
      where: { roleId, status: { in: ["sent", "delivered", "opened", "replied", "bounced"] } },
    }),
    prisma.outreach.count({
      where: { roleId, status: "bounced" },
    }),
  ]);

  /* # Need at least 10 sent emails before checking rate */
  if (total < 10) return { shouldPause: false, bounceRate: 0 };

  const bounceRate = bounced / total;
  return {
    shouldPause: bounceRate > BOUNCE_RATE_THRESHOLD,
    bounceRate,
  };
}

/* # Notify employer members about high bounce rate */
async function notifyBounceRateAlert(roleId: string): Promise<void> {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { title: true, employerId: true },
  });
  if (!role) return;

  const members = await prisma.employerMember.findMany({
    where: { employerId: role.employerId },
    select: { userId: true },
  });

  for (const member of members) {
    await notify(
      member.userId,
      "system",
      `Outreach paused for "${role.title}" due to high bounce rate`,
      {
        body: "More than 10% of outreach emails bounced. Review email quality and candidate sources.",
        linkUrl: `/employer/${role.employerId}/roles`,
      },
    ).catch(() => {});
  }
}

/* # Queue follow-up emails for sent outreach that had no response */
export async function queueFollowUps(): Promise<number> {
  let followUpsQueued = 0;

  for (let i = 0; i < FOLLOW_UP_DELAYS.length; i++) {
    const delayDays = FOLLOW_UP_DELAYS[i];
    const followUpNumber = i + 1;

    /* # Find sent outreach that's past the follow-up delay with no reply */
    const cutoff = new Date(Date.now() - delayDays * 24 * 60 * 60 * 1000);

    const needsFollowUp = await dbRetry(() =>
      prisma.outreach.findMany({
        where: {
          status: "sent",
          followUpNumber: followUpNumber - 1,
          sentAt: { lte: cutoff },
          repliedAt: null,
        },
        take: BATCH_SIZE,
      })
    );

    for (const original of needsFollowUp) {
      /* # Check if a follow-up already exists */
      const existingFollowUp = await prisma.outreach.findFirst({
        where: {
          externalCandidateId: original.externalCandidateId,
          roleId: original.roleId,
          followUpNumber,
        },
      });
      if (existingFollowUp) continue;

      /* # Check max follow-ups */
      if (followUpNumber > MAX_FOLLOW_UPS) continue;

      /* # Check suppression before queuing */
      const suppressed = await prisma.emailSuppression.findUnique({
        where: { email: original.email.toLowerCase() },
      });
      if (suppressed) continue;

      /* # Check if any reply (including negative) was received on ANY outreach to this email for this role */
      const anyReply = await prisma.outreach.findFirst({
        where: {
          email: original.email,
          roleId: original.roleId,
          replyClassification: { not: null },
        },
      });
      if (anyReply) {
        /* # Skip if reply was negative */
        if (anyReply.replyClassification === "negative") continue;
      }

      /* # Queue the follow-up (AI will generate the email in the next send cycle) */
      await dbRetry(() =>
        prisma.outreach.create({
          data: {
            roleId: original.roleId,
            externalCandidateId: original.externalCandidateId,
            candidateMatchId: original.candidateMatchId,
            email: original.email,
            subject: `Re: ${original.subject}`,
            body: `Following up on my previous email about the ${original.subject.split(" -- ")[0] ?? "role"} opportunity. Would love to hear your thoughts.\n\n---\nTo stop receiving these emails: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://jobpilotai.co"}/api/outreach/opt-out?email=${encodeURIComponent(original.email)}`,
            followUpNumber,
            inviteToken: original.inviteToken,
          },
        })
      );

      audit("outreach.followup.queued", {
        detail: `role:${original.roleId} email:${original.email} followUp:${followUpNumber}`,
      });

      followUpsQueued++;
    }
  }

  return followUpsQueued;
}

/* # Cancel all queued outreach for a role (called on role deletion) */
export async function cancelRoleOutreach(roleId: string): Promise<number> {
  const result = await dbRetry(() =>
    prisma.outreach.updateMany({
      where: { roleId, status: "queued" },
      data: { status: "cancelled" },
    })
  );

  if (result.count > 0) {
    audit("outreach.cancelled", {
      detail: `role:${roleId} cancelled:${result.count} queued outreach`,
    });
  }

  return result.count;
}
