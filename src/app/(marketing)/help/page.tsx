/* ============================================================
   HELP / FAQ PAGE — Customer Support Hub
   ============================================================
   Accordion-style FAQ organized by category. Covers account,
   AI features, billing, privacy, and troubleshooting.
   No database interaction — purely static content.
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";

/* ---- FAQ Data ---- */
/* Each section has a title, icon, and array of Q&A pairs */
const faqSections = [
  {
    title: "Getting Started",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    questions: [
      {
        q: "How do I create an account?",
        a: "Click \"Get Started Free\" on the homepage or go to the signup page. You can register with your email and password, or sign in instantly with Google. No credit card required.",
      },
      {
        q: "Is JobPilot AI really free?",
        a: "Yes! The free plan includes 20 AI calls per month, access to all AI tools (resume analysis, cover letter generator, interview prep, LinkedIn optimizer), job search, application tracker, and networking CRM. Upgrade to Pro for 1,000 AI calls/month.",
      },
      {
        q: "What browsers are supported?",
        a: "JobPilot AI works on all modern browsers — Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.",
      },
    ],
  },
  {
    title: "AI Features",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    questions: [
      {
        q: "How does the AI resume analysis work?",
        a: "Upload your resume (PDF or text) and our AI will analyze it for ATS compatibility, content quality, keyword optimization, and formatting. You'll receive detailed feedback with specific improvement suggestions.",
      },
      {
        q: "Are AI-generated cover letters unique?",
        a: "Yes. Each cover letter is generated fresh based on your resume and the specific job description you provide. The AI tailors tone, keywords, and achievements to match each role.",
      },
      {
        q: "Is my resume data stored?",
        a: "Resume text uploaded for AI analysis is processed ephemerally — it is NOT stored after the request completes. Resumes you explicitly save to your profile are stored securely and can be deleted at any time.",
      },
      {
        q: "What AI model do you use?",
        a: "We use Google's Gemini models with an intelligent fallback chain. If one model is unavailable, requests automatically route to the next available model — ensuring high reliability.",
      },
      {
        q: "What counts as an AI call?",
        a: "Each AI-powered action counts as one call: analyzing a resume, generating a cover letter, preparing interview questions, optimizing LinkedIn content, or generating outreach messages. Browsing, saving jobs, and tracking applications do NOT count.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    questions: [
      {
        q: "How do I upgrade to Pro?",
        a: "Go to Dashboard → Settings → Billing tab and click \"Upgrade to Pro\". You can choose monthly or annual billing (save 20% with annual). Payment is processed securely through Stripe.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your Pro subscription at any time from the billing portal. You'll retain Pro access until the end of your current billing period. No cancellation fees.",
      },
      {
        q: "When does my AI usage reset?",
        a: "Your monthly AI call count resets on the same day each month (the day you signed up or upgraded). You can see your exact reset date in Dashboard → Settings → Usage tab.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer refunds within the first 7 days of a new subscription if you're not satisfied. After that, your subscription continues until the end of the billing period. For any billing issues, email support@jobpilotai.co.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    questions: [
      {
        q: "How is my data protected?",
        a: "We use TLS encryption for all data in transit, bcrypt for password hashing, and JWT for secure sessions. Your data is stored in an encrypted database. We never share your personal information with third parties for marketing purposes.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. Go to Dashboard → Settings → Account tab and click \"Download My Data\" in the Data & Privacy section. This exports all your data (profile, resumes, applications, contacts, cover letters, AI history) as a JSON file.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Dashboard → Settings → Account tab → Danger Zone and click \"Delete My Account\". Your account is deactivated immediately, and all data is permanently deleted after 30 days. This gives you a recovery window if you change your mind.",
      },
      {
        q: "Do you comply with GDPR?",
        a: "Yes. We comply with GDPR, CCPA, and the Australian Privacy Act. You can access, export, and delete your data at any time. We only use essential cookies (no tracking). See our Privacy Policy for full details.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A3.001 3.001 0 006 9H4.5a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v3A1.5 1.5 0 0119.5 9H18a3 3 0 00-.036 2.98L12.58 15.17a1 1 0 01-1.16 0zM12 17.5v3" />
      </svg>
    ),
    questions: [
      {
        q: "I'm getting a rate limit error.",
        a: "To prevent abuse, we limit API calls to 6 per minute and 40 per hour. Wait a moment and try again. If you're consistently hitting limits, consider upgrading to Pro for higher monthly allowances.",
      },
      {
        q: "My AI response seems slow.",
        a: "AI processing typically takes 3-15 seconds depending on the complexity of the request. If responses are consistently slow, try refreshing the page. Our AI has a 30-second timeout with automatic retries.",
      },
      {
        q: "I forgot my password.",
        a: "Click \"Forgot Password\" on the login page and enter your email. You'll receive a reset link (valid for 1 hour). If you signed up with Google, use the \"Sign in with Google\" button instead.",
      },
      {
        q: "The resume upload isn't working.",
        a: "We accept PDF files up to 5MB. Make sure your PDF isn't password-protected or scanned-image-only (we need text content). If issues persist, try copying and pasting your resume text directly.",
      },
    ],
  },
];

/* ---- Accordion Item Component ---- */
function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-card-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-white group-hover:text-brand-light transition-colors pr-4">
          {question}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm text-text-secondary leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ---- Main Help Page ---- */
export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Help Center
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Find answers to common questions about JobPilot AI.
      </p>

      {/* ---- FAQPage JSON-LD for Google rich results ---- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqSections.flatMap((s) =>
              s.questions.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              }))
            ),
          }).replace(/<\/script/gi, "<\\/script"),
        }}
      />

      {/* ---- FAQ Sections ---- */}
      <div className="space-y-8">
        {faqSections.map((section) => (
          <div key={section.title} className="glass-card p-6 sm:p-8">
            {/* Section header with icon */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-brand-indigo/10 text-brand-light">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
            </div>

            {/* Questions accordion */}
            <div>
              {section.questions.map((item) => (
                <AccordionItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---- Still Need Help? ---- */}
      <div className="mt-12 glass-card p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Still need help?</h2>
        <p className="text-text-secondary text-sm mb-6">
          Can&apos;t find what you&apos;re looking for? Reach out to us directly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="btn-primary text-sm"
          >
            Contact Us
          </Link>
          <a
            href="mailto:support@jobpilotai.co"
            className="px-6 py-2.5 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
