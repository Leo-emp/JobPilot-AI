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

/* ---- SVG Icons for Navigation ---- */
/* Clean line icons that match the premium space theme */
const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  resume: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  templates: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  jobs: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  coverLetter: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  tracker: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  interview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4a2 2 0 00-2 2v9m6-11v11a2 2 0 01-2 2h-2a2 2 0 01-2-2M8 7H4a2 2 0 00-2 2v9a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2zm0 0V5a2 2 0 012-2h0a2 2 0 012 2v2M8 7h4" />
    </svg>
  ),
  network: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  history: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  admin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  signOut: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

/* ---- Navigation Items ---- */
/* Each item maps to a dashboard sub-page */
const navItems = [
  { href: "/dashboard", icon: icons.dashboard, label: "Dashboard" },
  { href: "/dashboard/resume", icon: icons.resume, label: "Resume Intelligence" },
  { href: "/dashboard/templates", icon: icons.templates, label: "Resume Templates" },
  { href: "/dashboard/jobs", icon: icons.jobs, label: "Job Search & Match" },
  { href: "/dashboard/cover-letter", icon: icons.coverLetter, label: "Cover Letter" },
  { href: "/dashboard/tracker", icon: icons.tracker, label: "Application Tracker" },
  { href: "/dashboard/interview", icon: icons.interview, label: "Interview Prep" },
  { href: "/dashboard/linkedin", icon: icons.linkedin, label: "LinkedIn Optimizer" },
  { href: "/dashboard/network", icon: icons.network, label: "AI Outreach Hub" },
  { href: "/dashboard/history", icon: icons.history, label: "AI History" },
  { href: "/dashboard/settings", icon: icons.settings, label: "Settings" },
];

interface DashboardSidebarProps {
  userName: string;
  isAdmin?: boolean;
}

export default function DashboardSidebar({ userName, isAdmin }: DashboardSidebarProps) {
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
          <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight text-text-primary">
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
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(item.href)
                ? "bg-brand-indigo/15 text-white border border-brand-indigo/20 [&>span:first-child]:text-brand-light"
                : "text-text-secondary hover:text-white hover:bg-space-600"
            }`}
          >
            <span className="shrink-0 text-text-muted group-hover:text-brand-light transition-colors">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* ---- Admin link (only visible to admin users) ---- */}
        {isAdmin && (
          <>
            <div className="my-2 border-t border-card-border/50" />
            <Link
              href="/dashboard/admin"
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/dashboard/admin")
                  ? "bg-red-500/15 text-red-400 border border-red-500/20"
                  : "text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
              }`}
            >
              <span className="shrink-0">{icons.admin}</span>
              Admin Dashboard
            </Link>
          </>
        )}
      </nav>

      {/* ---- User Info + Logout ---- */}
      <div className="p-4 border-t border-card-border">
        {/* User avatar and name */}
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
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
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <span className="shrink-0 group-hover:text-red-400 transition-colors">{icons.signOut}</span>
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
          <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-tight text-text-primary">
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
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-[85vw] max-w-72 bg-space-800 border-r border-card-border z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
