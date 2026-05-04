/* ============================================================
   CONTACT PAGE
   ============================================================
   Simple contact page with a form and direct contact info.
   Form submissions are stored and can be viewed later.
   For now, the form shows a success message (no email backend).
   ============================================================ */

"use client";

import { useState } from "react";

export default function ContactPage() {
  /* Form fields */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  /* Form state */
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---- Handle Form Submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /* Simulate a short delay (replace with actual API call later) */
    await new Promise((r) => setTimeout(r, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Contact Us
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Have a question, feedback, or enterprise inquiry? We&apos;d love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ---- Contact Form ---- */}
        <div className="glass-card p-6 sm:p-8">
          {submitted ? (
            /* Success state */
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-3">Message Sent!</h2>
              <p className="text-text-secondary">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setEmail("");
                  setSubject("");
                  setMessage("");
                }}
                className="mt-6 text-sm text-brand-light hover:text-white transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-colors"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo transition-colors"
                >
                  <option value="">Select a topic...</option>
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="enterprise">Enterprise Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* ---- Contact Info ---- */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-text-secondary text-sm">
              <a href="mailto:support@jobpilotai.com" className="text-brand-light hover:text-white transition-colors">
                support@jobpilotai.com
              </a>
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-2">Response Time</h3>
            <p className="text-text-secondary text-sm">
              We typically respond within 24 hours on business days.
              Pro and Enterprise customers get priority support.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-2">Enterprise Sales</h3>
            <p className="text-text-secondary text-sm">
              Looking for team features, custom integrations, or volume pricing?
              Select &ldquo;Enterprise Inquiry&rdquo; in the form and we&apos;ll set up a call.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-2">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="https://github.com/Leo-emp" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
