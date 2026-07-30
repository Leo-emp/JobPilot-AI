/* ============================================================
   FEATURE FLAGS — Toggle features without redeploying
   ============================================================
   Add flags here. Override defaults via Vercel env vars:
     FLAG_NEW_MATCHING=true  →  flags.newMatching === true

   Server-side only (API routes, server components).
   For client components, use NEXT_PUBLIC_ prefix env vars.
   ============================================================ */

/* # Read a boolean from env vars with a fallback default */
function env(name: string, defaultValue: boolean): boolean {
  const val = process.env[name];
  if (val === undefined) return defaultValue;
  return val === "true" || val === "1";
}

/* # All feature flags — add new ones here */
export const flags = {
  // Example usage:
  // newMatching: env("FLAG_NEW_MATCHING", false),
  // betaDashboard: env("FLAG_BETA_DASHBOARD", false),
  // maintenanceMode: env("FLAG_MAINTENANCE_MODE", false),
} as const satisfies Record<string, boolean>;

/* # Type-safe flag check */
export function isEnabled(flag: keyof typeof flags): boolean {
  return flags[flag];
}
