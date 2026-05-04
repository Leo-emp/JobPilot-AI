/* ============================================================
   LOGIN PAGE - User Sign In
   ============================================================
   Email/password login form with space-themed styling.
   Uses NextAuth's signIn() to authenticate against our
   Credentials provider. Redirects to /dashboard on success.
   ============================================================ */

"use client"; // Client component because we handle form state

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  /* Form field states */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit (page reload)
    setError("");
    setLoading(true);

    try {
      /* Call NextAuth's signIn with our credentials provider */
      /* redirect: false means we handle the redirect ourselves */
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        /* Login successful — redirect to dashboard */
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Glass card container for the login form */}
      <div className="glass-card p-8 sm:p-10">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Sign in to your JobPilot AI account
        </p>

        {/* Error message banner */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to signup */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-light hover:text-white transition-colors font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
