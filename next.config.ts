import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Fix Turbopack workspace root detection */
  turbopack: {
    root: path.resolve(__dirname),
  },
  /* Keep unpdf external — pdfjs-dist native bindings crash Turbopack workers */
  serverExternalPackages: ["unpdf", "pdfjs-dist"],
  /* Server-side env vars — read from .env.local / Vercel env vars only */
  env: {
    ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || "",
    ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || "",
  },
};

export default nextConfig;
