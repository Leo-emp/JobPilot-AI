/* ============================================================
   CANDIDATE PREFERENCES — Job search preferences for matching
   ============================================================
   Lets candidates set their openToWork status, desired title,
   skills, location preferences, salary expectations, and more.
   These feed into the AI matching engine so employers can
   discover relevant candidates.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import skillsTaxonomy from "@/lib/skills-taxonomy.json";
import { trackEvent } from "@/lib/track-event";
import industryTaxonomy from "@/lib/industry-taxonomy.json";

interface Preferences {
  openToWork: boolean;
  desiredTitle: string | null;
  desiredSkills: string | null;
  locationPref: string;
  locations: string | null;
  salaryMin: number | null;
  salaryCurrency: string;
  employmentType: string;
  industries: string | null;
  companySizes: string | null;
}

/* # Flatten all skills from taxonomy into one list */
const ALL_SKILLS = Object.values(skillsTaxonomy).flat();
const ALL_INDUSTRIES = industryTaxonomy.industries;
const CURRENCIES = ["USD", "GBP", "EUR", "THB", "AUD", "SGD", "CAD"];

export default function PreferencesPage() {
  const { data: session } = useSession();
  const [prefs, setPrefs] = useState<Preferences>({
    openToWork: false,
    desiredTitle: null,
    desiredSkills: null,
    locationPref: "remote",
    locations: null,
    salaryMin: null,
    salaryCurrency: "USD",
    employmentType: "full-time",
    industries: null,
    companySizes: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* # For multi-select fields stored as JSON */
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");

  /* # Fetch current preferences */
  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        const p = data.preferences;
        setPrefs(p);
        /* # Parse JSON arrays */
        try { setSelectedSkills(JSON.parse(p.desiredSkills || "[]")); } catch { setSelectedSkills([]); }
        try { setSelectedIndustries(JSON.parse(p.industries || "[]")); } catch { setSelectedIndustries([]); }
        try { setSelectedLocations(JSON.parse(p.locations || "[]")); } catch { setSelectedLocations([]); }
        setLoading(false);
      })
      .catch(() => { trackEvent("preferences.load_failed"); setLoading(false); });
  }, []);

  /* # Save preferences */
  async function handleSave() {
    setSaving(true);
    setMessage("");

    const body = {
      openToWork: prefs.openToWork,
      desiredTitle: prefs.desiredTitle || null,
      desiredSkills: selectedSkills.length > 0 ? JSON.stringify(selectedSkills) : null,
      locationPref: prefs.locationPref,
      locations: selectedLocations.length > 0 ? JSON.stringify(selectedLocations) : null,
      salaryMin: prefs.salaryMin,
      salaryCurrency: prefs.salaryCurrency,
      employmentType: prefs.employmentType,
      industries: selectedIndustries.length > 0 ? JSON.stringify(selectedIndustries) : null,
      companySizes: prefs.companySizes,
    };

    const res = await fetch("/api/user/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Preferences saved successfully.");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to save preferences.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 4000);
  }

  /* # Toggle a skill in the selection */
  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  }

  /* # Toggle an industry */
  function toggleIndustry(industry: string) {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  }

  /* # Add location */
  function addLocation() {
    const loc = locationInput.trim();
    if (loc && !selectedLocations.includes(loc)) {
      setSelectedLocations((prev) => [...prev, loc]);
      setLocationInput("");
    }
  }

  /* # Filtered skills for search */
  const filteredSkills = skillSearch
    ? ALL_SKILLS.filter((s) =>
        s.toLowerCase().includes(skillSearch.toLowerCase())
      ).slice(0, 20)
    : [];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-9 w-64 bg-space-700 rounded-xl" />
        <div className="h-48 bg-space-700 rounded-xl" />
        <div className="h-48 bg-space-700 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-2">Job Preferences</h1>
      <p className="text-gray-400 mb-8">
        Set your preferences to get matched with relevant opportunities. Employers see anonymized profiles — your name and email stay private until you consent.
      </p>

      {/* # Open to Work toggle */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Open to Work</h2>
            <p className="text-sm text-gray-400 mt-1">
              When enabled, your profile (anonymized) is visible to employers for matching
            </p>
          </div>
          <button
            onClick={() => setPrefs((p) => ({ ...p, openToWork: !p.openToWork }))}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              prefs.openToWork ? "bg-emerald-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                prefs.openToWork ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* # Desired title */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Desired Role</h2>
        <label className="block text-sm text-gray-400 mb-2">Job title you're looking for</label>
        <input
          type="text"
          value={prefs.desiredTitle || ""}
          onChange={(e) => setPrefs((p) => ({ ...p, desiredTitle: e.target.value }))}
          placeholder="e.g. Frontend Developer, Product Manager"
          className="w-full bg-space-900 border border-card-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>

      {/* # Skills */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Skills</h2>
        <p className="text-sm text-gray-400 mb-4">Select skills that match your expertise</p>

        {/* # Selected skills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-500/30 transition-colors flex items-center gap-1"
              >
                {skill}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* # Skill search */}
        <input
          type="text"
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full bg-space-900 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
        />
        {filteredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filteredSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => { toggleSkill(skill); setSkillSearch(""); }}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-space-700 text-gray-300 hover:text-white hover:bg-space-600"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* # Location preferences */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Location</h2>

        <label className="block text-sm text-gray-400 mb-2">Work arrangement</label>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(["remote", "hybrid", "onsite", "any"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setPrefs((p) => ({ ...p, locationPref: opt }))}
              className={`px-3 py-2 text-sm rounded-lg capitalize transition-colors ${
                prefs.locationPref === opt
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-space-700 text-gray-400 hover:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* # Specific locations (for hybrid/onsite) */}
        {(prefs.locationPref === "hybrid" || prefs.locationPref === "onsite") && (
          <>
            <label className="block text-sm text-gray-400 mb-2">Preferred locations</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
                placeholder="e.g. London, New York"
                className="flex-1 bg-space-900 border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
              <button
                onClick={addLocation}
                className="px-4 py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 transition-colors"
              >
                Add
              </button>
            </div>
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="text-sm bg-space-700 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {loc}
                    <button onClick={() => setSelectedLocations((prev) => prev.filter((l) => l !== loc))}>
                      <svg className="w-3 h-3 text-gray-500 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* # Salary expectations */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Salary Expectations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Minimum salary (annual)</label>
            <input
              type="number"
              value={prefs.salaryMin ?? ""}
              onChange={(e) => setPrefs((p) => ({ ...p, salaryMin: e.target.value ? parseInt(e.target.value) : null }))}
              placeholder="e.g. 80000"
              className="w-full bg-space-900 border border-card-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Currency</label>
            <select
              value={prefs.salaryCurrency}
              onChange={(e) => setPrefs((p) => ({ ...p, salaryCurrency: e.target.value }))}
              className="w-full bg-space-900 border border-card-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* # Employment type */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Employment Type</h2>
        <div className="grid grid-cols-4 gap-2">
          {(["full-time", "part-time", "contract", "any"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setPrefs((p) => ({ ...p, employmentType: opt }))}
              className={`px-3 py-2 text-sm rounded-lg capitalize transition-colors ${
                prefs.employmentType === opt
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-space-700 text-gray-400 hover:text-white"
              }`}
            >
              {opt.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* # Industries */}
      <div className="p-6 bg-space-800 border border-card-border rounded-xl mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Preferred Industries</h2>
        <p className="text-sm text-gray-400 mb-4">Select industries you'd like to work in</p>
        <div className="flex flex-wrap gap-2">
          {ALL_INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                selectedIndustries.includes(industry)
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-space-700 text-gray-400 hover:text-white"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* # Save button + message */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
        {message && (
          <span className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
