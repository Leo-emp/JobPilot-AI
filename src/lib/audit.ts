/* ============================================================
   AUDIT LOGGER — Security Event Logging
   ============================================================
   Logs security-critical events in a structured JSON format.
   Used for: login attempts, password resets, account deletions,
   plan changes, payment events, and admin actions.

   Logs go to stdout (captured by Vercel's log drain) and
   optionally to Sentry breadcrumbs for error context.

   Usage:
     audit("auth.login.success", { userId: "abc", ip: "1.2.3.4" });
     audit("payment.upgrade", { userId: "abc", plan: "pro" });
   ============================================================ */

import * as Sentry from "@sentry/nextjs";

/* # All possible audit event types */
export type AuditEvent =
  | "auth.login.success"
  | "auth.login.failed"
  | "auth.signup"
  | "auth.logout"
  | "auth.password_reset.requested"
  | "auth.password_reset.completed"
  | "auth.account.deleted"
  | "auth.account.locked"
  | "auth.oauth.linked"
  | "payment.checkout.started"
  | "payment.upgrade"
  | "payment.downgrade"
  | "payment.cancelled"
  | "payment.webhook.received"
  | "payment.webhook.failed"
  | "ai.request"
  | "ai.limit.reached"
  | "ai.error"
  | "admin.action"
  | "feedback.submitted"
  | "security.rate_limit.hit"
  | "security.csrf.blocked"
  | "security.body_size.blocked"
  | "security.waf.blocked"
  | "security.waf.query_blocked"
  | "gdpr.hard_delete"
  | "auth.2fa.enabled"
  | "auth.2fa.disabled"
  // B2B: organization events
  | "org.created"
  | "org.updated"
  | "org.deleted"
  | "org.member.invited"
  | "org.member.accepted"
  | "org.member.removed"
  | "org.member.role_changed"
  // B2B: employer events
  | "employer.created"
  | "employer.updated"
  | "employer.verified"
  | "employer.role.created"
  | "employer.role.published"
  | "employer.role.deleted"
  | "employer.member.added"
  | "employer.member.removed"
  | "employer.candidate.status_changed"
  // B2B: bookmark + messaging events
  | "employer.bookmark.created"
  | "employer.bookmark.deleted"
  | "candidate.bookmark.created"
  | "candidate.bookmark.deleted"
  | "message.thread.created"
  | "message.sent"
  | "message.thread.blocked"
  // B2B: external sourcing events
  | "sourcing.started"
  | "sourcing.completed"
  | "sourcing.candidate.found"
  | "sourcing.candidate.converted"
  // B2B: outreach + recruiting agent events
  | "outreach.queued"
  | "outreach.sent"
  | "outreach.bounced"
  | "outreach.replied"
  | "outreach.followup.queued"
  | "outreach.suppressed"
  | "outreach.cancelled"
  | "shortlist.created"
  | "shortlist.delivered"
  | "shortlist.entry.added"
  | "shortlist.entry.removed"
  // B2B: employer billing events
  | "employer.billing.checkout"
  | "employer.billing.upgraded"
  | "employer.billing.cancelled"
  | "employer.billing.updated";

/* # Structured audit log entry */
interface AuditPayload {
  userId?: string;
  email?: string;
  ip?: string;
  action?: string;
  plan?: string;
  detail?: string;
  [key: string]: unknown;
}

/* # Main audit function — call from any API route */
export function audit(event: AuditEvent, payload: AuditPayload = {}) {
  const entry = {
    _audit: true,
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  /* # Structured JSON log — picked up by Vercel log drain */
  console.log(JSON.stringify(entry));

  /* # Also add as Sentry breadcrumb so errors have audit context */
  Sentry.addBreadcrumb({
    category: "audit",
    message: event,
    level: event.includes("failed") || event.includes("blocked") ? "warning" : "info",
    data: payload,
  });
}

/* # Extract client IP from request headers (Vercel sets x-forwarded-for) */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
