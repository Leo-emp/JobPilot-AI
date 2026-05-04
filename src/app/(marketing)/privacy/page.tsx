/* ============================================================
   PRIVACY POLICY PAGE
   ============================================================
   Standard privacy policy covering data collection, usage,
   storage, and user rights. Required for any SaaS business.
   ============================================================ */

export const metadata = {
  title: "Privacy Policy — JobPilot AI",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Privacy Policy
      </h1>
      <p className="text-text-muted mb-12">Last updated: May 4, 2026</p>

      <div className="space-y-10 text-text-secondary leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p className="mb-3">When you use JobPilot AI, we collect the following information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Account Information:</strong> Name, email address, and hashed password when you create an account.</li>
            <li><strong className="text-white">Resume Data:</strong> Resume text you upload or paste for AI analysis. This is stored securely in our database linked to your account.</li>
            <li><strong className="text-white">Usage Data:</strong> Which features you use and how often, to enforce plan limits and improve our service.</li>
            <li><strong className="text-white">Payment Information:</strong> If you upgrade to a paid plan, payment is processed by Stripe. We do not store your credit card details — Stripe handles that securely.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>To provide AI-powered resume analysis, cover letter generation, and interview prep services.</li>
            <li>To save your resumes, cover letters, and applications so you can access them later.</li>
            <li>To enforce usage limits based on your subscription plan.</li>
            <li>To communicate important account updates or service changes.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. AI Processing</h2>
          <p>
            Your resume text and job descriptions are sent to Google Gemini AI for processing.
            This data is sent securely via API and is not used by Google to train their models.
            We do not share your personal data with any other third parties for marketing purposes.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Data Storage & Security</h2>
          <p>
            Your data is stored in encrypted databases. Passwords are hashed using bcrypt with
            a cost factor of 12. We use JWT tokens for session management, stored in secure,
            HTTP-only cookies. All data transmission uses HTTPS encryption.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access all personal data we store about you.</li>
            <li>Request deletion of your account and all associated data.</li>
            <li>Export your data in a portable format.</li>
            <li>Withdraw consent for data processing at any time.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Cookies</h2>
          <p>
            We use essential cookies only — specifically for authentication session management.
            We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
          <p>
            If you have questions about this privacy policy or your data, please contact us
            at <a href="mailto:support@jobpilotai.com" className="text-brand-light hover:text-white transition-colors">support@jobpilotai.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
