/* ============================================================
   FOOTER - Site Footer
   ============================================================
   Contains brand info, navigation links, and legal links.
   Responsive: stacked on mobile, multi-column on desktop.
   ============================================================ */

import Link from "next/link";
import RocketIcon from "./RocketIcon";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* ---- Footer Grid ---- */}
        {/* 1 column on mobile, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              {/* Custom rocket icon matching brand colors */}
              <RocketIcon size={24} />
              {/* Space Grotesk font for brand consistency */}
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-tight glow-text">
                JobPilot AI
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI-powered career tools that help you land your dream job faster.
            </p>
          </div>

          {/* Column 2: Product links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-text-secondary hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-text-secondary hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Bottom Bar ---- */}
        <div className="mt-12 pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; 2026 JobPilot AI. All rights reserved.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-6">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-white transition-colors">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com/Leo-emp" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
