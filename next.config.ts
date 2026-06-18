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
  /* # ADZUNA keys removed from here — next.config `env` exposes vars to the
     client bundle. These are server-only secrets accessed via process.env
     in api/jobs/search/route.ts where they belong. */
  /* # Never ship source maps to the browser — prevents code/logic exposure */
  productionBrowserSourceMaps: false,
  /* # Disable x-powered-by header — hides that this is a Next.js app */
  poweredByHeader: false,
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
  /* Security headers — CSP, permissions policy */
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.googleusercontent.com https://*.licdn.com https://*.gravatar.com https://images.unsplash.com",
            "connect-src 'self' https://*.sentry.io https://challenges.cloudflare.com https://va.vercel-scripts.com",
            "frame-src https://challenges.cloudflare.com https://js.stripe.com",
            "frame-ancestors 'none'",
          ].join("; "),
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
      ],
    },
    {
      source: "/icons/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  /* Suppress noisy logs during build */
  silent: true,
  /* Disable Sentry telemetry */
  disableLogger: true,
});
