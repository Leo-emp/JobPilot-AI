/* ============================================================
   EMPLOYER SETTINGS — Edit company profile (admin+ only)
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface EmployerProfile {
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
  plan: string;
}

export default function EmployerSettingsPage() {
  const params = useParams();
  const empId = params.empId as string;
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* # Form fields */
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [remoteFriendly, setRemoteFriendly] = useState(false);

  useEffect(() => {
    fetch(`/api/employer/${empId}`)
      .then((r) => r.json())
      .then((data) => {
        const emp = data.employer;
        if (emp) {
          setEmployer(emp);
          setName(emp.name || "");
          setIndustry(emp.industry || "");
          setSize(emp.size || "");
          setWebsite(emp.website || "");
          setDescription(emp.description || "");
          setLocation(emp.location || "");
          setRemoteFriendly(emp.remoteFriendly || false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [empId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch(`/api/employer/${empId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        industry: industry || undefined,
        size: size || undefined,
        website: website || undefined,
        description: description || undefined,
        location: location || undefined,
        remoteFriendly,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setEmployer(data.employer);
      setMessage({ type: "success", text: "Settings saved." });
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to save." });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-9 w-48 bg-space-700 rounded-xl mb-6" />
        <div className="h-96 bg-space-700 rounded-xl" />
      </div>
    );
  }

  if (!employer) {
    return <p className="text-gray-400 py-10 text-center">Employer not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Company Settings</h1>
      <p className="text-gray-400 mb-8">Update your company profile and information.</p>

      <form onSubmit={handleSave} className="p-6 bg-space-800 border border-card-border rounded-xl max-w-2xl space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Technology"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Company Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-space-700 border border-card-border rounded-lg px-3 py-2.5 text-white"
            >
              <option value="">Select...</option>
              <option value="startup">Startup (1-10)</option>
              <option value="small">Small (11-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="large">Large (201-1000)</option>
              <option value="enterprise">Enterprise (1000+)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Tell candidates about your company..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-space-700 border border-card-border rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteFriendly}
                onChange={(e) => setRemoteFriendly(e.target.checked)}
                className="w-4 h-4 rounded bg-space-700 border-card-border text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Remote-friendly</span>
            </label>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
