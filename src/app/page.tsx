/* ============================================================
   HOME PAGE - JobPilot AI Landing Page
   ============================================================
   This is the main landing page that visitors see first.
   It assembles all sections in order:
   1. StarField (animated background — behind everything)
   2. Navbar (sticky top navigation)
   3. Hero (main headline + CTA)
   4. Features (6 feature cards)
   5. HowItWorks (3-step guide)
   6. Testimonials (social proof)
   7. Pricing (3-tier plans)
   8. CTA (final call to action)
   9. Footer (links + legal)
   ============================================================ */

import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import FeatureShowcase from "@/components/FeatureShowcase";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import EcosystemShowcase from "@/components/EcosystemShowcase";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

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
        <Features />
        <FeatureShowcase />
        <EcosystemShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
