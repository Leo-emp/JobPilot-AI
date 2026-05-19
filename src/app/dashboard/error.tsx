/* ============================================================
   DASHBOARD ERROR BOUNDARY
   ============================================================
   Catches errors within the dashboard layout so the sidebar
   stays visible while showing the error in the main content area.
   Technical details only visible to admin users.
   ============================================================ */

"use client";

import { useSession } from "next-auth/react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">⚠️</div>

        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4">
          Something Went Wrong
        </h2>

        <p className="text-text-secondary text-sm mb-6">
          This page encountered an error. Try refreshing or go back to the dashboard.
        </p>

        {/* Technical error details — admin only */}
        {isAdmin && error.message && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 font-mono break-all">
            {error.message}
          </p>
        )}

        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
