/* ============================================================
   PRIVACY POLICY PAGE
   ============================================================
   Comprehensive privacy policy covering:
   - What data we collect and why
   - How AI processes data (ephemeral, not stored)
   - Third-party processors (Google Gemini, Vercel, Turso)
   - User rights (GDPR, CCPA, Australian Privacy Act)
   - Data retention and deletion
   - Cookie usage
   Designed to minimize legal liability while being transparent.
   ============================================================ */

export const revalidate = 3600;

export const metadata = {
  title: "Privacy Policy — JobPilot AI",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Privacy Policy
      </h1>
      <p className="text-text-muted mb-12">Last updated: May 5, 2026</p>

      <div className="space-y-10 text-text-secondary leading-relaxed">
        {/* Introduction */}
        <section>
          <p>
            JobPilot AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy.
            This policy explains what data we collect, how we process it, and your rights regarding that data.
            By using our service, you consent to the practices described in this policy.
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p className="mb-3">We collect the minimum data necessary to provide our service:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Account Information:</strong> Name, email address, and a securely hashed password (bcrypt) when you register.</li>
            <li><strong className="text-white">Usage Metadata:</strong> AI feature usage counts and subscription plan type — used solely for plan enforcement.</li>
            <li><strong className="text-white">Payment Information:</strong> If you subscribe to a paid plan, payments are processed by our third-party payment processor. We never store your credit/debit card numbers, CVV, or full payment details on our servers.</li>
          </ul>
        </section>

        {/* Section 2 — Critical: Ephemeral Processing */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Resume, LinkedIn & Career Data — Ephemeral Processing</h2>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15 mb-4">
            <p className="text-green-300 font-medium text-sm">
              Key Point: Your resume text, LinkedIn profile text, cover letters, and job descriptions are processed ephemerally and are NOT permanently stored on our servers by default.
            </p>
          </div>
          <p className="mb-3">When you use our AI features:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your text is sent from your browser to our secure API endpoint.</li>
            <li>Our server forwards it to Google Gemini AI for processing.</li>
            <li>The AI result is returned to your browser.</li>
            <li>Your original text is <strong className="text-white">not retained</strong> on our servers after the request completes.</li>
            <li>All processing happens in-memory during the request lifecycle only.</li>
          </ul>
          <p className="mt-3">
            If you explicitly choose to save a resume or cover letter to your account (via a &ldquo;Save&rdquo; action),
            that data will be stored in our database until you delete it or delete your account.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Third-Party Data Processors</h2>
          <p className="mb-3">We use the following third-party services to operate:</p>
          <ul className="list-disc list-inside space-y-3 ml-4">
            <li>
              <strong className="text-white">Google Gemini AI:</strong> Processes your text to generate AI outputs.
              Google&apos;s API terms state that data sent via API is not used to train their models.
              See: <span className="text-brand-light">Google Cloud Data Processing Terms</span>.
            </li>
            <li>
              <strong className="text-white">Vercel:</strong> Hosts our application and handles HTTPS traffic.
              Data passes through Vercel&apos;s infrastructure during requests.
            </li>
            <li>
              <strong className="text-white">Turso (LibSQL):</strong> Stores account data (name, email, hashed password, usage counts).
              Encrypted at rest and in transit.
            </li>
            <li>
              <strong className="text-white">Payment Processor:</strong> Handles subscription billing.
              We receive only a customer ID and subscription status — never full payment details.
            </li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal data with any third party for advertising, marketing, or profiling purposes.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>All connections use TLS/HTTPS encryption in transit.</li>
            <li>Passwords are hashed with bcrypt (cost factor 12) — we cannot see your password.</li>
            <li>Database is encrypted at rest with AES-256.</li>
            <li>Sessions use secure, HTTP-only JWT tokens.</li>
            <li>API endpoints require authentication — no anonymous access to user data.</li>
          </ul>
          <p className="mt-3">
            While we implement industry-standard security measures, no system is 100% secure.
            We cannot guarantee absolute security and are not liable for breaches beyond our reasonable control.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Data Retention</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Account data:</strong> Retained until you delete your account.</li>
            <li><strong className="text-white">AI-processed text (resume, LinkedIn, etc.):</strong> Not retained — processed ephemerally during the request only.</li>
            <li><strong className="text-white">Saved items (if you choose to save):</strong> Retained until you manually delete them or delete your account.</li>
            <li><strong className="text-white">After account deletion:</strong> All data is permanently purged within 30 days, including any backups.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
          <p className="mb-3">
            Regardless of your location, you have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Right to Access:</strong> Request a copy of all personal data we hold about you.</li>
            <li><strong className="text-white">Right to Deletion:</strong> Delete your account and all associated data at any time from Settings, or by contacting us.</li>
            <li><strong className="text-white">Right to Rectification:</strong> Correct inaccurate personal data.</li>
            <li><strong className="text-white">Right to Data Portability:</strong> Export your data in a machine-readable format.</li>
            <li><strong className="text-white">Right to Withdraw Consent:</strong> Stop using the service at any time. Previously processed data (ephemeral) is already gone.</li>
            <li><strong className="text-white">Right to Object:</strong> Object to processing of your data for specific purposes.</li>
          </ul>
          <p className="mt-3 text-sm">
            These rights apply under GDPR (EU/UK), CCPA (California), Australian Privacy Act, and similar regulations.
            To exercise any right, use the account deletion feature in Settings or email us.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Cookies</h2>
          <p>
            We use <strong className="text-white">essential cookies only</strong> for authentication session management.
            We do not use tracking cookies, advertising pixels, third-party analytics (no Google Analytics),
            or any form of cross-site tracking. No cookie consent banner is required because we only use
            strictly necessary cookies.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">8. Children&apos;s Privacy</h2>
          <p>
            Our service is not directed at individuals under 16 years of age. We do not knowingly collect
            personal data from children. If we discover that a user is under 16, we will delete their
            account and data immediately.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">9. International Data Transfers</h2>
          <p>
            Our servers and third-party processors may be located outside your country of residence.
            By using our service, you consent to the transfer of your data to these locations.
            We ensure all processors maintain adequate data protection standards.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via
            email to registered users at least 14 days before taking effect. Your continued use of
            the service after changes constitutes acceptance.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">11. Contact Us</h2>
          <p>
            For privacy-related questions, data access requests, or to exercise any of your rights,
            contact us at:{" "}
            <a href="mailto:privacy@jobpilotai.com" className="text-brand-light hover:text-white transition-colors">
              privacy@jobpilotai.com
            </a>
          </p>
          <p className="mt-2 text-sm text-text-muted">
            We aim to respond to all privacy requests within 14 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
