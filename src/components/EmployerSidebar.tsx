/* ============================================================
   EMPLOYER SIDEBAR — Navigation for employer dashboard
   ============================================================
   Space-themed sidebar for employers. Lists employer accounts
   the user belongs to, with links to roles, team, settings.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface EmployerMembership {
  id: string;
  role: string;
  employer: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

function getNavItems(empId: string) {
  return [
    { href: `/employer/${empId}`, label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: `/employer/${empId}/roles`, label: "Job Roles", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3.41 7.41L2 9v9a2 2 0 002 2h16a2 2 0 002-2V9l-1.41-1.59A2 2 0 0019.17 7H4.83a2 2 0 00-1.42.59z" },
    { href: `/employer/${empId}/pipeline`, label: "Pipeline", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { href: `/employer/${empId}/messages`, label: "Messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: `/employer/${empId}/team`, label: "Team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: `/employer/${empId}/billing`, label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { href: `/employer/${empId}/settings`, label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];
}

export default function EmployerSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [employers, setEmployers] = useState<EmployerMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/employer")
      .then((r) => r.json())
      .then((data) => {
        setEmployers(data.employers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentEmpId = pathname.match(/\/employer\/([^/]+)/)?.[1] || employers[0]?.employer.id;
  const navItems = currentEmpId ? getNavItems(currentEmpId) : [];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-card-border">
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          JobPilot
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Employer</span>
        </Link>
      </div>

      {employers.length > 1 && (
        <div className="px-4 pt-4">
          <select
            className="w-full bg-space-700 border border-card-border rounded-lg px-3 py-2 text-sm text-white"
            value={currentEmpId || ""}
            onChange={(e) => {
              if (e.target.value) window.location.href = `/employer/${e.target.value}`;
            }}
          >
            {employers.map((m) => (
              <option key={m.employer.id} value={m.employer.id}>{m.employer.name}</option>
            ))}
          </select>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-space-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : navItems.length === 0 ? (
          <div className="text-gray-400 text-sm px-3 py-2">No employer accounts.</div>
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
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
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
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-space-800 border border-card-border rounded-lg text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-card-border flex flex-col z-40 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
