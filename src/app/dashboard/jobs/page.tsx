/* ============================================================
   JOB SEARCH & MATCH PAGE
   ============================================================
   Two tabs:
   1. Search Jobs — search real job listings via Adzuna API
      with save-to-tracker and AI match scoring
   2. Manual Match — paste a job description to get AI analysis
   ============================================================ */

"use client";

import { useState } from "react";
import MarkdownResult from "@/components/MarkdownResult";

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

  /* ---- Expanded job description tracking ---- */
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  /* ---- Save job state ---- */
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  /* ---- Match tab state ---- */
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");

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

      const data = await res.json();
      if (!res.ok) {
        setMatchError(data.error || "Match calculation failed.");
        return;
      }

      /* Extract the numeric score from the AI response */
      const scoreMatch = data.result.match(/MATCH_SCORE:\s*(\d+)/);
      if (scoreMatch) {
        setMatchScore(parseInt(scoreMatch[1]));
      }
      setResult(data.result);
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
  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
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
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(1)}
                  placeholder="e.g. London, Remote"
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                />
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
                  <div key={job.id} className="glass-card p-5 hover:border-brand-indigo/30 transition-colors">
                    {/* Job header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white truncate">{job.title}</h3>
                        <p className="text-text-secondary text-sm">{job.company}</p>
                      </div>

                      {/* Save button */}
                      <button
                        onClick={() => handleSaveJob(job)}
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
                      {job.location && (
                        <span className="px-3 py-1 rounded-full bg-space-600 text-text-secondary text-xs">
                          {job.location}
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
                    <p className={`text-sm text-text-secondary leading-relaxed ${
                      expandedJob === job.id ? "" : "line-clamp-3"
                    }`}>
                      {job.description}
                    </p>
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="text-xs text-brand-light hover:text-white mt-2 transition-colors"
                    >
                      {expandedJob === job.id ? "Show less" : "Show more"}
                    </button>

                    {/* Apply link — only if URL exists */}
                    {job.url && (
                      <div className="mt-3 pt-3 border-t border-card-border">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
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
              {searchTotal > 20 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleSearch(searchPage - 1)}
                    disabled={searchPage <= 1 || searchLoading}
                    className="btn-secondary text-sm disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-text-muted">Page {searchPage}</span>
                  <button
                    onClick={() => handleSearch(searchPage + 1)}
                    disabled={searchResults.length < 20 || searchLoading}
                    className="btn-secondary text-sm disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- No Results ---- */}
          {hasSearched && !searchLoading && searchResults.length === 0 && !searchError && (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-text-secondary">No jobs found. Try different keywords or location.</p>
            </div>
          )}

          {/* ---- Initial State ---- */}
          {!hasSearched && (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">🌐</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Resume input */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Your Resume</h2>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            </div>

            {/* Job description input */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleMatch}
            disabled={!resumeText || !jobDescription || matchLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {matchLoading ? "Calculating..." : "Calculate Match Score"}
          </button>

          {/* Match Score Display */}
          {matchScore !== null && (
            <div className="glass-card p-8 text-center mb-8">
              <p className="text-text-secondary text-sm uppercase tracking-wider mb-2">Match Score</p>
              <div className={`text-6xl font-bold ${getScoreColor(matchScore)}`}>
                {matchScore}%
              </div>
              <p className="text-text-muted text-sm mt-2">
                {matchScore >= 75
                  ? "Great match! You're a strong candidate."
                  : matchScore >= 50
                  ? "Decent match. Consider optimizing your resume."
                  : "Low match. Use Resume Rebuild to improve."}
              </p>
            </div>
          )}

          {/* AI Analysis */}
          {result && <MarkdownResult result={result} showDownload={false} />}

          {/* Loading */}
          {matchLoading && (
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Analyzing match compatibility...</span>
            </div>
          )}

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
