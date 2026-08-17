/* ============================================================
   INVITE ACCEPT — Public page for accepting org invitations
   ============================================================
   Handles the invite accept flow:
   1. User clicks invite link with ?token=xxx
   2. Page calls POST /api/org/invites/accept
   3. If user not logged in, redirects to login first
   4. Shows success or error message
   ============================================================ */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function InviteAcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "login">("loading");
  const [message, setMessage] = useState("");
  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invite link. No token provided.");
      return;
    }

    /* # Attempt to accept the invite */
    fetch("/api/org/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setOrgId(data.orgId || "");
          setMessage("You have been added to the organization.");
        } else if (data.requiresAuth) {
          /* # Not logged in — redirect to login with return URL */
          setStatus("login");
          setMessage("Please sign in to accept this invitation.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to accept invitation.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-space-800 border border-card-border rounded-2xl text-center">
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-space-700 rounded-full mx-auto mb-4" />
            <div className="h-6 w-48 bg-space-700 rounded-lg mx-auto mb-2" />
            <div className="h-4 w-64 bg-space-700 rounded-lg mx-auto" />
          </div>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link
              href={orgId ? `/org/${orgId}` : "/dashboard"}
              className="inline-flex px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "login" && (
          <>
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/org/invite?token=${token}`)}`}
              className="inline-flex px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Invitation Error</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <Link
              href="/dashboard"
              className="inline-flex px-6 py-2.5 bg-space-700 text-white text-sm font-medium rounded-lg hover:bg-space-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  );
}
