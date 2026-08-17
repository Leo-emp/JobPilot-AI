/* ============================================================
   ORG SIDEBAR — Navigation for coach/admin org dashboard
   ============================================================
   Space-themed sidebar for org management. Lists orgs the user
   belongs to, with links to members, stats, invites, etc.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

/* # Org data from the API */
interface OrgMembership {
  id: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
}

/* # Navigation items for an org */
function getOrgNavItems(orgId: string) {
  return [
    { href: `/org/${orgId}`, label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: `/org/${orgId}/members`, label: "Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: `/org/${orgId}/stats`, label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { href: `/org/${orgId}/invites`, label: "Invites", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: `/org/${orgId}/export`, label: "Export", icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];
}

export default function OrgSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [orgs, setOrgs] = useState<OrgMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* # Fetch user's org memberships */
  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        setOrgs(data.memberships || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* # Extract orgId from current path */
  const currentOrgId = pathname.match(/\/org\/([^/]+)/)?.[1] || orgs[0]?.organization.id;

  const navItems = currentOrgId ? getOrgNavItems(currentOrgId) : [];

  const sidebarContent = (
    <>
      {/* # Brand header */}
      <div className="p-6 border-b border-card-border">
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          JobPilot
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Org</span>
        </Link>
      </div>

      {/* # Org selector if multiple orgs */}
      {orgs.length > 1 && (
        <div className="px-4 pt-4">
          <select
            className="w-full bg-space-700 border border-card-border rounded-lg px-3 py-2 text-sm text-white"
            value={currentOrgId || ""}
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = `/org/${e.target.value}`;
              }
            }}
          >
            {orgs.map((m) => (
              <option key={m.organization.id} value={m.organization.id}>
                {m.organization.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* # Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-space-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : navItems.length === 0 ? (
          <div className="text-gray-400 text-sm px-3 py-2">
            No organizations yet.
          </div>
        ) : (
          navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-300 hover:bg-space-700 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })
        )}

        {/* # Divider + back to dashboard */}
        <div className="border-t border-card-border my-4" />
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-space-700 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Dashboard
        </Link>
      </nav>

      {/* # User footer */}
      <div className="p-4 border-t border-card-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 truncate">{userName}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* # Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-space-800 border border-card-border rounded-lg text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* # Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* # Sidebar — desktop always visible, mobile slide-out */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-card-border flex flex-col z-40 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
