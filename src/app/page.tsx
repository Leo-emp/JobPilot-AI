/* ============================================================
   HOME PAGE - JobPilot AI Landing Page
   ============================================================
   This is the main landing page that visitors see first.
   It assembles all sections in order:
   1. StarField (animated background — behind everything)
   2. Navbar (sticky top navigation)
   3. Hero (main headline + CTA)
   4. Features (8 feature cards)
   5. HowItWorks (3-step guide)
   6. Testimonials (social proof)
   7. Pricing (3-tier plans)
   8. CTA (final call to action)
   9. Footer (links + legal)
   ============================================================ */

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

const StarField = dynamic(() => import("@/components/StarField"));
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"));
const EcosystemShowcase = dynamic(() => import("@/components/EcosystemShowcase"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
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
        <TrustBar />
        <div className="relative z-10 max-w-4xl mx-auto h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
        <Features />
        <FeatureShowcase />
        <EcosystemShowcase />
        <div className="relative z-10 max-w-4xl mx-auto h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
        <HowItWorks />
        <Testimonials />
        <div className="relative z-10 max-w-4xl mx-auto h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
        <Pricing />
        <CTA />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
