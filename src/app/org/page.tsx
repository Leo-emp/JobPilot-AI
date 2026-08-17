/* ============================================================
   ORG HOME — Lists user's organizations or redirects
   ============================================================
   If the user belongs to one org, redirects there.
   If multiple, shows a picker. If none, shows create prompt.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function OrgHomePage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<OrgMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        const memberships = data.memberships || [];
        setOrgs(memberships);
        setLoading(false);

        /* # Auto-redirect if exactly one org */
        if (memberships.length === 1) {
          router.replace(`/org/${memberships[0].organization.id}`);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
        <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
      </div>
    );
  }

  /* # No orgs — show empty state */
  if (orgs.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-xl font-semibold text-white mb-2">No Organizations</h2>
        <p className="text-gray-400 mb-6">
          You are not a member of any organization yet. Ask your admin for an invite link.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  /* # Multiple orgs — show picker */
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Your Organizations</h1>
      <p className="text-gray-400 mb-8">Select an organization to manage.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {orgs.map((m) => (
          <Link
            key={m.organization.id}
            href={`/org/${m.organization.id}`}
            className="p-6 bg-space-800 border border-card-border rounded-2xl hover:border-indigo-500/50 transition-all group"
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {m.organization.name}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full capitalize">
                {m.organization.type}
              </span>
              <span className="text-xs bg-space-700 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                {m.role}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
