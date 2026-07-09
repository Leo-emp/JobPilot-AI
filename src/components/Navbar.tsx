/* ============================================================
   NAVBAR - Top Navigation Bar
   ============================================================
   Sticky frosted-glass navigation bar at the top of the page.
   Contains the brand logo/text, navigation links, and CTA buttons.
   Responsive: hamburger menu on mobile, full links on desktop.
   ============================================================ */

"use client"; // Client component because we track mobile menu state

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


export default function Navbar() {
  /* Track whether the mobile hamburger menu is open */
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    /* Sticky so it stays at the top while scrolling */
    /* nav-blur class adds the frosted glass effect from globals.css */
    <nav className="sticky top-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ---- Brand Logo + Name ---- */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* JP monogram logo — SVG for crisp rendering at any zoom */}
            <Image
              src="/jp-logo.svg"
              alt="JobPilot AI"
              width={36}
              height={36}
              className=""
              priority
            />
            <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight glow-text-strong">
              JobPilot AI
            </span>
          </Link>

          {/* ---- Desktop Navigation Links ---- */}
          {/* Hidden on mobile (hidden), visible on medium screens (md:flex) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          {/* ---- Desktop CTA Buttons ---- */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-sm !py-2 !px-5">
              Get Started Free
            </Link>
          </div>

          {/* ---- Mobile Hamburger Button ---- */}
          {/* Only visible on mobile (md:hidden) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-secondary hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {/* Three-line hamburger icon (or X when open) */}
            {mobileOpen ? (
              /* X icon when menu is open */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon when menu is closed */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ---- Mobile Menu Dropdown ---- */}
        {/* Only renders when mobileOpen is true */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.06] mt-2 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/#features"
                className="text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#testimonials"
                className="text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#pricing"
                className="text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link href="/signup" className="btn-primary text-sm text-center">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
