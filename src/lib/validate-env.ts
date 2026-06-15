/* ============================================================
   ENV VALIDATION — Fail fast at import time, not on first request
   ============================================================
   Import this file in instrumentation.ts or layout.tsx so missing
   critical env vars crash the build/startup instead of surprising
   the first user with a 500 error.
   ============================================================ */

/* # Required for core functionality — app cannot serve without these */
const REQUIRED = [
  "AUTH_SECRET",
  "DATABASE_URL",
  "DATABASE_AUTH_TOKEN",
] as const;

/* # Warn-only — app works but specific features are degraded or disabled */
const RECOMMENDED = [
  "GEMINI_API_KEY",
  "RESEND_API_KEY",
  "CRON_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_SENTRY_DSN",
] as const;

const missing: string[] = [];
const warnings: string[] = [];

for (const key of REQUIRED) {
  if (!process.env[key]) missing.push(key);
}

for (const key of RECOMMENDED) {
  if (!process.env[key]) warnings.push(key);
}

if (warnings.length > 0) {
  console.warn(`[env] Missing recommended vars (features disabled): ${warnings.join(", ")}`);
}

if (missing.length > 0) {
  throw new Error(`[env] Missing required environment variables: ${missing.join(", ")}. App cannot start.`);
}

export {};
