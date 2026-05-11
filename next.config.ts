import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* Fix Turbopack workspace root detection */
  turbopack: {
    root: path.resolve(__dirname),
  },
  /* Keep unpdf external — native bindings crash Turbopack workers */
  serverExternalPackages: ["unpdf"],
  /* Server-side env vars — read from .env.local / Vercel env vars only */
  env: {
    ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || "",
    ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || "",
  },
};

export default withSentryConfig(nextConfig, {
  /* Suppress noisy logs during build */
  silent: true,
  /* Disable Sentry telemetry */
  disableLogger: true,
});
