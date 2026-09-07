/* ============================================================
   FAQ PAGE — Comprehensive Frequently Asked Questions
   ============================================================
   Covers everything visitors might want to know: features,
   pricing, security, country resumes, AI tools, integrations,
   troubleshooting, and more. Accessible from footer nav.
   Static content — no API calls, no database interaction.
   ============================================================ */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ---- Types ---- */
interface FaqItem {
  q: string;
  a: string;
}

interface FaqSection {
  title: string;
  icon: React.ReactNode;
  questions: FaqItem[];
}

/* ============================================================
   FAQ DATA — Organized by category
   ============================================================ */
const faqSections: FaqSection[] = [
  /* ---- 1. Getting Started ---- */
  {
    title: "Getting Started",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    questions: [
      {
        q: "What is JobPilot AI?",
        a: "JobPilot AI is an all-in-one AI-powered career platform that helps job seekers land their dream jobs faster. It includes AI resume analysis and optimization, cover letter generation, interview preparation, LinkedIn profile optimization, job search aggregation, application tracking, networking CRM, and a professional portfolio builder — all in one place.",
      },
      {
        q: "How do I create an account?",
        a: "Click \"Get Started Free\" on the homepage or go to the signup page. You can register with your email and password, or sign in instantly with Google. No credit card required — you get full access to all features on the free plan.",
      },
      {
        q: "Is JobPilot AI really free?",
        a: "Yes! The free plan gives you 20 AI calls per month with access to every feature: resume analysis, cover letters, interview prep, LinkedIn optimization, job search, application tracker, networking CRM, and portfolio builder. Upgrade to Pro for 500 AI calls/month when you need more.",
      },
      {
        q: "What browsers and devices are supported?",
        a: "JobPilot AI works on all modern browsers — Chrome, Firefox, Safari, and Edge — on both desktop and mobile. The interface is fully responsive, so you can manage your job search from any device. We recommend using the latest browser version for the best experience.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. JobPilot AI is a web application — just visit the site and log in. We also offer an optional Chrome Extension that automatically saves job listings as you browse job boards like LinkedIn, Indeed, and Glassdoor, but it's not required.",
      },
    ],
  },

  /* ---- 2. AI Resume Tools ---- */
  {
    title: "AI Resume Tools",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    questions: [
      {
        q: "How does the AI resume analysis work?",
        a: "Upload your resume (PDF or paste text) and our AI scores it across multiple dimensions: ATS compatibility, keyword optimization, content quality, formatting, and impact. You receive a detailed breakdown with a numeric score and specific improvement suggestions you can action immediately.",
      },
      {
        q: "What is resume optimization?",
        a: "Resume optimization rewrites your resume to better match a specific job description. The AI identifies missing keywords, strengthens weak bullet points with action verbs and metrics, and restructures content for maximum ATS compatibility — while keeping your authentic experience intact.",
      },
      {
        q: "What does 'Rebuild Resume' do?",
        a: "Rebuild creates an entirely new resume from scratch using your existing resume as source material. It's ideal when your current resume needs a complete overhaul — the AI restructures everything into a professional, ATS-optimized format with strong impact statements.",
      },
      {
        q: "What is Deep Tailor?",
        a: "Deep Tailor is our most advanced optimization mode. It performs a thorough analysis of the job description to identify every required skill, qualification, and keyword, then deeply tailors your resume to match — going beyond surface-level keyword insertion to demonstrate genuine alignment.",
      },
      {
        q: "What is Career Pivot mode?",
        a: "Career Pivot is designed for people changing industries or roles. It reframes your existing experience to highlight transferable skills relevant to your target role, repositions your career narrative, and bridges the gap between where you've been and where you want to go.",
      },
      {
        q: "Can the AI add skills or experience I don't have?",
        a: "No. The AI only works with the information you provide. It will never fabricate experience, qualifications, or skills. It optimizes how your real experience is presented — using stronger language, better structure, and relevant keywords from the job description.",
      },
      {
        q: "What format should my resume be in?",
        a: "You can upload a PDF or paste your resume text directly. For best results, use a text-based PDF (not a scanned image). The AI needs to read the actual text content of your resume to analyze and optimize it.",
      },
    ],
  },

  /* ---- 3. Country-Specific Resumes ---- */
  {
    title: "Country-Specific Resumes (US, UK, AU)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    questions: [
      {
        q: "What are country-specific resumes?",
        a: "Different countries have different resume conventions. A US resume is typically 1 page with centered headers, while a UK CV is 2 pages with a Personal Statement, and an Australian resume is 2-3 pages with specific sections like Work Rights and Referees. Our country modes generate resumes that follow the exact conventions employers expect in each market.",
      },
      {
        q: "Which countries are supported?",
        a: "We currently support three countries: United States (US), United Kingdom (UK), and Australia (AU). Each has its own formatting rules, section requirements, spelling conventions, and cultural norms built into the AI.",
      },
      {
        q: "How does the US resume format differ?",
        a: "US resumes are typically 1 page with a centered name and contact line, centered section headers, a Professional Summary, Work Experience with metrics-driven bullet points, Core Skills, and Education. They use American English spelling and concise, achievement-focused language.",
      },
      {
        q: "How does the UK CV format differ?",
        a: "UK CVs are typically 2 pages with a Personal Statement, Key Skills in a compact format, Work Experience, and Education & Qualifications. They use British English spelling (e.g., 'organised', 'optimised') and may include sections for driving licence status, notice period, and references.",
      },
      {
        q: "How does the Australian resume format differ?",
        a: "Australian resumes are typically 2-3 pages with a Professional Summary, Key Skills, Professional Experience with detailed achievements, and Education & Qualifications. They use Australian English spelling and may include Work Rights (visa status), Licences, Professional Development, and Referees.",
      },
      {
        q: "Are country-specific resumes ATS friendly?",
        a: "Yes. All country formats are optimized to be highly ATS-friendly. We use clean single-column layouts, standard section headings, proper formatting, and keyword optimization. No tables, columns, graphics, or special characters that could confuse ATS parsers.",
      },
      {
        q: "Can I download country-specific resumes?",
        a: "Yes. You can download your country-specific resume as a PDF or Word document. US resumes have centered formatting in the PDF, while UK and AU resumes use left-aligned layouts. File names indicate the country (e.g., resume-us-jobpilot.pdf).",
      },
    ],
  },

  /* ---- 4. Cover Letters & Interview Prep ---- */
  {
    title: "Cover Letters & Interview Prep",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    questions: [
      {
        q: "How does the cover letter generator work?",
        a: "Provide your resume and the job description, and our AI generates a tailored cover letter that highlights your most relevant experience, matches the company's tone, and addresses the specific requirements of the role. Each letter is unique — never templated.",
      },
      {
        q: "Can I customize the cover letter tone?",
        a: "Yes. You can specify the tone (professional, conversational, confident) and provide additional context like why you're interested in the company or specific achievements you want highlighted. The AI adapts its writing style accordingly.",
      },
      {
        q: "What does interview prep include?",
        a: "Our AI generates tailored interview questions based on the specific job description, including behavioral questions (STAR format), technical questions, situational scenarios, and suggested answers using your resume experience. It also includes tips for each question type.",
      },
      {
        q: "Is there a mock interview feature?",
        a: "Yes. The mock interview simulates a real interview experience with AI-generated questions. You practice answering, and the AI provides feedback on your responses — evaluating relevance, structure, and impact. It helps you identify weak points before the real interview.",
      },
    ],
  },

  /* ---- 5. LinkedIn & Networking ---- */
  {
    title: "LinkedIn & Networking",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    questions: [
      {
        q: "What is the LinkedIn Optimizer?",
        a: "The LinkedIn Optimizer analyzes your LinkedIn profile (via screenshots) and provides a detailed audit with scoring across key areas: headline, summary, experience, skills, and overall impact. It generates specific improvement suggestions and can rewrite sections for you.",
      },
      {
        q: "How does the networking CRM work?",
        a: "The networking CRM helps you manage professional contacts. You can add contacts manually or from job applications, track interaction history, set follow-up reminders, and categorize contacts by relationship type. It keeps your networking organized and ensures you never lose a valuable connection.",
      },
      {
        q: "Can the AI write outreach messages?",
        a: "Yes. The AI can generate personalized networking outreach messages, follow-up emails, and LinkedIn connection requests. Provide context about the person and your goal, and the AI crafts a natural, professional message tailored to the situation.",
      },
    ],
  },

  /* ---- 6. Job Search & Application Tracking ---- */
  {
    title: "Job Search & Application Tracking",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    questions: [
      {
        q: "How does the job search work?",
        a: "Our job search aggregates listings from multiple sources including LinkedIn, Indeed, Glassdoor, and remote job boards. You can filter by keywords, location, salary, job type, and experience level. Save interesting jobs to your tracker with one click.",
      },
      {
        q: "What is the application tracker?",
        a: "The application tracker is a Kanban-style board that lets you track every job application through stages: Saved, Applied, Interview, Offer, and Rejected. Add notes, deadlines, contact information, and documents to each application. Never lose track of where you stand.",
      },
      {
        q: "Can I save jobs from external sites?",
        a: "Yes. Our Chrome Extension lets you save job listings directly from LinkedIn, Indeed, Glassdoor, and 40+ other job boards with one click. It automatically captures the job title, company, location, salary, and description — no copy-pasting needed.",
      },
      {
        q: "Does the tracker send reminders?",
        a: "The tracker shows upcoming deadlines and interview dates on your dashboard. You can set custom dates for each application and see at a glance which applications need attention. Email reminders for follow-ups are planned for a future update.",
      },
    ],
  },

  /* ---- 7. Portfolio Builder ---- */
  {
    title: "Portfolio Builder",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
      </svg>
    ),
    questions: [
      {
        q: "What is the portfolio builder?",
        a: "The portfolio builder creates a professional online portfolio showcasing your work, skills, and experience. Choose from multiple templates, add projects with descriptions and links, and share a public URL with recruiters and hiring managers.",
      },
      {
        q: "Can I use a custom domain?",
        a: "Currently, portfolios are hosted on a JobPilot AI subdomain (e.g., jobpilotai.co/p/your-name). Custom domain support is planned for a future update. You can share your portfolio link anywhere — LinkedIn, email signatures, or your resume.",
      },
      {
        q: "What templates are available?",
        a: "We offer multiple professionally designed portfolio templates with different layouts and styles. Each template is fully responsive and optimized for both desktop and mobile viewing. You can switch templates anytime without losing your content.",
      },
    ],
  },

  /* ---- 8. Billing & Plans ---- */
  {
    title: "Billing & Plans",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    questions: [
      {
        q: "What plans are available?",
        a: "We offer two plans: Free (20 AI calls/month, all features included) and Pro (500 AI calls/month, all features included). Both plans have access to every feature — the only difference is the number of AI calls. There are no feature gates.",
      },
      {
        q: "What counts as an AI call?",
        a: "Each AI-powered action counts as one call: analyzing a resume, optimizing a resume, generating a cover letter, preparing interview questions, optimizing LinkedIn content, generating outreach messages, or creating country-specific resumes. Browsing, saving jobs, tracking applications, managing contacts, and building your portfolio do NOT count.",
      },
      {
        q: "How do I upgrade to Pro?",
        a: "Go to Dashboard → Settings → Billing tab and click \"Upgrade to Pro\". You can choose monthly or annual billing (save 20% with annual). Payment is processed securely through Stripe. Your AI call limit increases immediately upon upgrade.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your Pro subscription at any time from the billing portal. You'll retain Pro access until the end of your current billing period — no prorating, no cancellation fees. You can always re-subscribe later.",
      },
      {
        q: "When does my AI usage reset?",
        a: "Your monthly AI call count resets on the same day each month (the anniversary of when you signed up or upgraded). You can see your exact reset date and remaining calls in Dashboard → Settings → Usage tab.",
      },
      {
        q: "Do you offer refunds?",
        a: "All payments are non-refundable. You can cancel your subscription at any time and retain access until the end of your current billing period. Our free tier gives you full access to every feature so you can evaluate the platform before subscribing. For billing issues, email support@jobpilotai.co.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) processed through Stripe. Stripe is PCI-DSS Level 1 certified — the highest level of payment security. We never store your card details on our servers.",
      },
    ],
  },

  /* ---- 9. Privacy & Security ---- */
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
        a: "We use TLS encryption for all data in transit, bcrypt for password hashing, and JWT for secure sessions. Your data is stored in an encrypted database with SOC 2 certified infrastructure. We implement rate limiting, CAPTCHA protection, and comprehensive audit logging.",
      },
      {
        q: "Is my resume data stored after AI processing?",
        a: "Resume text uploaded for AI analysis is processed ephemerally — it is NOT stored permanently after the request completes. AI results (the generated output) are saved to your history so you can reference them later, and you can delete your history at any time.",
      },
      {
        q: "Do you sell my data to third parties?",
        a: "No. We never sell, share, or trade your personal data with third parties for marketing or any other purpose. Your data is used exclusively to provide JobPilot AI services to you. See our Privacy Policy for full details.",
      },
      {
        q: "Can I export all my data?",
        a: "Yes. Go to Dashboard → Settings → Account tab and click \"Download My Data\" in the Data & Privacy section. This exports everything — your profile, resumes, applications, contacts, cover letters, portfolio, and AI history — as a JSON file you can keep.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Dashboard → Settings → Account tab → Danger Zone and click \"Delete My Account\". Your account is deactivated immediately, and all personal data is permanently deleted after a 30-day recovery window. If you change your mind within 30 days, contact us to restore it.",
      },
      {
        q: "Do you comply with GDPR and privacy laws?",
        a: "Yes. We comply with GDPR (EU), CCPA (California), and the Australian Privacy Act. You have the right to access, export, rectify, and delete your data at any time. We only use essential cookies — no tracking cookies. Our full privacy practices are detailed in our Privacy Policy.",
      },
      {
        q: "Is two-factor authentication available?",
        a: "Yes. You can enable two-factor authentication (2FA) in Dashboard → Settings → Security. We support TOTP-based authenticators (Google Authenticator, Authy, etc.). 2FA adds an extra layer of protection even if your password is compromised.",
      },
    ],
  },

  /* ---- 10. Chrome Extension ---- */
  {
    title: "Chrome Extension",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.03-.134-2.005.71-2.005 1.753v0c0 .726.41 1.394 1.073 1.685a13.1 13.1 0 006.501 1.12v0a.64.64 0 01.658.665c-.003.652-.032 1.3-.084 1.944-.066.812.465 1.559 1.27 1.673a25.2 25.2 0 003.607.262c1.258 0 2.493-.084 3.607-.262.806-.114 1.336-.861 1.27-1.673a26.42 26.42 0 00-.084-1.944.64.64 0 01.658-.665v0a13.1 13.1 0 006.5-1.12c.664-.291 1.074-.96 1.074-1.685v0c0-1.044-.975-1.887-2.005-1.753a48.345 48.345 0 01-4.163.3.64.64 0 01-.657-.643v0z" />
      </svg>
    ),
    questions: [
      {
        q: "What does the Chrome Extension do?",
        a: "The JobPilot AI Chrome Extension automatically detects job listings on supported sites and lets you save them to your application tracker with one click. It captures job title, company, location, salary, description, and required skills — no manual entry needed.",
      },
      {
        q: "Which job sites does it support?",
        a: "The extension works on 40+ job sites including LinkedIn, Indeed, Glassdoor, Monster, ZipRecruiter, AngelList, We Work Remotely, Remote.co, and many more. We're constantly adding support for additional job boards.",
      },
      {
        q: "Is the extension free?",
        a: "Yes. The Chrome Extension is completely free for all JobPilot AI users, including free plan members. It's an optional tool to enhance your job search workflow.",
      },
      {
        q: "How do I install it?",
        a: "Visit the Chrome Web Store and search for \"JobPilot AI\" or follow the install link from your dashboard. Click \"Add to Chrome\" and sign in with your JobPilot AI account. The extension icon will appear in your browser toolbar.",
      },
    ],
  },

  /* ---- 11. For Employers ---- */
  {
    title: "For Employers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    questions: [
      {
        q: "Does JobPilot AI have employer features?",
        a: "Yes. We offer an employer portal where companies can post roles, manage candidate pipelines, communicate with applicants, and collaborate as a hiring team. Employers get a dedicated dashboard with application management and team tools.",
      },
      {
        q: "Can organizations manage team accounts?",
        a: "Yes. Organizations can create a team workspace, invite members, and manage AI usage across the team. Organization admins can sponsor Pro access for team members, view usage stats, and export data.",
      },
      {
        q: "How do candidates apply to posted roles?",
        a: "Candidates can discover and apply to roles directly through the JobPilot AI platform. Employers receive applications in their pipeline dashboard, where they can review resumes, track candidates through stages, and communicate with applicants.",
      },
    ],
  },

  /* ---- 12. Technical & Troubleshooting ---- */
  {
    title: "Technical & Troubleshooting",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A3.001 3.001 0 006 9H4.5a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 014.5 3h15A1.5 1.5 0 0121 4.5v3A1.5 1.5 0 0119.5 9H18a3 3 0 00-.036 2.98L12.58 15.17a1 1 0 01-1.16 0zM12 17.5v3" />
      </svg>
    ),
    questions: [
      {
        q: "I'm getting a rate limit error.",
        a: "To prevent abuse, we limit requests to 6 per minute and 40 per hour. Wait a moment and try again. If you're consistently hitting limits, space out your requests or upgrade to Pro for a higher monthly allowance (the per-minute/hour burst limits remain the same).",
      },
      {
        q: "My AI response seems slow or timed out.",
        a: "AI processing typically takes 3-15 seconds depending on complexity. If responses are consistently slow, try refreshing the page. Our AI has a 60-second timeout with automatic retries. If the issue persists, it may be a temporary capacity issue — try again in a few minutes.",
      },
      {
        q: "I forgot my password.",
        a: "Click \"Forgot Password\" on the login page and enter your email. You'll receive a password reset link valid for 1 hour. If you signed up with Google, use the \"Sign in with Google\" button instead — no password needed.",
      },
      {
        q: "The resume upload isn't working.",
        a: "We accept PDF files up to 5MB. Make sure your PDF isn't password-protected or scanned-image-only (we need readable text content). If issues persist, try copying and pasting your resume text directly into the text input field.",
      },
      {
        q: "My AI results look different from what I expected.",
        a: "AI outputs can vary between generations. If a result doesn't match your expectations, try regenerating — each generation may emphasize different aspects. You can also provide more specific instructions in the job description or notes field to guide the AI.",
      },
      {
        q: "The site isn't loading properly.",
        a: "Try clearing your browser cache and cookies, then reload the page. If you're using a VPN or ad blocker, try disabling them temporarily. Make sure JavaScript is enabled in your browser. If the issue persists, contact us at support@jobpilotai.co.",
      },
    ],
  },
];

