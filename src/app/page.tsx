/* ============================================================
   HOME PAGE - JP Arc Landing Page
   ============================================================
   This is the main landing page that visitors see first.
   It assembles all sections in order:
   1. StarField (animated background — behind everything)
   2. Navbar (sticky top navigation)
   3. Hero (main headline + CTA)
   4. FeatureShowcase (deep-dive feature sections)
   5. EcosystemShowcase (Chrome Extension + Application Tracker)
   6. HowItWorks (3-step guide)
   7. Testimonials (social proof)
   8. Pricing (3-tier plans)
   9. CTA (final call to action)
   10. Footer (links + legal)
   ============================================================ */

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { FAQPageJsonLd } from "@/components/JsonLd";

const StarField = dynamic(() => import("@/components/StarField"));
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"));
const EcosystemShowcase = dynamic(() => import("@/components/EcosystemShowcase"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
/* # Testimonials removed — will re-add with real user reviews post-launch */
const Pricing = dynamic(() => import("@/components/Pricing"));
const CTA = dynamic(() => import("@/components/CTA"));

/* # Homepage FAQ schema — helps Google AI Overview understand what JP Arc is */
const homeFaqs = [
  { q: "What is JP Arc?", a: "JP Arc is an AI-powered career platform at jobpilotai.co that helps job seekers build ATS-optimized resumes, generate cover letters, practice mock interviews, search jobs, and track applications. Founded in 2026, JP Arc serves job seekers worldwide." },
  { q: "Is JP Arc free to use?", a: "Yes. JP Arc offers a free plan with access to every feature including AI resume analysis, cover letter generation, mock interviews, LinkedIn optimization, job search, application tracking, and portfolio builder. The Pro plan offers more AI calls per month." },
  { q: "What does JP Arc stand for?", a: "JP Arc is a career technology brand. The name represents the arc of a career journey — from resume to offer. JP Arc is available at jobpilotai.co and is not related to J-PARC, ARC Academy, or any other entity." },
];

export default function Home() {
  return (
    <>
      {/* # FAQ schema on homepage for brand disambiguation in Google AI */}
      <FAQPageJsonLd faqs={homeFaqs} />

      {/* Star field is fixed-position, sits behind all content */}
      <StarField />

      {/* Main content stack — z-10 so it sits above the stars */}
      <Navbar />
      <main>
        <Hero />
        <FeatureShowcase />
        <EcosystemShowcase />
        <HowItWorks />
        {/* Testimonials removed until real user reviews available */}
        <Pricing />
        <CTA />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
