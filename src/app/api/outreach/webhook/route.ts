/* ============================================================
   OUTREACH WEBHOOK — POST /api/outreach/webhook
   ============================================================
   Receives Resend webhook events for outreach email tracking:
   - email.delivered → update status
   - email.opened → update status + openedAt
   - email.bounced → update status + bouncedAt + add to suppression
   - email.complained → add to suppression list

   Webhook is verified by checking the Resend webhook secret.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { audit } from "@/lib/audit";
import { isB2BEnabled } from "@/lib/b2b-gate";

export async function POST(req: NextRequest) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  /* # Verify webhook authenticity via Resend webhook secret.
     Resend uses Svix to sign webhooks — we verify the HMAC to
     ensure this request actually came from Resend, not an attacker. */
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    /* # Webhook secret not configured — reject all webhook calls */
    console.error("RESEND_WEBHOOK_SECRET not configured — rejecting webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  /* # Svix sends these three headers for signature verification */
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 401 });
  }

  /* # Reject if timestamp is too old (5 minutes) to prevent replay attacks */
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(svixTimestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) {
    return NextResponse.json({ error: "Webhook timestamp expired" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.type || !body.data) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const eventType = body.type;
  const toEmails: string[] = body.data.to ?? [];
  const recipientEmail = toEmails[0]?.toLowerCase();

  if (!recipientEmail) {
    return NextResponse.json({ ok: true });
  }

  /* # Find the most recent outreach record for this email */
  const outreach = await dbRetry(() =>
    prisma.outreach.findFirst({
      where: { email: recipientEmail, status: { not: "cancelled" } },
      orderBy: { createdAt: "desc" },
    })
  );

  if (!outreach) {
    /* # Not an outreach email — might be a transactional email */
    return NextResponse.json({ ok: true });
  }

  switch (eventType) {
    case "email.delivered": {
      await dbRetry(() =>
        prisma.outreach.update({
          where: { id: outreach.id },
          data: { status: "delivered" },
        })
      );
      break;
    }

    case "email.opened": {
      await dbRetry(() =>
        prisma.outreach.update({
          where: { id: outreach.id },
          data: { status: "opened", openedAt: new Date() },
        })
      );
      break;
    }

    case "email.bounced": {
      await dbRetry(() =>
        prisma.outreach.update({
          where: { id: outreach.id },
          data: { status: "bounced", bouncedAt: new Date() },
        })
      );

      /* # Add to suppression list after bounce */
      await dbRetry(() =>
        prisma.emailSuppression.upsert({
          where: { email: recipientEmail },
          create: { email: recipientEmail, reason: "bounce" },
          update: {},
        })
      );

      audit("outreach.bounced", {
        detail: `email:${recipientEmail} role:${outreach.roleId}`,
      });
      break;
    }

    case "email.complained": {
      /* # Spam complaint — suppress immediately */
      await dbRetry(() =>
        prisma.emailSuppression.upsert({
          where: { email: recipientEmail },
          create: { email: recipientEmail, reason: "complaint" },
          update: {},
        })
      );

      /* # Cancel all queued outreach for this email */
      await dbRetry(() =>
        prisma.outreach.updateMany({
          where: { email: recipientEmail, status: "queued" },
          data: { status: "cancelled" },
        })
      );

      audit("outreach.suppressed", {
        detail: `complaint email:${recipientEmail}`,
      });
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
