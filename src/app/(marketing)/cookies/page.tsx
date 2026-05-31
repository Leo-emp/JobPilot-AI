/* ============================================================
   COOKIE POLICY PAGE
   ============================================================
   Explains what cookies we use, why, and how users can manage
   them. Since we only use essential auth cookies (no tracking,
   no analytics, no ads), this is straightforward and short.
   ============================================================ */

export const revalidate = 3600;

export const metadata = {
  title: "Cookie Policy — JobPilot AI",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Cookie Policy
      </h1>
      <p className="text-text-muted mb-12">Last updated: June 1, 2026</p>

      <div className="space-y-10 text-text-secondary leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website.
            They help the website remember your preferences and session information so
            you don&apos;t have to log in every time you visit.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Cookies We Use</h2>
          <p className="mb-4">
            We use <strong className="text-white">strictly necessary cookies only</strong>.
            We do not use any tracking, analytics, advertising, or third-party cookies.
          </p>

          {/* Cookie table */}
          <div className="rounded-xl border border-card-border overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr] px-5 py-3 bg-space-700/30 border-b border-card-border">
              <span className="text-sm font-bold text-white">Cookie</span>
              <span className="text-sm font-bold text-white">Purpose</span>
              <span className="text-sm font-bold text-white">Duration</span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr] px-5 py-3 border-b border-card-border/50">
              <span className="text-sm text-text-secondary">next-auth.session-token</span>
              <span className="text-sm text-text-secondary">Keeps you logged in to your account</span>
              <span className="text-sm text-text-secondary">30 days</span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr] px-5 py-3 border-b border-card-border/50 bg-space-800/20">
              <span className="text-sm text-text-secondary">next-auth.csrf-token</span>
              <span className="text-sm text-text-secondary">Prevents cross-site request forgery attacks</span>
              <span className="text-sm text-text-secondary">Session</span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr] px-5 py-3">
              <span className="text-sm text-text-secondary">next-auth.callback-url</span>
              <span className="text-sm text-text-secondary">Remembers where to redirect after login</span>
              <span className="text-sm text-text-secondary">Session</span>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. What We Don&apos;t Use</h2>
          <p className="mb-3">We want to be clear about what we do NOT use:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No Google Analytics or any analytics tracking</li>
            <li>No advertising cookies or pixels</li>
            <li>No social media tracking widgets</li>
            <li>No third-party cookies of any kind</li>
            <li>No fingerprinting or cross-site tracking</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Managing Cookies</h2>
          <p className="mb-3">
            Since we only use essential cookies required for the website to function,
            disabling them may prevent you from logging in or using the service.
          </p>
          <p>
            You can manage or delete cookies through your browser settings.
            Most browsers allow you to block or delete cookies under Privacy or Security settings.
            Please note that clearing our authentication cookies will log you out.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Why No Cookie Banner</h2>
          <p>
            Under GDPR and ePrivacy regulations, strictly necessary cookies that are
            essential for the website to function do not require user consent. Since we
            only use authentication cookies (no tracking or analytics), we are not required
            to display a cookie consent banner. We choose transparency over popups.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Changes to This Policy</h2>
          <p>
            If we ever add non-essential cookies (such as analytics), we will update this
            policy and implement a cookie consent mechanism before doing so. We will notify
            registered users of any material changes.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
          <p>
            Questions about our cookie usage? Contact us at{" "}
            <a href="mailto:privacy@jobpilotai.co" className="text-brand-light hover:text-white transition-colors">
              privacy@jobpilotai.co
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
