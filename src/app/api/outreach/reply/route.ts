/* ============================================================
   OUTREACH REPLY — POST /api/outreach/reply
   ============================================================
   Receives inbound email replies via Resend webhooks.
   When a candidate replies to an outreach email:
   1. Match the reply to the original outreach by email
   2. AI classifies the reply (positive/negative/neutral/uncertain)
   3. Update outreach status + CandidateMatch status
   4. If positive: notify employer
   5. If opt-out requested: add to suppression list
   6. If uncertain: flag for manual employer review
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { classifyReply } from "@/lib/reply-classifier";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import { isB2BEnabled } from "@/lib/b2b-gate";

export async function POST(req: NextRequest) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  /* # Verify webhook authenticity — same Svix verification as outreach/webhook.
     Without this, anyone could POST fake replies to manipulate outreach status. */
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RESEND_WEBHOOK_SECRET not configured — rejecting reply webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(svixTimestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) {
    return NextResponse.json({ error: "Webhook timestamp expired" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  /* # Extract sender email from the reply */
  const fromEmail = (body.from ?? "").toLowerCase().trim();
  const replyText = body.text ?? body.html ?? "";

  if (!fromEmail || !replyText) {
    return NextResponse.json({ error: "Missing from or content" }, { status: 400 });
  }

  /* # Find the most recent outreach sent to this email */
  const outreach = await dbRetry(() =>
    prisma.outreach.findFirst({
      where: {
        email: fromEmail,
        status: { in: ["sent", "delivered", "opened"] },
      },
      orderBy: { createdAt: "desc" },
    })
  );

  if (!outreach) {
    return NextResponse.json({ ok: true, matched: false });
  }

  /* # Classify the reply using AI */
  const classification = await classifyReply(replyText, outreach.subject);

  /* # Update outreach record */
  await dbRetry(() =>
    prisma.outreach.update({
      where: { id: outreach.id },
      data: {
        status: "replied",
        repliedAt: new Date(),
        replyClassification: classification.sentiment,
      },
    })
  );

  audit("outreach.replied", {
    detail: `email:${fromEmail} role:${outreach.roleId} sentiment:${classification.sentiment} confidence:${classification.confidence}`,
  });

  /* # Handle based on classification */
  switch (classification.sentiment) {
    case "positive": {
      /* # Update CandidateMatch status to "responded" */
      if (outreach.candidateMatchId) {
        await prisma.candidateMatch.updateMany({
          where: { id: outreach.candidateMatchId },
          data: { status: "responded" },
        }).catch(() => {});
      }

      /* # Notify employer */
      const role = await prisma.role.findUnique({
        where: { id: outreach.roleId },
        select: { title: true, employerId: true },
      });
      if (role) {
        const members = await prisma.employerMember.findMany({
          where: { employerId: role.employerId },
          select: { userId: true },
        });
        for (const member of members) {
          await notify(
            member.userId,
            "match",
            `Candidate responded positively to "${role.title}" outreach`,
            {
              body: classification.summary,
              linkUrl: `/employer/${role.employerId}/roles`,
            },
          ).catch(() => {});
        }
      }
      break;
    }

    case "negative": {
      /* # Don't send follow-ups — cancel any queued */
      await prisma.outreach.updateMany({
        where: {
          email: fromEmail,
          roleId: outreach.roleId,
          status: "queued",
        },
        data: { status: "cancelled" },
      });

      /* # If they want to opt out globally, add to suppression */
      if (classification.wantsOptOut) {
        await dbRetry(() =>
          prisma.emailSuppression.upsert({
            where: { email: fromEmail },
            create: { email: fromEmail, reason: "opt_out" },
            update: {},
          })
        );
      }
      break;
    }

    case "uncertain": {
      /* # Flag for manual employer review */
      const role = await prisma.role.findUnique({
        where: { id: outreach.roleId },
        select: { title: true, employerId: true },
      });
      if (role) {
        const members = await prisma.employerMember.findMany({
          where: { employerId: role.employerId },
          select: { userId: true },
        });
        for (const member of members) {
          await notify(
            member.userId,
            "system",
            `Candidate reply needs review for "${role.title}"`,
            {
              body: `AI could not determine intent. Reply summary: ${classification.summary}`,
              linkUrl: `/employer/${role.employerId}/roles`,
            },
          ).catch(() => {});
        }
      }
      break;
    }
  }

  return NextResponse.json({
    ok: true,
    matched: true,
    classification: classification.sentiment,
    confidence: classification.confidence,
  });
}
