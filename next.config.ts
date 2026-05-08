import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Fix Turbopack workspace root detection */
  turbopack: {
    root: path.resolve(__dirname),
  },
  /* Keep unpdf external — pdfjs-dist native bindings crash Turbopack workers */
  serverExternalPackages: ["unpdf", "pdfjs-dist"],
  /* Server-side env vars — ensures they're available in serverless functions */
  env: {
    ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || "7b4cb6f0",
    ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || "1be0aacd17c737b3d2b818bff1a0d8ad",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyA5PpxSqaLrszgnh1eUPDEYa4PmDBebz-E",
  },
};

export default nextConfig;
