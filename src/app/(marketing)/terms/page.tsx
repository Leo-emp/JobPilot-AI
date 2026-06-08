/* ============================================================
   TERMS OF SERVICE PAGE
   ============================================================
   Comprehensive terms covering:
   - Service description and disclaimers
   - AI-generated content liability (user's responsibility)
   - No guarantees of employment outcomes
   - Limitation of liability and indemnification
   - Acceptable use policy
   - Account termination rights
   - Governing law and dispute resolution
   Designed to maximize liability protection for the business.
   ============================================================ */

export const revalidate = 3600;

export const metadata = {
  title: "Terms of Service — JobPilot AI",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Terms of Service
      </h1>
      <p className="text-text-muted mb-12">Last updated: June 1, 2026</p>

      <div className="space-y-10 text-text-secondary leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing, registering for, or using JobPilot AI (&ldquo;the Service&rdquo;), you agree to be
            legally bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to any part of
            these Terms, you must immediately stop using the Service. These Terms constitute a binding
            legal agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and JobPilot AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
          <p className="mb-3">
            JobPilot AI provides AI-powered career assistance tools, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Resume analysis, optimization, rebuilding, and career pivot reframing</li>
            <li>Cover letter generation tailored to specific job descriptions</li>
            <li>Interview question prediction, answer coaching, and live AI mock interviews</li>
            <li>LinkedIn profile auditing, rewriting, and content strategy planning</li>
            <li>Job match scoring with skill gap analysis</li>
            <li>Application tracking and networking CRM</li>
            <li>AI portfolio builder with shareable public pages</li>
            <li>Networking outreach message generation</li>
            <li>Chrome browser extension for job saving (when available)</li>
          </ul>
          <p className="mt-3">
            The Service uses third-party AI models (Google Gemini) to generate content.
            AI outputs are algorithmically generated suggestions, not professional career advice.
          </p>
        </section>

        {/* Section 3 — CRITICAL DISCLAIMER */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. AI-Generated Content Disclaimer</h2>
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15 mb-4">
            <p className="text-yellow-300 font-medium text-sm">
              Important: You must read and understand this section before using our AI features.
            </p>
          </div>
          <ul className="list-disc list-inside space-y-3 ml-4">
            <li>
              All AI-generated content (resumes, cover letters, interview answers, LinkedIn text, scores, and recommendations)
              are <strong className="text-white">automated suggestions only</strong> and do not constitute professional career counseling,
              legal advice, or any form of guaranteed outcome.
            </li>
            <li>
              <strong className="text-white">You are solely responsible</strong> for reviewing, editing, verifying, and approving all
              AI-generated content before using it in any context (job applications, professional profiles, interviews, etc.).
            </li>
            <li>
              AI outputs may contain inaccuracies, factual errors, inappropriate suggestions, or content that does not
              accurately represent your qualifications. You must verify all content against your actual experience.
            </li>
            <li>
              We <strong className="text-white">do not guarantee</strong> that using our Service will result in job interviews, job offers,
              salary increases, career advancement, or any specific employment outcome.
            </li>
            <li>
              Scores and ratings (ATS scores, match scores, LinkedIn scores) are algorithmic estimates and
              may not reflect how actual hiring systems or recruiters evaluate your materials.
            </li>
            <li>
              You agree not to hold us liable for any negative outcomes resulting from the use of AI-generated content,
              including but not limited to: rejected applications, lost opportunities, damaged professional reputation,
              or inaccurate information presented to employers.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. User Accounts</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You must provide accurate and truthful information when creating an account.</li>
            <li>You are solely responsible for maintaining the confidentiality of your password.</li>
            <li>You must be at least 16 years old to use this Service.</li>
            <li>One account per person. Account sharing or resale is prohibited.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately of any unauthorized access to your account.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Subscription & Payments</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Free accounts include limited AI usage per calendar month.</li>
            <li>Paid subscriptions are billed on a recurring basis (monthly or annually as selected).</li>
            <li>You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
            <li>All payments are non-refundable unless required by applicable law, or within 7 days of initial purchase if no AI features have been used. To request a refund, email <a href="mailto:support@jobpilotai.co" className="text-brand-light hover:text-white transition-colors">support@jobpilotai.co</a>.</li>
            <li>We reserve the right to change pricing with 30 days&apos; written notice to existing subscribers.</li>
            <li>Failed payments may result in account downgrade to the free plan.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">6. Acceptable Use</h2>
          <p className="mb-3">You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Use the Service to generate fraudulent, fabricated, or materially misleading resume content that misrepresents your qualifications.</li>
            <li>Attempt to bypass, circumvent, or exploit usage limits or access controls.</li>
            <li>Use automated scripts, bots, or scrapers to access the Service.</li>
            <li>Upload content that is illegal, defamatory, or infringes on third-party rights.</li>
            <li>Resell, redistribute, or white-label AI outputs as a competing commercial service.</li>
            <li>Use the Service to harm, harass, or discriminate against others.</li>
            <li>Reverse engineer, decompile, or attempt to extract source code from the Service.</li>
            <li>Introduce viruses, malware, or other malicious code.</li>
          </ul>
          <p className="mt-3">
            Violation of these rules may result in immediate account termination without refund.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">7. Intellectual Property</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You retain ownership of the personal content you input (resume text, profile text, etc.).</li>
            <li>AI-generated outputs are provided for your personal and professional use. You may use them freely in job applications and professional profiles.</li>
            <li>The Service&apos;s design, code, branding, and proprietary features remain our exclusive property.</li>
            <li>You grant us a limited, non-exclusive license to process your input data solely for the purpose of providing the Service.</li>
          </ul>
        </section>

        {/* Section 8 — LIMITATION OF LIABILITY */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">8. Limitation of Liability</h2>
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 mb-4">
            <p className="text-red-300 font-medium text-sm uppercase tracking-wide">
              Please read carefully
            </p>
          </div>
          <p className="mb-3">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
          </p>
          <ul className="list-disc list-inside space-y-3 ml-4">
            <li>
              The Service is provided <strong className="text-white">&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;</strong> without
              warranties of any kind, whether express, implied, statutory, or otherwise, including but not
              limited to warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement.
            </li>
            <li>
              We do not warrant that the Service will be uninterrupted, error-free, secure, or that AI outputs
              will be accurate, complete, or suitable for any particular purpose.
            </li>
            <li>
              IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, including but not limited to: loss of profits, loss of data, loss of
              employment opportunities, damage to professional reputation, or business interruption,
              regardless of the cause of action or theory of liability.
            </li>
            <li>
              OUR TOTAL AGGREGATE LIABILITY for any and all claims arising from or related to the Service
              shall not exceed the amount you have paid us in the <strong className="text-white">three (3) months</strong> immediately
              preceding the event giving rise to the claim, or <strong className="text-white">fifty US dollars (USD $50)</strong>, whichever is greater.
            </li>
            <li>
              You acknowledge that AI technology is inherently imperfect and that errors, hallucinations,
              and inaccuracies in AI outputs are a known limitation that you accept by using the Service.
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless JobPilot AI, its owners, operators, affiliates,
            and agents from and against any and all claims, damages, losses, costs, and expenses (including
            reasonable legal fees) arising from or related to: (a) your use of the Service; (b) your violation
            of these Terms; (c) your use of AI-generated content; (d) any content you submit to the Service;
            or (e) your violation of any rights of a third party.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">10. Account Termination</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You may delete your account at any time through the Settings page. All your data will be permanently removed.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms, without prior notice and without refund.</li>
            <li>We reserve the right to discontinue the Service entirely with 30 days&apos; notice to registered users.</li>
            <li>Upon termination, your right to use the Service ceases immediately. Sections 3, 7, 8, 9, and 11 survive termination.</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">11. Governing Law & Disputes</h2>
          <p className="mb-3">
            These Terms are governed by and construed in accordance with the laws of the United Kingdom,
            without regard to conflict of law principles.
          </p>
          <p className="mb-3">
            Any dispute arising from or relating to these Terms or the Service shall first be attempted to
            be resolved through good-faith negotiation. If unresolved within 30 days, either party may
            pursue resolution through the courts of England and Wales.
          </p>
          <p>
            You agree to waive any right to participate in a class action lawsuit or class-wide arbitration
            against us, to the extent permitted by law.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">12. Severability</h2>
          <p>
            If any provision of these Terms is held to be unenforceable or invalid, that provision will be
            limited or eliminated to the minimum extent necessary, and the remaining provisions will remain
            in full force and effect.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be communicated
            via email to registered users at least 14 days before taking effect. Your continued use of the
            Service after the effective date constitutes acceptance of the revised Terms. If you do not agree
            to the updated Terms, you must stop using the Service and delete your account.
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">14. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and
            JobPilot AI regarding your use of the Service. These Terms supersede any prior agreements or
            communications regarding the Service.
          </p>
        </section>

        {/* Section 15 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">15. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:legal@jobpilotai.co" className="text-brand-light hover:text-white transition-colors">
              legal@jobpilotai.co
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
