/* ============================================================
   COMPANY PROFILE CLIENT — Public employer page
   ============================================================
   Shows employer details, active roles, and a link to browse
   their listings. Fetches from /api/companies-public/[slug].
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* # Employer data shape from the API */
interface Employer {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  size: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  remoteFriendly: boolean;
  logoUrl: string | null;
  verifiedAt: string | null;
  createdAt: string;
  roles: RoleSummary[];
}

/* # Minimal role data for listing */
interface RoleSummary {
  id: string;
  title: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  industry: string | null;
  urgency: string;
  publishedAt: string | null;
}

export default function CompanyProfileClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* # Fetch employer profile on mount */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/companies-public/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setEmployer(data.employer);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  /* # Format salary range */
  function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  }

  /* # Loading skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-space-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-8 w-48 bg-card rounded-lg animate-pulse mb-6" />
          <div className="h-48 bg-card rounded-xl animate-pulse mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* # Not found state */
  if (notFound || !employer) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Company Not Found</h1>
          <p className="text-muted mb-6">This company profile may not be available.</p>
          <Link
            href="/roles"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Browse All Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* # Back nav */}
        <Link
          href="/roles"
          className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Board
        </Link>

        {/* # Company header card */}
        <div className="bg-card border border-card-border rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* # Logo placeholder */}
            {employer.logoUrl ? (
              <img
                src={employer.logoUrl}
                alt={`${employer.name} logo`}
                className="w-16 h-16 rounded-xl object-cover border border-card-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
                {employer.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{employer.name}</h1>
                {employer.verifiedAt && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Verified
                  </span>
                )}
              </div>

              {/* # Details grid */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted mt-3">
                {employer.industry && (
                  <span>{employer.industry}</span>
                )}
                {employer.size && (
                  <span>{employer.size} employees</span>
                )}
                {employer.location && (
                  <span>{employer.location}</span>
                )}
                {employer.remoteFriendly && (
                  <span className="text-indigo-400">Remote Friendly</span>
                )}
              </div>
            </div>
          </div>

          {/* # Description */}
          {employer.description && (
            <div className="mt-6 pt-6 border-t border-card-border">
              <p className="text-sm text-muted leading-relaxed">{employer.description}</p>
            </div>
          )}

          {/* # Website link */}
          {employer.website && (
            <div className="mt-4">
              <a
                href={employer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {employer.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* # Active roles section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Open Roles ({employer.roles.length})
          </h2>

          {employer.roles.length === 0 ? (
            <div className="text-center py-12 bg-card border border-card-border rounded-2xl">
              <p className="text-muted">No open roles at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {employer.roles.map((role) => (
                <Link
                  key={role.id}
                  href={`/roles/${role.id}`}
                  className="block p-5 rounded-xl bg-card border border-card-border hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-indigo-300 transition-colors">
                        {role.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300">
                          {role.locationType}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300">
                          {role.employmentType}
                        </span>
                        {role.urgency === "urgent" && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-300">
                            Urgent
                          </span>
                        )}
                        {role.location && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-card-border/50 text-muted">
                            {role.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* # Salary */}
                    {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency) && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-green-400">
                          {formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency)}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* # CTA for candidates */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Want to work at {employer.name}?
          </h3>
          <p className="text-sm text-muted mb-4">
            Create a free JobPilot AI profile to get matched with their open roles.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
