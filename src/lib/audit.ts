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
  | "auth.2fa.disabled";

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
