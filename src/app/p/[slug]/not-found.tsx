/* ============================================================
   PORTFOLIO 404 — Custom not-found for invalid/unpublished slugs
   ============================================================ */

import Link from "next/link";

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#09090b", color: "#e4e4e7", fontFamily: "system-ui, sans-serif" }}>
      <div className="text-center px-6">
        <p className="text-6xl font-bold mb-4" style={{ color: "#6366f1" }}>404</p>
        <h1 className="text-2xl font-bold mb-2">Portfolio Not Found</h1>
        <p className="text-sm mb-8" style={{ color: "#71717a" }}>
          This portfolio doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link href="/"
          className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#6366f1" }}>
          Go to JobPilot AI
        </Link>
      </div>
    </div>
  );
}
