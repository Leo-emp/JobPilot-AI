/* ============================================================
   GLOBAL ERROR BOUNDARY
   ============================================================
   Catches unhandled errors in any route and shows a user-friendly
   error page instead of a blank screen. Allows the user to retry.
   ============================================================ */

"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-space-900">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="text-6xl mb-6">⚠️</div>

        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-4">
          Something Went Wrong
        </h1>

        <p className="text-text-secondary mb-2">
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
        </p>

        {/* Show error message in dev mode */}
        {process.env.NODE_ENV === "development" && error.message && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 font-mono">
            {error.message}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
