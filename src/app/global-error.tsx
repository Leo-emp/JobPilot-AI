/* ============================================================
   GLOBAL ERROR BOUNDARY - Catches unhandled React errors
   ============================================================
   Reports errors to Sentry and shows a fallback UI.
   This file is required by @sentry/nextjs for App Router.
   ============================================================ */

"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">We&apos;ve been notified and are looking into it.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
