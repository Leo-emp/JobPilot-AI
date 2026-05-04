import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Fix Turbopack workspace root detection */
  /* Without this, Turbopack picks up a parent lockfile and breaks @/ alias resolution */
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
