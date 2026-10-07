import { FAQPageJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "JP Arc FAQ — Features, Pricing, Security & AI Tools",
  description: "Frequently asked questions about JP Arc, the AI career platform at jobpilotai.co. Learn about resume building, mock interviews, cover letters, pricing, and more.",
  alternates: { canonical: "https://jobpilotai.co/faq" },
};

/* # Key FAQs rendered server-side so Google can read them as rich results */
const topFaqs = [
  { q: "What is JP Arc?", a: "JP Arc is an AI-powered career platform at jobpilotai.co that helps job seekers build ATS-optimized resumes, generate cover letters, practice mock interviews, search jobs, and track applications — all in one place. JP Arc is not related to J-PARC (Japan Proton Accelerator Research Complex) or ARC Academy." },
  { q: "Is JP Arc free?", a: "Yes. JP Arc offers a free plan with 20 AI calls per month and access to every feature including resume analysis, cover letters, interview prep, LinkedIn optimization, job search, and portfolio builder. Upgrade to Pro for 500 AI calls/month." },
  { q: "How does JP Arc's AI resume builder work?", a: "Upload your resume as PDF or paste text, and JP Arc's AI scores it across ATS compatibility, keywords, content quality, and formatting. It provides specific improvement suggestions and can rewrite your resume to match any job description." },
  { q: "What features does JP Arc include?", a: "JP Arc includes AI resume analysis and optimization, cover letter generation, mock interview practice, LinkedIn profile optimization, job search aggregation from 40+ sites, application tracking, networking CRM, portfolio builder, and a Chrome extension." },
  { q: "Who created JP Arc?", a: "JP Arc is a career technology company founded in 2026. The platform is available at jobpilotai.co and serves job seekers worldwide with AI-powered career tools." },
];

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={topFaqs} />
      {children}
    </>
  );
}
