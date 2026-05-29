import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
  /* Cap request body size — prevents memory exhaustion from oversized payloads */
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  /* Only allow OAuth provider avatar domains — prevents SSRF via image proxy */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.licdn.com" },
      { protocol: "https", hostname: "*.gravatar.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  /* Suppress noisy logs during build */
  silent: true,
  /* Disable Sentry telemetry */
  disableLogger: true,
});
