/* ============================================================
   2FA VERIFICATION PAGE — /verify-2fa
   ============================================================
   Shown after login when a user has 2FA enabled. They must
   enter a code from their authenticator app to proceed.
   On success, clears the twoFactorPending flag and redirects
   to the dashboard.
   ============================================================ */

"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Verify2FAPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* If no session or 2FA isn't pending, redirect away */
  if (session && !session.user.twoFactorPending) {
    router.replace("/dashboard");
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }

      /* Clear the 2FA pending flag in the session JWT */
      await updateSession({ twoFactorPending: false });

      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-white">
            JobPilot AI
          </Link>
        </div>

        <div className="bg-space-700/80 border border-card-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h1>
            <p className="text-text-secondary text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-xl bg-space-600 border border-card-border/50 text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none mb-4"
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full mt-4 py-2 text-sm text-text-muted hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
