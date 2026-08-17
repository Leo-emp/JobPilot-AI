/* ============================================================
   ROLE DETAIL CLIENT — Full role view + interest signal
   ============================================================
   Client component showing complete role details. If the user
   is logged in, shows an "I'm Interested" button that could
   signal interest to the employer.

   Fetches from /api/roles/[roleId] (public, rate-limited).
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* # Role data shape from the API */
interface RoleDetail {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  skills: string | null;
  niceToHaveSkills: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  locationType: string;
  location: string | null;
  employmentType: string;
  industry: string | null;
  education: string | null;
  urgency: string;
  candidatesNeeded: number;
  publishedAt: string | null;
  employer: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
    size: string | null;
    website: string | null;
    description: string | null;
    location: string | null;
    remoteFriendly: boolean;
    verifiedAt: string | null;
  };
}

export default function RoleDetailClient() {
  const params = useParams();
  const roleId = params.roleId as string;

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* # Fetch role on mount */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/roles/${roleId}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setRole(data.role);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [roleId]);

  /* # Format salary range for display */
  function formatSalary(min: number | null, max: number | null, currency: string) {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  }

  /* # Safely parse JSON skills array */
  function parseSkills(skills: string | null): string[] {
    if (!skills) return [];
    try { return JSON.parse(skills); } catch { return []; }
  }

  /* # Format experience range */
  function formatExperience(min: number | null, max: number | null) {
    if (!min && !max) return null;
    if (min && max) return `${min}-${max} years`;
    if (min) return `${min}+ years`;
    return `Up to ${max} years`;
  }

  /* # Loading skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-space-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-8 w-48 bg-card rounded-lg animate-pulse mb-6" />
          <div className="h-64 bg-card rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  /* # Not found state */
  if (notFound || !role) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Role Not Found</h1>
          <p className="text-muted mb-6">This role may have been filled or removed.</p>
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

  const salary = formatSalary(role.salaryMin, role.salaryMax, role.salaryCurrency);
  const requiredSkills = parseSkills(role.skills);
  const niceToHaveSkills = parseSkills(role.niceToHaveSkills);
  const experience = formatExperience(role.experienceMin, role.experienceMax);

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

        {/* # Main content */}
        <div className="bg-card border border-card-border rounded-2xl p-8">
          {/* # Header section */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{role.title}</h1>
              <Link
                href={`/companies-public/${role.employer.slug}`}
                className="text-lg text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {role.employer.name}
              </Link>
              {role.employer.verifiedAt && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* # Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {/* # Location type */}
            <div className="p-3 rounded-xl bg-space-800/50 border border-card-border/50">
              <p className="text-xs text-muted mb-1">Location</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {role.locationType}
                {role.location && ` - ${role.location}`}
              </p>
            </div>

            {/* # Employment type */}
            <div className="p-3 rounded-xl bg-space-800/50 border border-card-border/50">
              <p className="text-xs text-muted mb-1">Type</p>
              <p className="text-sm font-medium text-foreground capitalize">{role.employmentType}</p>
            </div>

            {/* # Salary */}
            {salary && (
              <div className="p-3 rounded-xl bg-space-800/50 border border-card-border/50">
                <p className="text-xs text-muted mb-1">Salary</p>
                <p className="text-sm font-medium text-green-400">{salary}/yr</p>
              </div>
            )}

            {/* # Experience */}
            {experience && (
              <div className="p-3 rounded-xl bg-space-800/50 border border-card-border/50">
                <p className="text-xs text-muted mb-1">Experience</p>
                <p className="text-sm font-medium text-foreground">{experience}</p>
              </div>
            )}
          </div>

          {/* # Tags row */}
          <div className="flex flex-wrap gap-2 mb-8">
            {role.urgency === "urgent" && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">
                Urgent Hire
              </span>
            )}
            {role.industry && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {role.industry}
              </span>
            )}
            {role.education && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {role.education}
              </span>
            )}
          </div>

          {/* # Description */}
          {role.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">About This Role</h2>
              <div className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                {role.description}
              </div>
            </div>
          )}

          {/* # Requirements */}
          {role.requirements && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Requirements</h2>
              <div className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                {role.requirements}
              </div>
            </div>
          )}

          {/* # Required skills */}
          {requiredSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* # Nice-to-have skills */}
          {niceToHaveSkills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Nice to Have</h2>
              <div className="flex flex-wrap gap-2">
                {niceToHaveSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-lg bg-card-border/50 text-muted border border-card-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* # Divider */}
          <hr className="border-card-border my-8" />

          {/* # Employer info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">About {role.employer.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {role.employer.industry && (
                <div>
                  <p className="text-xs text-muted">Industry</p>
                  <p className="text-sm text-foreground">{role.employer.industry}</p>
                </div>
              )}
              {role.employer.size && (
                <div>
                  <p className="text-xs text-muted">Company Size</p>
                  <p className="text-sm text-foreground">{role.employer.size}</p>
                </div>
              )}
              {role.employer.location && (
                <div>
                  <p className="text-xs text-muted">HQ</p>
                  <p className="text-sm text-foreground">{role.employer.location}</p>
                </div>
              )}
            </div>
            {role.employer.description && (
              <p className="text-sm text-muted leading-relaxed">{role.employer.description}</p>
            )}
            <Link
              href={`/companies-public/${role.employer.slug}`}
              className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View company profile
            </Link>
          </div>

          {/* # CTA section */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Interested in this role?</h3>
            <p className="text-sm text-muted mb-4">
              Sign up for JobPilot AI to get matched with roles like this one.
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
    </div>
  );
}
