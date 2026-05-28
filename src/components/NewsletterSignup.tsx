/* ============================================================
   NEWSLETTER SIGNUP - Email Capture Component
   ============================================================
   Inline email capture form for the landing page. Submits to
   /api/newsletter which adds to Resend audience. Shows success/
   error states. Used above the footer to capture interested
   visitors before they leave.
   ============================================================ */

"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

/* # Zero-bounce spring — naturally settles with no hard stop */
const SPRING = { type: "spring" as const, duration: 1.2, bounce: 0 };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="relative z-10 py-16 sm:py-20 px-4">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* # Section heading */}
        <motion.h3 variants={fadeUp} className="text-2xl sm:text-3xl font-bold mb-3">
          Get Weekly <span className="glow-text">Career Tips</span>
        </motion.h3>
        <motion.p variants={fadeUp} className="text-text-secondary text-base sm:text-lg mb-8 max-w-lg mx-auto">
          AI-powered resume advice, interview strategies, and job market insights delivered to your inbox every week.
        </motion.p>

        {/* # Email form */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
            placeholder="you@example.com"
            required
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-3 rounded-xl bg-space-800/80 border border-card-border text-white placeholder:text-text-muted focus:outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/30 transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-primary px-6 py-3 text-sm font-semibold whitespace-nowrap disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed ✓" : "Subscribe"}
          </button>
        </motion.form>

        {/* # Feedback message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
          >
            {message}
          </motion.p>
        )}

        {/* # Trust line */}
        <motion.p variants={fadeUp} className="mt-4 text-xs text-text-muted">
          Free forever &bull; No spam &bull; Unsubscribe anytime
        </motion.p>
      </motion.div>
    </section>
  );
}
