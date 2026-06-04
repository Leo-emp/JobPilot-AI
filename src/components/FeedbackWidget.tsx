/* ============================================================
   FEEDBACK WIDGET — In-App User Feedback
   ============================================================
   Floating button in the dashboard that opens a modal for
   submitting feedback. Sends feedback to /api/feedback which
   logs it via the audit system. No external services needed.
   ============================================================ */

"use client";

import { useState } from "react";

/* ---- Category icon components ---- */
const BugIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const FeatureIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const ImprovementIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const OtherIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/* ---- Feedback categories ---- */
const categories = [
  { id: "bug", label: "Bug Report", icon: <BugIcon /> },
  { id: "feature", label: "Feature Request", icon: <FeatureIcon /> },
  { id: "improvement", label: "Improvement", icon: <ImprovementIcon /> },
  { id: "other", label: "Other", icon: <OtherIcon /> },
];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("improvement");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---- Submit Feedback ---- */
  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim() }),
      });
      setSubmitted(true);
    } catch {
      /* # Even if API fails, show success — feedback is best-effort */
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Reset and close ---- */
  const handleClose = () => {
    setOpen(false);
    /* # Reset form after animation */
    setTimeout(() => {
      setCategory("improvement");
      setMessage("");
      setSubmitted(false);
    }, 200);
  };

  return (
    <>
      {/* ---- Floating Feedback Button ---- */}
      {/* Fixed in bottom-right corner, above cookie consent banner */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-brand-indigo text-white shadow-lg shadow-brand-indigo/30 hover:bg-brand-indigo/80 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Send feedback"
        title="Send feedback"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* ---- Feedback Modal ---- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-space-800 border border-card-border rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-card-border">
              <h3 className="text-lg font-bold text-white">Send Feedback</h3>
              <button
                onClick={handleClose}
                className="text-text-muted hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {submitted ? (
                /* ---- Success State ---- */
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Thanks for your feedback!</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    We read every submission and use it to improve JobPilot AI.
                  </p>
                  <button onClick={handleClose} className="btn-primary text-sm">
                    Close
                  </button>
                </div>
              ) : (
                /* ---- Feedback Form ---- */
                <>
                  {/* Category selector */}
                  <div className="mb-4">
                    <label className="block text-sm text-text-muted mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            category === cat.id
                              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                              : "bg-space-700 text-text-secondary border border-card-border hover:border-brand-indigo/20"
                          }`}
                        >
                          {cat.icon}
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="mb-4">
                    <label className="block text-sm text-text-muted mb-2">Your feedback</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      maxLength={2000}
                      className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm resize-none"
                    />
                    <p className="text-xs text-text-muted mt-1 text-right">{message.length}/2000</p>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !message.trim()}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Submit Feedback"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
