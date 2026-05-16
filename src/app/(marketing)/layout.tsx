/* ============================================================
   MARKETING LAYOUT - Shared Layout for Public Pages
   ============================================================
   Wraps privacy, terms, contact, etc. with the star field,
   navbar, and footer for consistent branding.
   ============================================================ */

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StarField />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
