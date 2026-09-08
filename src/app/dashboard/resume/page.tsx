/* ============================================================
   RESUME INTELLIGENCE PAGE
   ============================================================
   The core feature of JobPilot AI. Provides:
   - Resume upload (PDF, TXT) with client-side PDF text extraction
   - AI analysis with ATS scoring
   - Quick optimize for a specific job
   - Full resume rebuild for a target role
   - Career Pivot mode for career changers
   - Download results as PDF or Word
   All AI calls go through /api/ai with the appropriate action.
   ============================================================ */

"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownResult from "@/components/MarkdownResult";
import CountryResumeResult from "@/components/CountryResumeResult";
import UpgradePrompt from "@/components/UpgradePrompt";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { useAIStream } from "@/hooks/useAIStream";
import { trackEvent } from "@/lib/track-event";
import { useDefaultResume } from "@/hooks/useDefaultResume";

/* ---- Tab names for the feature sub-sections ---- */
const tabs = [
  { id: "create", label: "Create from Scratch" },
  { id: "analyze", label: "Analyze Resume" },
  { id: "optimize", label: "Quick Optimize" },
  { id: "rebuild", label: "Full Rebuild" },
  { id: "pivot", label: "Career Pivot" },
];

export default function ResumePage() {
  /* Track which tab is active */
  const [activeTab, setActiveTab] = useState("create");
  /* Stored resume text (extracted from uploaded file) */
  const [resumeText, setResumeText] = useState("");
  /* Original file name for database storage */
  const [fileName, setFileName] = useState("");
  /* AI streaming hook — result appears token-by-token */
  const { result, loading, streaming, error, plan, remaining, callAI: streamAI, reset: resetAI } = useAIStream();
  /* Detect when streaming content stops growing — Gemini's SSE connection often
     hangs open for seconds after the last token. This lets us show download buttons
     and clear the "Rebuilding..." state without waiting for the HTTP close. */
  const [streamDone, setStreamDone] = useState(false);
  const lastResultLen = useRef(0);
  useEffect(() => {
    if (!streaming) { setStreamDone(false); lastResultLen.current = 0; return; }
    if (result.length > lastResultLen.current) {
      lastResultLen.current = result.length;
      setStreamDone(false);
    }
    const timer = setTimeout(() => {
      if (streaming && result.length > 0 && result.length === lastResultLen.current) {
        setStreamDone(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [streaming, result]);
  /* Track file upload/parsing progress */
  const [uploading, setUploading] = useState(false);
  /* File upload error (separate from AI error) */
  const [uploadError, setUploadError] = useState("");

  /* Auto-load user's most recent saved resume (render-time state adjustment) */
  const { defaultResume } = useDefaultResume();
  const [prevDefaultResume, setPrevDefaultResume] = useState(defaultResume);
  if (defaultResume && defaultResume !== prevDefaultResume) {
    setPrevDefaultResume(defaultResume);
    if (!resumeText) {
      setResumeText(defaultResume.content);
      setFileName(defaultResume.fileName);
    }
  }

  /* Job-specific fields for optimize/rebuild/pivot */
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  /* Optional free-form instructions for AI content decisions */
  const [customInstructions, setCustomInstructions] = useState("");
  const [rebuildMode, setRebuildMode] = useState<"safe" | "deep">("safe");
  /* Country-specific resume mode — "standard" uses existing system, country codes use new system */
  const [countryMode, setCountryMode] = useState<"standard" | "us" | "uk" | "au">("standard");

  /* ---- Create from Scratch fields ---- */
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [cfFullName, setCfFullName] = useState("");
  const [cfEmail, setCfEmail] = useState("");
  const [cfPhone, setCfPhone] = useState("");
  const [cfLocation, setCfLocation] = useState("");
  const [cfLinkedin, setCfLinkedin] = useState("");
  const [cfTargetRole, setCfTargetRole] = useState("");
  /* Repeatable experience entries: each has title, company, dates, description */
  const [cfExperience, setCfExperience] = useState([{ title: "", company: "", dates: "", description: "" }]);
  /* Repeatable education entries */
  const [cfEducation, setCfEducation] = useState([{ degree: "", school: "", year: "" }]);
  const [cfSkills, setCfSkills] = useState("");
  /* Optional sections — raw text */
  const [cfCertifications, setCfCertifications] = useState("");
  const [cfProjects, setCfProjects] = useState("");
  const [cfLanguages, setCfLanguages] = useState("");
  const [cfVolunteer, setCfVolunteer] = useState("");
  /* Step 2 checkboxes — which optional sections to include */
  const [includeCerts, setIncludeCerts] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeLanguages, setIncludeLanguages] = useState(true);
  const [includeVolunteer, setIncludeVolunteer] = useState(true);

  /* Cache analyze result so the same resume always returns the same score */
  const [analyzeCache, setAnalyzeCache] = useState<{ text: string; result: string } | null>(null);

  /* ---- Handle File Upload ---- */
  /* Parses PDFs client-side using pdf.js loaded from CDN */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError("");

    /* For .txt files, read directly in browser */
    if (file.name.toLowerCase().endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      return;
    }

    /* For PDF files, extract text client-side using pdf.js */
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setUploading(true);
      try {
        const text = await extractTextFromPdf(file);
        if (text.trim().length < 50) {
          setUploadError("Could not extract enough text from this PDF. Try pasting your resume text instead.");
          setResumeText("");
        } else {
          setResumeText(text);
        }
      } catch {
        setUploadError("Failed to parse PDF. Please paste your resume text instead.");
        trackEvent("resume.pdf_parse_failed");
        setResumeText("");
      } finally {
        setUploading(false);
      }
      return;
    }

    setUploadError("Please upload a PDF or TXT file.");
  };

  /* ---- Save Resume to Database ---- */
  const saveResume = async (analysis?: string) => {
    try {
      await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName || "Pasted Resume",
          content: resumeText,
          analysis: analysis || null,
        }),
      });
    } catch {
      trackEvent("resume.save_failed");
    }
  };

  /* ---- Call AI API (streaming) ---- */
  /* Appends country suffix to action name when a country is selected.
     "standard" mode passes the original action unchanged (existing system). */
  const callAI = async (action: string) => {
    const resolvedAction = countryMode !== "standard" && action !== "analyze_resume"
      ? `${action}_${countryMode}`
      : action;

    const payload: Record<string, string> = { resume: resumeText };

    if (action !== "analyze_resume") {
      payload.jobTitle = jobTitle;
      payload.company = company;
      payload.jobDescription = jobDescription;
      if (customInstructions.trim()) {
        payload.customInstructions = customInstructions.trim();
      }
    }

    if (action === "analyze_resume" && analyzeCache && analyzeCache.text === resumeText) {
      resetAI(analyzeCache.result);
      return;
    }

    const fullResult = await streamAI(resolvedAction, payload);

    if (fullResult && action === "analyze_resume") {
      setAnalyzeCache({ text: resumeText, result: fullResult });
      await saveResume(fullResult);
    }
  };

  /* ---- Call AI for Create from Scratch ---- */
  /* Assembles structured form data into a payload and sends to AI */
  const callCreateAI = async () => {
    /* Build experience text from repeatable entries */
    const expText = cfExperience
      .filter((e) => e.title || e.company)
      .map((e) => `${e.title}${e.company ? ` at ${e.company}` : ""}${e.dates ? ` (${e.dates})` : ""}\n${e.description}`)
      .join("\n\n");

    /* Build education text from repeatable entries */
    const eduText = cfEducation
      .filter((e) => e.degree || e.school)
      .map((e) => `${e.degree}${e.school ? `, ${e.school}` : ""}${e.year ? ` — ${e.year}` : ""}`)
      .join("\n");

    const payload: Record<string, string> = {
      fullName: cfFullName,
      email: cfEmail,
      phone: cfPhone,
      location: cfLocation,
      linkedin: cfLinkedin,
      targetRole: cfTargetRole,
      experience: expText,
      education: eduText,
      skills: cfSkills,
    };

    /* Only include optional sections the user checked */
    if (includeCerts && cfCertifications.trim()) payload.certifications = cfCertifications;
    if (includeProjects && cfProjects.trim()) payload.projects = cfProjects;
    if (includeLanguages && cfLanguages.trim()) payload.languages = cfLanguages;
    if (includeVolunteer && cfVolunteer.trim()) payload.volunteer = cfVolunteer;

    const action = countryMode !== "standard" ? `create_resume_${countryMode}` : "create_resume";
    await streamAI(action, payload);
  };

  /* ---- Check if any optional sections have data (for step 2 checkboxes) ---- */
  const hasOptionalData = cfCertifications.trim() || cfProjects.trim() || cfLanguages.trim() || cfVolunteer.trim();

  /* ---- Country Mode Selector ---- */
  /* Reusable inline component shown on Optimize, Rebuild, and Pivot tabs */
  const countryOptions = [
    { value: "standard" as const, label: "Standard", flag: "" },
    { value: "us" as const, label: "US", flag: "🇺🇸" },
    { value: "uk" as const, label: "UK", flag: "🇬🇧" },
    { value: "au" as const, label: "AU", flag: "🇦🇺" },
  ];
  const CountrySelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-text-secondary mb-2">Resume Format</label>
      <div className="flex gap-2 flex-wrap">
        {countryOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setCountryMode(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              countryMode === opt.value
                ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                : "text-text-secondary hover:text-white hover:bg-space-600 border border-card-border"
            }`}
          >
            {opt.flag && <span className="mr-1.5">{opt.flag}</span>}
            {opt.label}
          </button>
        ))}
      </div>
      {countryMode !== "standard" && (
        <p className="mt-2 text-xs text-brand-light">
          {countryMode === "us" && "Generate optimized ATS friendly US resume"}
          {countryMode === "uk" && "Generate optimized ATS friendly UK resume"}
          {countryMode === "au" && "Generate optimized ATS friendly AU resume"}
        </p>
      )}
    </div>
  );

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Resume Intelligence
      </h1>
      <p className="text-text-secondary mb-8">
        {activeTab === "create" ? "Build a professional resume from scratch — no existing resume needed." : "Upload your resume and let AI optimize it for any job."}
      </p>

      {/* ---- AI Usage / Upgrade Prompt ---- */}
      {remaining !== null && (
        <UpgradePrompt remaining={remaining as number | "unlimited"} plan={plan} />
      )}
      {remaining !== null && remaining !== "unlimited" && Number(remaining) > 5 && (
        <div className="mb-6 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-sm">
          <span className="text-brand-light font-medium">
            {remaining} AI {Number(remaining) === 1 ? "call" : "calls"} remaining this month
          </span>
        </div>
      )}

      {/* ---- Resume Upload Section (hidden on Create tab) ---- */}
      {activeTab !== "create" && <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Your Resume</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* File upload input */}
          <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-card-border hover:border-brand-indigo/40 cursor-pointer transition-colors">
            <span className="text-2xl">+</span>
            <span className="text-sm text-text-secondary">
              {uploading
                ? "Extracting text from PDF..."
                : fileName
                  ? fileName
                  : "Upload resume (PDF or TXT)"}
            </span>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {/* Or paste text directly */}
          <span className="text-text-muted self-center text-sm">or</span>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={4}
            className="flex-1 px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
          />
        </div>
        {resumeText && (
          <p className="mt-3 text-sm text-green-400">
            Resume loaded ({resumeText.length.toLocaleString()} characters)
          </p>
        )}
      </div>}

      {/* ---- Tab Navigation ---- */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); resetAI(); setUploadError(""); setCreateStep(1); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Tab Content ---- */}
      <div className="glass-card p-6 sm:p-8">

        {/* ---- Create from Scratch Tab ---- */}
        {activeTab === "create" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Create Resume from Scratch</h2>
            <p className="text-text-secondary text-sm mb-6">
              No resume yet? Fill in your details and AI will build a professional, ATS-optimized resume for you.
            </p>

            <CountrySelector />

            {/* ---- Step 1: Fill in your details ---- */}
            {createStep === 1 && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={cfFullName} onChange={(e) => setCfFullName(e.target.value)} placeholder="Full Name *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                    <input type="email" value={cfEmail} onChange={(e) => setCfEmail(e.target.value)} placeholder="Email *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                    <input type="tel" value={cfPhone} onChange={(e) => setCfPhone(e.target.value)} placeholder="Phone Number" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                    <input type="text" value={cfLocation} onChange={(e) => setCfLocation(e.target.value)} placeholder="City, Country" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                  </div>
                  <input type="url" value={cfLinkedin} onChange={(e) => setCfLinkedin(e.target.value)} placeholder="LinkedIn URL (optional)" className="w-full mt-3 px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                </div>

                {/* Target Role */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Target Role</h3>
                  <input type="text" value={cfTargetRole} onChange={(e) => setCfTargetRole(e.target.value)} placeholder="What job are you applying for? (e.g., Marketing Manager, Software Engineer) *" className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                </div>

                {/* Work Experience — repeatable */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Work Experience</h3>
                    <button type="button" onClick={() => setCfExperience([...cfExperience, { title: "", company: "", dates: "", description: "" }])} className="text-xs text-brand-light hover:text-white transition-colors">+ Add another role</button>
                  </div>
                  {cfExperience.map((exp, i) => (
                    <div key={i} className={`space-y-3 ${i > 0 ? "mt-4 pt-4 border-t border-card-border" : ""}`}>
                      {i > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-text-muted">Role {i + 1}</span>
                          <button type="button" onClick={() => setCfExperience(cfExperience.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={exp.title} onChange={(e) => { const u = [...cfExperience]; u[i] = { ...u[i], title: e.target.value }; setCfExperience(u); }} placeholder="Job Title *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                        <input type="text" value={exp.company} onChange={(e) => { const u = [...cfExperience]; u[i] = { ...u[i], company: e.target.value }; setCfExperience(u); }} placeholder="Company Name *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                      </div>
                      <input type="text" value={exp.dates} onChange={(e) => { const u = [...cfExperience]; u[i] = { ...u[i], dates: e.target.value }; setCfExperience(u); }} placeholder="Dates (e.g., Jan 2020 – Present)" className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                      <textarea value={exp.description} onChange={(e) => { const u = [...cfExperience]; u[i] = { ...u[i], description: e.target.value }; setCfExperience(u); }} placeholder="What did you do in this role? List your responsibilities, achievements, team size, tools used... (AI will optimize the wording)" rows={3} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                    </div>
                  ))}
                </div>

                {/* Education — repeatable */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Education</h3>
                    <button type="button" onClick={() => setCfEducation([...cfEducation, { degree: "", school: "", year: "" }])} className="text-xs text-brand-light hover:text-white transition-colors">+ Add another</button>
                  </div>
                  {cfEducation.map((edu, i) => (
                    <div key={i} className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${i > 0 ? "mt-3" : ""}`}>
                      <input type="text" value={edu.degree} onChange={(e) => { const u = [...cfEducation]; u[i] = { ...u[i], degree: e.target.value }; setCfEducation(u); }} placeholder="Degree / Qualification *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                      <input type="text" value={edu.school} onChange={(e) => { const u = [...cfEducation]; u[i] = { ...u[i], school: e.target.value }; setCfEducation(u); }} placeholder="Institution *" className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                      <div className="flex gap-2">
                        <input type="text" value={edu.year} onChange={(e) => { const u = [...cfEducation]; u[i] = { ...u[i], year: e.target.value }; setCfEducation(u); }} placeholder="Year(s)" className="flex-1 px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm" />
                        {i > 0 && <button type="button" onClick={() => setCfEducation(cfEducation.filter((_, idx) => idx !== i))} className="px-3 text-red-400 hover:text-red-300 text-xs">Remove</button>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
                  <textarea value={cfSkills} onChange={(e) => setCfSkills(e.target.value)} placeholder="List your skills — comma separated or one per line (e.g., Project Management, Excel, Python, Team Leadership...)" rows={3} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                </div>

                {/* Optional Sections */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Optional Sections <span className="text-text-muted font-normal">(leave blank to skip)</span></h3>
                  <div className="space-y-3">
                    <textarea value={cfCertifications} onChange={(e) => setCfCertifications(e.target.value)} placeholder="Certifications (e.g., PMP — PMI, 2023 / AWS Solutions Architect — Amazon, 2024)" rows={2} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                    <textarea value={cfProjects} onChange={(e) => setCfProjects(e.target.value)} placeholder="Projects (e.g., Built an e-commerce site using React, handled 500+ orders/month)" rows={2} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                    <textarea value={cfLanguages} onChange={(e) => setCfLanguages(e.target.value)} placeholder="Languages (e.g., English — Native, Spanish — Conversational, Mandarin — Basic)" rows={2} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                    <textarea value={cfVolunteer} onChange={(e) => setCfVolunteer(e.target.value)} placeholder="Volunteer experience (e.g., Mentor at Code.org — taught 30 students web development, 2023–2024)" rows={2} className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm" />
                  </div>
                </div>

                {/* Next / Generate button */}
                <button
                  onClick={() => {
                    if (hasOptionalData) {
                      setCreateStep(2);
                    } else {
                      callCreateAI();
                    }
                  }}
                  disabled={!cfFullName || !cfTargetRole || !cfExperience[0]?.title || loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasOptionalData ? "Next: Choose Sections" : loading && !streamDone ? "Generating..." : "Generate Resume"}
                </button>
              </div>
            )}

            {/* ---- Step 2: Choose which optional sections to include ---- */}
            {createStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Choose which sections to include in your resume</h3>
                  <p className="text-text-muted text-xs mb-4">
                    Uncheck sections that aren&apos;t relevant to your target role. Fewer sections = tighter, more focused resume.
                  </p>
                  <div className="space-y-3">
                    {cfCertifications.trim() && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-card-border hover:border-brand-indigo/30 transition-colors cursor-pointer">
                        <input type="checkbox" checked={includeCerts} onChange={(e) => setIncludeCerts(e.target.checked)} className="mt-1 accent-brand-indigo" />
                        <div>
                          <p className="text-sm font-medium text-white">Certifications</p>
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{cfCertifications}</p>
                        </div>
                      </label>
                    )}
                    {cfProjects.trim() && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-card-border hover:border-brand-indigo/30 transition-colors cursor-pointer">
                        <input type="checkbox" checked={includeProjects} onChange={(e) => setIncludeProjects(e.target.checked)} className="mt-1 accent-brand-indigo" />
                        <div>
                          <p className="text-sm font-medium text-white">Projects</p>
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{cfProjects}</p>
                        </div>
                      </label>
                    )}
                    {cfLanguages.trim() && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-card-border hover:border-brand-indigo/30 transition-colors cursor-pointer">
                        <input type="checkbox" checked={includeLanguages} onChange={(e) => setIncludeLanguages(e.target.checked)} className="mt-1 accent-brand-indigo" />
                        <div>
                          <p className="text-sm font-medium text-white">Languages</p>
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{cfLanguages}</p>
                        </div>
                      </label>
                    )}
                    {cfVolunteer.trim() && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-card-border hover:border-brand-indigo/30 transition-colors cursor-pointer">
                        <input type="checkbox" checked={includeVolunteer} onChange={(e) => setIncludeVolunteer(e.target.checked)} className="mt-1 accent-brand-indigo" />
                        <div>
                          <p className="text-sm font-medium text-white">Volunteer Experience</p>
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{cfVolunteer}</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setCreateStep(1)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-space-600 border border-card-border transition-all">
                    Back
                  </button>
                  <button
                    onClick={() => callCreateAI()}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && !streamDone ? "Generating..." : "Generate Resume"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- Analyze Resume Tab ---- */}
        {activeTab === "analyze" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Analyze Resume</h2>
            <p className="text-text-secondary text-sm mb-6">
              Get an ATS score, find weaknesses, and get improvement suggestions.
            </p>
            <button
              onClick={() => callAI("analyze_resume")}
              disabled={!resumeText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && !streamDone ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        )}

        {/* ---- Quick Optimize Tab ---- */}
        {activeTab === "optimize" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Quick Optimize</h2>
            <p className="text-text-secondary text-sm mb-6">
              Optimize your resume — paste a job description for targeted optimization, or leave it blank for a general improvement.
            </p>
            <CountrySelector />
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (optional)..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional: Tell the AI exactly what to customize (e.g. remove H&M Sales Advisor job, add an AI Projects section, emphasize leadership, add more metrics...)"
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI("optimize_resume")}
              disabled={!resumeText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && !streamDone ? "Optimizing..." : jobDescription ? "Optimize for Job" : "Optimize Resume"}
            </button>
          </div>
        )}

        {/* ---- Full Rebuild Tab ---- */}
        {activeTab === "rebuild" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Full Resume Rebuild</h2>
            <p className="text-text-secondary text-sm mb-4">
              Completely rebuild your resume for a specific role with ATS keywords and power verbs.
            </p>

            <CountrySelector />

            {/* ---- Rebuild Mode Selection ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRebuildMode("safe")}
                className={`text-left rounded-xl border p-4 transition-all ${rebuildMode === "safe" ? "border-brand-indigo bg-brand-indigo/10" : "border-card-border bg-space-700/50 hover:border-text-muted"}`}
              >
                <p className="font-semibold text-white text-sm mb-1">Standard Rebuild</p>
                <p className="text-text-secondary text-xs">
                  Only uses information explicitly in your resume. Restructures and rewords for the job, but never adds anything you didn&apos;t list.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRebuildMode("deep")}
                className={`text-left rounded-xl border p-4 transition-all ${rebuildMode === "deep" ? "border-brand-indigo bg-brand-indigo/10" : "border-card-border bg-space-700/50 hover:border-text-muted"}`}
              >
                <p className="font-semibold text-white text-sm mb-1">Deep Tailor</p>
                <p className="text-text-secondary text-xs">
                  Fully tailors your resume to the job description. If you hold a similar role, the AI adds responsibilities from the JD that you would normally do in that role — so your resume reads like it was written for this exact job. No fake jobs, companies, or unrelated skills.
                </p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional: Tell the AI exactly what to customize (e.g. remove H&M Sales Advisor job, add an AI Projects section, emphasize leadership, add more metrics...)"
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI(rebuildMode === "deep" ? "deep_tailor" : "rebuild_resume")}
              disabled={!resumeText || !jobDescription || !jobTitle || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && !streamDone ? "Rebuilding..." : rebuildMode === "deep" ? "Deep Tailor Resume" : "Rebuild Resume"}
            </button>
          </div>
        )}

        {/* ---- Career Pivot Tab ---- */}
        {activeTab === "pivot" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Career Pivot Mode</h2>
            <p className="text-text-secondary text-sm mb-6">
              Switching careers? AI will reframe your experience with transferable skills for your target industry.
            </p>
            <CountrySelector />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Target Role (e.g., Data Analyst)"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Target Industry (e.g., Tech)"
                className="px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for your target role..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional: Tell the AI exactly what to customize (e.g. remove H&M Sales Advisor job, add an AI Projects section, emphasize leadership, add more metrics...)"
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={() => callAI("career_pivot")}
              disabled={!resumeText || !jobDescription || !jobTitle || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && !streamDone ? "Pivoting..." : "Generate Pivot Resume"}
            </button>
          </div>
        )}

        {/* ---- Error Display ---- */}
        {(error || uploadError) && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error || uploadError}
          </div>
        )}

        {/* ---- Loading State (before stream starts) ---- */}
        {loading && !streaming && !result && (
          <div className="mt-6 flex flex-col items-center gap-3 text-text-secondary py-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Analyzing your resume...</span>
            </div>
          </div>
        )}

        {/* ---- AI Result Display (shows while streaming + after complete) ---- */}
        {result && (
          <div className="relative">
            {countryMode !== "standard" ? (
              <CountryResumeResult result={result} country={countryMode} showDownload={!streaming || streamDone} editable={activeTab !== "analyze"} />
            ) : (
              <MarkdownResult result={result} showDownload={!streaming || streamDone} editable={activeTab !== "analyze"} />
            )}
            {streaming && !streamDone && (
              <div className="mt-3 flex items-center gap-2 text-brand-light text-sm">
                <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                <span>Generating...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
