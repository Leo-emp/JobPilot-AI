/* ============================================================
   DASHBOARD SIDEBAR - App Navigation
   ============================================================
   Space-themed sidebar navigation for the main app.
   Shows the brand logo, navigation links, user info, and logout.
   Responsive: full sidebar on desktop, slide-out drawer on mobile.
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import RocketIcon from "./RocketIcon";

/* ---- Navigation Items ---- */
/* Each item maps to a dashboard sub-page */
const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/resume", icon: "📄", label: "Resume Intelligence" },
  { href: "/dashboard/templates", icon: "📋", label: "Resume Templates" },
  { href: "/dashboard/jobs", icon: "🔍", label: "Job Search & Match" },
  { href: "/dashboard/cover-letter", icon: "✉️", label: "Cover Letter" },
  { href: "/dashboard/tracker", icon: "📊", label: "Application Tracker" },
  { href: "/dashboard/interview", icon: "🎤", label: "Interview Prep" },
  { href: "/dashboard/linkedin", icon: "💼", label: "LinkedIn Optimizer" },
  { href: "/dashboard/network", icon: "✉️", label: "AI Outreach Hub" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

interface DashboardSidebarProps {
  userName: string; // Logged-in user's display name
}

export default function DashboardSidebar({ userName }: DashboardSidebarProps) {
  /* Track mobile drawer open/close state */
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Get current path to highlight the active nav item */
  const pathname = usePathname();

  /* Check if a nav item is currently active */
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  /* The sidebar content — shared between desktop and mobile */
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ---- Brand Logo ---- */}
      <div className="p-6 border-b border-card-border">
        <Link href="/dashboard" className="flex items-center gap-1">
          <RocketIcon size={28} />
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight glow-text">
            JobPilot AI
          </span>
        </Link>
      </div>

      {/* ---- Navigation Links ---- */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(item.href)
                ? /* Active state: highlighted with brand color */
                  "bg-brand-indigo/15 text-white border border-brand-indigo/20"
                : /* Inactive state: muted text, highlight on hover */
                  "text-text-secondary hover:text-white hover:bg-space-600"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ---- User Info + Logout ---- */}
      <div className="p-4 border-t border-card-border">
        {/* User avatar and name */}
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center text-xs font-bold text-white">
            {/* Show first letter of name as avatar */}
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-sm text-text-secondary truncate">
            {userName}
          </span>
        </div>
        {/* Logout button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ---- Desktop Sidebar ---- */}
      {/* Fixed on the left side, always visible on large screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-card-border flex-col z-40">
        {sidebarContent}
      </aside>

      {/* ---- Mobile Header Bar ---- */}
      {/* Replaces the sidebar on small screens with a top bar + hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 nav-blur px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-1">
          <RocketIcon size={24} />
          <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-tight glow-text">
            JobPilot AI
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ---- Mobile Drawer Overlay ---- */}
      {/* Dark backdrop that appears when mobile menu is open */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ---- Mobile Drawer ---- */}
      {/* Slides in from the left on mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-space-800 border-r border-card-border z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
