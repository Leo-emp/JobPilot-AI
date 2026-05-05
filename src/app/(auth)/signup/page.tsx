/* ============================================================
   SIGNUP PAGE - Create New Account
   ============================================================
   Registration form that creates a new user account.
   Calls our /api/auth/signup endpoint to create the user,
   then automatically signs them in and redirects to dashboard.
   ============================================================ */

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  /* Form field states */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    /* Client-side validation: passwords must match */
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* Password minimum length check */
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    /* Must agree to terms */
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      /* Step 1: Create the user account via our signup API */
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        return;
      }

      /* Step 2: Auto-sign in the new user */
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        /* Account was created but auto-login failed — redirect to login */
        router.push("/login");
      } else {
        /* Success — go straight to the dashboard */
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
      {/* Glass card container */}
      <div className="glass-card p-8 sm:p-10">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-2">
          Create Account
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Start your career journey with JobPilot AI
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
            />
          </div>

          {/* Confirm password field */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
            />
          </div>

          {/* Terms & Privacy consent checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms-consent"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-card-border bg-space-700 text-brand-indigo focus:ring-brand-indigo"
            />
            <label htmlFor="terms-consent" className="text-xs text-text-secondary leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-brand-light hover:text-white transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-brand-light hover:text-white transition-colors">
                Privacy Policy
              </Link>.
              I understand that my data is processed by AI and I am responsible for verifying all generated content.
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-light hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
