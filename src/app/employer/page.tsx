/* ============================================================
   EMPLOYER HOME — List or redirect to employer accounts
   ============================================================
   If one employer, redirect. If multiple, show picker.
   If none, show onboarding to create one.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmployerMembership {
  id: string;
  role: string;
  employer: {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    plan: string;
    verifiedAt: string | null;
  };
}

export default function EmployerHomePage() {
  const router = useRouter();
  const [employers, setEmployers] = useState<EmployerMembership[]>([]);
  const [loading, setLoading] = useState(true);

  /* # Create employer form */
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/employer")
      .then((r) => r.json())
      .then((data) => {
        const list = data.employers || [];
        setEmployers(list);
        setLoading(false);
        if (list.length === 1) {
          router.replace(`/employer/${list[0].employer.id}`);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  /* # Auto-generate slug from name */
  function handleNameChange(val: string) {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 100)
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    const res = await fetch("/api/employer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    const data = await res.json();

    if (res.ok) {
      router.push(`/employer/${data.employer.id}`);
    } else {
      setError(data.error || "Failed to create employer account.");
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-64 bg-space-700 rounded-xl mb-3" />
        <div className="h-5 w-96 bg-space-700 rounded-lg mb-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Employer Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your company and job postings.</p>
        </div>
        {employers.length > 0 && !showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-colors"
          >
            New Company
          </button>
        )}
      </div>

      {/* # Create form */}
      {(showCreate || employers.length === 0) && (
        <form onSubmit={handleCreate} className="p-6 bg-space-800 border border-card-border rounded-xl mb-8 max-w-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Create Employer Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="acme-corp"
              />
              <p className="text-xs text-gray-500 mt-1">jobpilotai.co/companies/{slug || "..."}</p>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
            >
              {creating ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      )}

      {/* # Existing employer accounts */}
      {employers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {employers.map((m) => (
            <Link
              key={m.employer.id}
              href={`/employer/${m.employer.id}`}
              className="p-6 bg-space-800 border border-card-border rounded-2xl hover:border-purple-500/50 transition-all group"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                {m.employer.name}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                {m.employer.industry && (
                  <span className="text-xs bg-space-700 text-gray-400 px-2 py-0.5 rounded-full">
                    {m.employer.industry}
                  </span>
                )}
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full capitalize">
                  {m.role}
                </span>
                {m.employer.verifiedAt && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