/* ============================================================
   ACCORDION ITEM COMPONENT
   ============================================================ */
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
        {/* Chevron icon — rotates when open */}
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
      {/* Answer — only shown when open */}
      {open && (
        <div className="pb-4 text-sm text-text-secondary leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN FAQ PAGE
   ============================================================ */
export default function FaqPage() {
  /* ---- Search state ---- */
  const [search, setSearch] = useState("");

  /* ---- Filter FAQ sections based on search ---- */
  const filteredSections = useMemo(() => {
    if (!search.trim()) return faqSections;

    const lower = search.toLowerCase();
    return faqSections
      .map((section) => ({
        ...section,
        questions: section.questions.filter(
          (item) =>
            item.q.toLowerCase().includes(lower) ||
            item.a.toLowerCase().includes(lower)
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [search]);

  /* ---- Count total questions ---- */
  const totalQuestions = faqSections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
        Frequently Asked Questions
      </h1>
      <p className="text-text-secondary text-lg mb-8">
        Everything you need to know about JobPilot AI — {totalQuestions} answers across {faqSections.length} categories.
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

      {/* ---- Search Bar ---- */}
      <div className="relative mb-10">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-elevated border border-card-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo/50 transition-all"
        />
        {/* Clear button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ---- Quick Jump Navigation ---- */}
      {!search && (
        <div className="flex flex-wrap gap-2 mb-10">
          {faqSections.map((section) => (
            <a
              key={section.title}
              href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-card-border/50 text-text-secondary hover:text-white hover:border-brand-indigo/40 hover:bg-brand-indigo/10 transition-all"
            >
              {section.title}
            </a>
          ))}
        </div>
      )}

      {/* ---- FAQ Sections ---- */}
      <div className="space-y-8">
        {filteredSections.length === 0 ? (
          /* No results */
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted text-sm">
              No questions match &ldquo;{search}&rdquo;. Try different keywords or{" "}
              <Link href="/contact" className="text-brand-light hover:underline">
                contact us
              </Link>{" "}
              for help.
            </p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div
              key={section.title}
              id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="glass-card p-6 sm:p-8 scroll-mt-24"
            >
              {/* Section header with icon */}
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-brand-indigo/10 text-brand-light">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {section.title}
                </h2>
                <span className="ml-auto text-xs text-text-muted">
                  {section.questions.length} {section.questions.length === 1 ? "question" : "questions"}
                </span>
              </div>

              {/* Questions accordion */}
              <div>
                {section.questions.map((item) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- Still Need Help? ---- */}
      <div className="mt-12 glass-card p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-3">
          Still have questions?
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Can&apos;t find what you&apos;re looking for? Our team is here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-primary text-sm">
            Contact Us
          </Link>
          <a
            href="mailto:support@jobpilotai.co"
            className="px-6 py-2.5 text-sm font-medium text-brand-light border border-brand-indigo/30 rounded-xl hover:bg-brand-indigo/10 transition-colors"
          >
            Email Support
          </a>
          <Link
            href="/help"
            className="px-6 py-2.5 text-sm font-medium text-text-secondary border border-card-border/50 rounded-xl hover:bg-surface-elevated hover:text-white transition-colors"
          >
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
