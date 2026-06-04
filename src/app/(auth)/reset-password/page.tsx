/* ============================================================
   RESET PASSWORD PAGE — Set a new password using the token
   ============================================================
   User arrives here from the email link with ?token=xxx.
   They enter a new password, which gets validated and saved.
   ============================================================ */

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* ---- Inner component (needs useSearchParams inside Suspense) ---- */
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* ---- No token in URL ---- */
  if (!token) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-3">
          Invalid Reset Link
        </h1>
        <p className="text-text-secondary mb-6">
          This link is missing the reset token. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-block px-6 py-3">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-3">
          Password Reset!
        </h1>
        <p className="text-text-secondary mb-6">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link href="/login" className="btn-primary inline-block px-8 py-3">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-2">
        Set New Password
      </h1>
      <p className="text-text-secondary text-center mb-8">
        Choose a strong password for your account
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href="/login" className="text-brand-light hover:text-white transition-colors font-medium">
          Back to Sign In
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8 sm:p-10">
        <Suspense fallback={
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-brand-indigo mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-text-secondary">Loading...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
