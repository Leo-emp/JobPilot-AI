/* ============================================================
   FORGOT PASSWORD PAGE — Request a password reset link
   ============================================================
   User enters their email, we send a reset link.
   Shows success regardless of whether the email exists
   (prevents email enumeration).
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong");
      }

      setSent(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8 sm:p-10">
        {sent ? (
          /* ---- Success state ---- */
          <div className="text-center">
            <div className="flex justify-center mb-4"><svg className="w-12 h-12 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-3">
              Check Your Email
            </h1>
            <p className="text-text-secondary mb-6 leading-relaxed">
              If an account with <span className="text-white font-medium">{email}</span> exists,
              we&apos;ve sent a password reset link. Check your inbox and spam folder.
            </p>
            <p className="text-text-muted text-sm mb-6">
              The link expires in 1 hour.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full py-3 rounded-xl font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all"
              >
                Try a different email
              </button>
              <Link href="/login" className="block w-full py-3 rounded-xl font-medium text-center text-brand-light hover:text-white transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* ---- Form state ---- */
          <>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-2">
              Forgot Password?
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Enter your email and we&apos;ll send you a reset link
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Remember your password?{" "}
              <Link href="/login" className="text-brand-light hover:text-white transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
