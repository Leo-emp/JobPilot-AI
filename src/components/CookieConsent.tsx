/* ============================================================
   COOKIE CONSENT BANNER — GDPR Compliance
   ============================================================
   Shows a bottom banner on first visit informing users about
   essential cookies. Consent is stored in localStorage so it
   only appears once. No tracking cookies are used — this banner
   covers the essential auth cookies (session, CSRF, callback).
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";

/* localStorage key for persisting the user's consent */
const CONSENT_KEY = "jobpilot-cookie-consent";

export default function CookieConsent() {
  /* # Lazy-init from localStorage — avoids setState-in-useEffect */
  const [accepted, setAccepted] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(CONSENT_KEY) === "true";
  });

  /* Handle the "Accept" button click */
  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setAccepted(true);
  };

  /* Don't render if already accepted */
  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6" role="banner" aria-label="Cookie consent">
      <div className="max-w-4xl mx-auto rounded-2xl bg-space-800 backdrop-blur-md border border-card-border shadow-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Cookie icon + message */}
          <div className="flex-1">
            <p className="text-sm text-text-secondary leading-relaxed">
              We use <strong className="text-white">essential cookies only</strong> — for authentication and security.
              No tracking, no ads, no analytics cookies.{" "}
              <Link
                href="/cookies"
                className="text-brand-light hover:text-white underline underline-offset-2 transition-colors"
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            className="shrink-0 px-6 py-2.5 rounded-xl bg-brand-indigo text-white text-sm font-medium hover:bg-brand-indigo/80 transition-colors shadow-lg shadow-brand-indigo/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
