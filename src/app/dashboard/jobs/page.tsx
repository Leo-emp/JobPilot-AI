/* ============================================================
   JOB SEARCH & MATCH PAGE
   ============================================================
   Two tabs:
   1. Search Jobs — search real job listings via Adzuna API
      with save-to-tracker and AI match scoring
   2. Manual Match — paste a job description to get AI analysis
   ============================================================ */

"use client";

import { useState, useEffect, useRef } from "react";
import MarkdownResult from "@/components/MarkdownResult";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { AUSTRALIAN_CITIES, isRegionalCity } from "@/lib/australian-sponsors";

/* ---- Type for job search results ---- */
interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string;
  category: string;
  contractTime: string;
  postedDate: string;
  sponsorship?: "available" | "unavailable";
}

export default function JobsPage() {
  /* ---- Tab state ---- */
  const [activeTab, setActiveTab] = useState<"search" | "match">("search");

  /* ---- Search tab state ---- */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCountry, setSearchCountry] = useState("gb");
  const [searchResults, setSearchResults] = useState<JobResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchSource, setSearchSource] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [sponsorshipFilter, setSponsorshipFilter] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  /* ---- Expanded job description tracking ---- */
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  /* ---- Save job state ---- */
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  /* ---- Match tab state ---- */
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [savedResumes, setSavedResumes] = useState<{ id: string; fileName: string; content: string }[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

  /* ---- Fetch saved resumes on mount ---- */
  useEffect(() => {
    fetch("/api/resumes?limit=20&sort=createdAt&order=desc")
      .then(r => r.ok ? r.json().catch(() => ({ data: [] })) : { data: [] })
      .then(d => setSavedResumes(d?.data || []))
      .catch(() => {})
      .finally(() => setResumesLoading(false));
  }, []);

  /* ---- Handle resume file upload (PDF or TXT) ---- */
  const handleResumeUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setMatchError("File too large. Maximum 5MB.");
      return;
    }
    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      setResumeFileName(file.name);
      return;
    }
    if (file.name.endsWith(".pdf")) {
      setResumeUploading(true);
      setMatchError("");
      try {
        const text = await extractTextFromPdf(file);
        if (!text.trim()) throw new Error("Could not extract text from PDF");
        setResumeText(text.trim());
        setResumeFileName(file.name);
      } catch (e) {
        setMatchError(e instanceof Error ? e.message : "Failed to parse PDF.");
      } finally {
        setResumeUploading(false);
      }
      return;
    }
    setMatchError("Unsupported file type. Upload a PDF or TXT file.");
  };

  /* ============================================================
     SEARCH JOBS - Call the Adzuna-powered search API
     ============================================================ */
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchPage(page);
    setHasSearched(true);

    try {
      /* Build search URL with query params */
      const params = new URLSearchParams({
        q: searchQuery,
        page: String(page),
        country: searchCountry,
      });
      if (searchLocation) params.set("location", searchLocation);
      if (sponsorshipFilter) params.set("sponsorship", "true");
      if (jobTypeFilter) params.set("jobType", jobTypeFilter);

      const res = await fetch(`/api/jobs/search?${params.toString()}`);
      const data = await res.json();

      if (data.error && !data.jobs) {
        setSearchError(data.error);
        return;
      }

      setSearchResults(data.jobs || []);
      setSearchTotal(data.total || 0);
      setSearchSource(data.source || "");
    } catch {
      setSearchError("Failed to search jobs. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  /* ============================================================
     SAVE JOB - Save a job from search results to tracker
     ============================================================ */
  const handleSaveJob = async (job: JobResult) => {
    setSavingJobId(job.id);

    try {
      const res = await fetch("/api/extension/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          description: job.description,
        }),
      });

      if (res.ok) {
        /* Mark this job as saved */
        setSavedJobs((prev) => new Set(prev).add(job.id));
      }
    } catch {
      /* Silently fail — user can retry */
    } finally {
      setSavingJobId(null);
    }
  };

  /* ============================================================
     MANUAL MATCH - Calculate match score from pasted text
     ============================================================ */
  const handleMatch = async () => {
    setMatchLoading(true);
    setMatchError("");
    setResult("");
    setMatchScore(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "match_score",
          payload: { resume: resumeText, jobDescription },
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMatchError(data?.error || "Match calculation failed.");
        return;
      }

      const scoreMatch = data?.result?.match(/(?:MATCH_SCORE|Match Score):\s*(\d+)/);
      if (scoreMatch) {
        setMatchScore(parseInt(scoreMatch[1]));
      }
      if (data?.result) setResult(data.result);
    } catch {
      setMatchError("Failed to connect to AI.");
    } finally {
      setMatchLoading(false);
    }
  };

  /* Get color based on match score */
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  /* Format posted date to relative time */
  const [now] = useState(() => Date.now());
  const formatDate = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Job Search & Match
      </h1>
      <p className="text-text-secondary mb-6">
        Search real job listings or paste a description for AI matching.
      </p>

      {/* ---- Tab Switcher ---- */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "search"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600"
          }`}
        >
          Search Jobs
        </button>
        <button
          onClick={() => setActiveTab("match")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "match"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600"
          }`}
        >
          Manual Match
        </button>
      </div>

      {/* ============================================================
           SEARCH TAB - Job Board Integration
           ============================================================ */}
      {activeTab === "search" && (
        <div>
          {/* ---- Search Form ---- */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
              {/* Job title / keywords */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Job Title or Keywords
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
                  placeholder="e.g. Business Consultant"
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                />
              </div>

              {/* Location */}
              <div className="sm:col-span-3 relative">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => { setSearchLocation(e.target.value); setShowLocationSuggestions(searchCountry === "au" && e.target.value.length > 0); }}
                  onFocus={() => setShowLocationSuggestions(searchCountry === "au" && searchLocation.length === 0)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(1); setShowLocationSuggestions(false); } }}
                  placeholder={searchCountry === "au" ? "e.g. Sydney, Melbourne" : "e.g. London, Remote"}
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                />
                {/* Australian city suggestions dropdown */}
                {showLocationSuggestions && searchCountry === "au" && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-space-700 border border-card-border rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {AUSTRALIAN_CITIES
                      .filter(c => !searchLocation || c.toLowerCase().includes(searchLocation.toLowerCase()))
                      .map(city => (
                        <button
                          key={city}
                          type="button"
                          onMouseDown={() => { setSearchLocation(city); setShowLocationSuggestions(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-space-600 transition-colors flex items-center justify-between"
                        >
                          <span className="text-white">{city}</span>
                          {isRegionalCity(city) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Regional
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Country selector */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Country
                </label>
                <select
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm appearance-none cursor-pointer"
                >
                  <option value="gb">United Kingdom</option>
                  <option value="us">United States</option>
                  <option value="au">Australia</option>
                  <option value="ca">Canada</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="in">India</option>
                  <option value="nz">New Zealand</option>
                  <option value="sg">Singapore</option>
                  <option value="nl">Netherlands</option>
                  <option value="it">Italy</option>
                  <option value="br">Brazil</option>
                  <option value="za">South Africa</option>
                  <option value="at">Austria</option>
                  <option value="ch">Switzerland</option>
                  <option value="pl">Poland</option>
                  <option value="mx">Mexico</option>
                </select>
              </div>

              {/* Search button */}
              <div className="sm:col-span-3 flex items-end">
                <button
                  onClick={() => handleSearch(1)}
                  disabled={!searchQuery.trim() || searchLoading}
                  className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? "Searching..." : "Search Jobs"}
                </button>
              </div>
            </div>

            {/* Job type filter + Visa sponsorship filter */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {/* Job Type dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Type</label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-space-700 border border-card-border text-white text-sm focus:outline-none focus:border-brand-indigo appearance-none cursor-pointer"
                >
                  <option value="">All Jobs</option>
                  <option value="internship">Internship</option>
                  <option value="graduate">Graduate</option>
                  <option value="entry level">Entry Level</option>
                  <option value="part time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Visa sponsorship filter — shown for AU, US, UK */}
            {["au", "us", "gb"].includes(searchCountry) && (
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-space-700/60 border border-card-border">
                <button
                  onClick={() => setSponsorshipFilter(!sponsorshipFilter)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    sponsorshipFilter ? "bg-brand-indigo" : "bg-space-600"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    sponsorshipFilter ? "translate-x-5" : ""
                  }`} />
                </button>
                <div>
                  <span className="text-sm text-white font-medium">Visa Sponsorship</span>
                  <p className="text-xs text-text-muted">Show jobs that mention visa sponsorship in the posting</p>
                </div>
              </div>
            )}

            {/* Source indicator */}
            {searchSource === "sample" && (
              <p className="text-xs text-amber-400/80">
                Showing sample jobs. Add your free Adzuna API keys in .env for real listings from Indeed, LinkedIn, Glassdoor &amp; more.
              </p>
            )}
          </div>

          {/* ---- Search Error ---- */}
          {searchError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              {searchError}
            </div>
          )}

          {/* ---- Search Results ---- */}
          {searchResults.length > 0 && (
            <div>
              {/* Results count */}
              <p className="text-sm text-text-muted mb-4">
                {searchTotal > 0 ? `${searchTotal.toLocaleString()} jobs found` : `${searchResults.length} results`}
              </p>

              {/* Job cards */}
              <div className="space-y-4 mb-6">
                {searchResults.map((job) => (
                  <div
                    key={job.id}
                    className="glass-card p-5 hover:border-brand-indigo/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    {/* Job header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white">{job.title}</h3>
                        <p className="text-text-secondary text-sm">{job.company}</p>
                      </div>

                      {/* Save button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveJob(job); }}
                        disabled={savingJobId === job.id || savedJobs.has(job.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          savedJobs.has(job.id)
                            ? "bg-green-500/15 text-green-400 border border-green-500/30"
                            : "bg-brand-indigo/15 text-brand-light border border-brand-indigo/30 hover:bg-brand-indigo/25"
                        } disabled:opacity-50`}
                      >
                        {savedJobs.has(job.id)
                          ? "Saved"
                          : savingJobId === job.id
                          ? "Saving..."
                          : "Save Job"}
                      </button>
                    </div>

                    {/* Job metadata chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Sponsorship badge — based on job description text */}
                      {job.sponsorship === "available" && (
                        <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold border border-green-500/25 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Sponsorship Available
                        </span>
                      )}
                      {job.sponsorship === "unavailable" && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400/80 text-xs font-medium border border-red-500/20">
                          No Sponsorship
                        </span>
                      )}
                      {job.location && (
                        <span className="px-3 py-1 rounded-full bg-space-600 text-text-secondary text-xs">
                          {job.location}
                        </span>
                      )}
                      {/* Regional visa benefits badge */}
                      {searchCountry === "au" && job.location && isRegionalCity(job.location.split(",")[0]) && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                          Regional Visa Benefits
                        </span>
                      )}
                      {job.salary && (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                          {job.salary}
                        </span>
                      )}
                      {job.contractTime && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">
                          {job.contractTime === "full_time" ? "Full Time" : job.contractTime === "contract" ? "Contract" : job.contractTime}
                        </span>
                      )}
                      {job.postedDate && (
                        <span className="px-3 py-1 rounded-full bg-space-600 text-text-muted text-xs">
                          {formatDate(job.postedDate)}
                        </span>
                      )}
                    </div>

                    {/* Job description — truncated with expand toggle */}
                    <div className={`text-sm text-text-secondary leading-relaxed ${
                      expandedJob === job.id ? "" : "line-clamp-3"
                    }`}>
                      {job.description}
                    </div>
                    <span className="inline-block text-xs text-brand-light hover:text-white mt-2 transition-colors font-medium">
                      {expandedJob === job.id ? "Show less" : "Show more"}
                    </span>

                    {/* Apply link — only if URL exists and job is expanded */}
                    {job.url && expandedJob === job.id && (
                      <div className="mt-3 pt-3 border-t border-card-border">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-brand-light hover:text-white transition-colors font-medium"
                        >
                          View & Apply &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ---- Pagination ---- */}
              {(() => {
                const totalPages = Math.ceil(searchTotal / 20);
                if (totalPages <= 1) return null;
                return (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleSearch(searchPage - 1)}
                      disabled={searchPage <= 1 || searchLoading}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-text-muted">
                      Page {searchPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handleSearch(searchPage + 1)}
                      disabled={searchPage >= totalPages || searchLoading}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ---- No Results ---- */}
          {hasSearched && !searchLoading && searchResults.length === 0 && !searchError && (
            <div className="glass-card p-12 text-center">
              <div className="flex justify-center mb-4"><svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></div>
              <p className="text-text-secondary">No jobs found. Try different keywords or location.</p>
            </div>
          )}

          {/* ---- Initial State ---- */}
          {!hasSearched && (
            <div className="glass-card p-12 text-center">
              <div className="flex justify-center mb-4"><svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg></div>
              <h3 className="font-bold text-lg mb-2">Search Job Boards</h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Search thousands of job listings from major job boards. Save interesting ones to your tracker and get AI match scores.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
           MATCH TAB - Manual paste for AI analysis
           ============================================================ */}
      {activeTab === "match" && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ---- Resume import ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Your Resume</h2>

              {/* Saved resumes selector */}
              {savedResumes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-text-muted mb-2">Select a saved resume</p>
                  <div className="flex flex-wrap gap-2">
                    {savedResumes.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setResumeText(r.content); setResumeFileName(r.fileName); }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                          resumeText === r.content
                            ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                            : "bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30"
                        }`}
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {r.fileName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {resumesLoading && <p className="text-xs text-text-muted mb-3">Loading saved resumes...</p>}

              {/* File upload */}
              <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }} />

              {!resumeText ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-brand-indigo/50"); }}
                  onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-indigo/50"); }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-indigo/50"); const f = e.dataTransfer.files[0]; if (f) handleResumeUpload(f); }}
                  className="w-full px-4 py-10 rounded-xl bg-space-700 border-2 border-dashed border-card-border text-center cursor-pointer hover:border-brand-indigo/40 transition-colors"
                >
                  {resumeUploading ? (
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Extracting text from resume...
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-2"><svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
                      <p className="text-white font-medium">Drop your resume here or click to upload</p>
                      <p className="text-sm text-text-muted mt-1">PDF or TXT — max 5MB</p>
                      {!resumesLoading && savedResumes.length === 0 && (
                        <p className="text-xs text-text-muted mt-3">Or <a href="/dashboard/resume" className="text-brand-light hover:underline">upload one in Resume Intelligence</a> first</p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full rounded-xl bg-space-700 border border-card-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-space-600/50 border-b border-card-border">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      <span className="text-sm text-white font-medium">{resumeFileName || "Resume loaded"}</span>
                      <span className="text-xs text-text-muted">({resumeText.length.toLocaleString()} chars)</span>
                    </div>
                    <button onClick={() => { setResumeText(""); setResumeFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors">Remove</button>
                  </div>
                  <div className="px-4 py-3 max-h-32 overflow-y-auto">
                    <p className="text-xs text-text-muted whitespace-pre-wrap line-clamp-5">{resumeText.slice(0, 600)}{resumeText.length > 600 ? "..." : ""}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ---- Job Description & Requirements ---- */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Job Description & Requirements</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description and requirements here..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
              <p className="text-xs text-text-muted mt-2">Include both the description and requirements for the most accurate match analysis.</p>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleMatch}
            disabled={!resumeText || !jobDescription || matchLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {matchLoading ? "Analyzing..." : "Calculate Match Score"}
          </button>

          {/* Loading */}
          {matchLoading && (
            <div className="flex items-center gap-3 text-text-secondary mb-6">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Analyzing match against job description and requirements...</span>
            </div>
          )}

          {/* Match Score Display */}
          {matchScore !== null && (
            <div className="glass-card p-8 text-center mb-6">
              <p className="text-text-secondary text-sm uppercase tracking-wider mb-3">Match Score</p>
              <div className={`text-6xl font-bold ${getScoreColor(matchScore)}`}>
                {matchScore}%
              </div>
              {/* Visual progress bar */}
              <div className="max-w-xs mx-auto mt-4 h-2.5 bg-space-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    matchScore >= 75 ? "bg-green-400" : matchScore >= 50 ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>
              <p className="text-text-muted text-sm mt-3">
                {matchScore >= 80
                  ? "Excellent match — you're a top candidate for this role."
                  : matchScore >= 65
                  ? "Strong match — a few targeted improvements will make you stand out."
                  : matchScore >= 50
                  ? "Moderate match — review the gaps below and focus on quick wins."
                  : "Significant gaps — follow the action plan to strengthen your profile."}
              </p>
            </div>
          )}

          {/* AI Analysis */}
          {result && <MarkdownResult result={result} showDownload={false} />}

          {/* Error */}
          {matchError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {matchError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
