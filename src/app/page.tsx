/* ============================================================
   HOME PAGE - JobPilot AI Landing Page
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

const StarField = dynamic(() => import("@/components/StarField"));
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"));
const EcosystemShowcase = dynamic(() => import("@/components/EcosystemShowcase"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
/* # Testimonials removed — will re-add with real user reviews post-launch */
const Pricing = dynamic(() => import("@/components/Pricing"));
const CTA = dynamic(() => import("@/components/CTA"));

export default function Home() {
  return (
    <>
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
