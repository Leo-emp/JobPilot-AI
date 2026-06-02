/* ============================================================
   INTERVIEW PREP PAGE
   ============================================================
   Two-tab interface:
   Tab 1: Generate predicted interview questions for a role
   Tab 2: Practice answering questions with text or voice,
          then get AI coaching feedback on each answer
   ============================================================ */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import MarkdownResult from "@/components/MarkdownResult";
import { useAIStream } from "@/hooks/useAIStream";
import { COMPANY_CATEGORIES, COMPANY_PROFILES, getCompanySlugsForCategory, buildCompanyPromptBlock, type CompanyCategory } from "@/lib/companyProfiles";

/* ---- Minimal SpeechRecognition interface (avoids `any` for vendor-prefixed API) ---- */
interface MinimalSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: unknown) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

/* ---- Types for parsed questions ---- */
interface ParsedQuestion {
  id: number;
  category: string;
  question: string;
  lookingFor: string;
  howToPrepare: string;
}

/* ---- Parse markdown output into structured question objects ---- */
function parseQuestionsFromMarkdown(md: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const lines = md.split("\n");
  let currentCategory = "";
  let current: Partial<ParsedQuestion> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      currentCategory = trimmed.slice(3).trim();
      continue;
    }

    const qMatch = trimmed.match(/^###\s*Question\s+(\d+)/i);
    if (qMatch) {
      if (current && current.question) questions.push(current as ParsedQuestion);
      current = { id: parseInt(qMatch[1]), category: currentCategory, question: "", lookingFor: "", howToPrepare: "" };
      continue;
    }

    if (!current) continue;

    if (trimmed.startsWith("**What they’re looking for:**") || trimmed.startsWith("**What they're looking for:**")) {
      current.lookingFor = trimmed.replace(/^\*\*What they['’]re looking for:\*\*\s*/, "");
      continue;
    }
    if (trimmed.startsWith("**How to prepare:**")) {
      current.howToPrepare = trimmed.replace(/^\*\*How to prepare:\*\*\s*/, "");
      continue;
    }

    if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) continue;
    if (!trimmed) continue;

    if (!current.question) current.question = trimmed;
  }

  if (current && current.question) questions.push(current as ParsedQuestion);
  return questions;
}

/* ---- Microphone SVG icon ---- */
const MicIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? "text-red-400" : "text-current"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m-4 0h8m-4-12a3 3 0 00-3 3v4a3 3 0 006 0v-4a3 3 0 00-3-3z" />
  </svg>
);

export default function InterviewPage() {
  /* ---- Tab state ---- */
  const [activeTab, setActiveTab] = useState<"predict" | "practice">("predict");

  /* ---- Predict tab fields ---- */
  const [jobTitle, setJobTitle] = useState("");
  const [companyCategory, setCompanyCategory] = useState<CompanyCategory | "manual" | "">("");
  const [companySlug, setCompanySlug] = useState("");
  const [company, setCompany] = useState("");
  const [companyPromptBlock, setCompanyPromptBlock] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState("");

  /* ---- Practice tab fields ---- */
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [savedResumes, setSavedResumes] = useState<{ id: string; fileName: string; content: string }[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [feedbackQId, setFeedbackQId] = useState<number | null>(null);
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  /* ---- Speech recognition ---- */
  const [listeningId, setListeningId] = useState<number | null>(null);
  /* # SpeechRecognition ref — typed as minimal interface to avoid `any` */
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  /* ---- AI streaming hook ---- */
  const { result: streamResult, loading, streaming, error, callAI: streamAI, reset: resetAI } = useAIStream();

  /* ---- Fetch saved resumes on mount and auto-select the latest ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/resumes?limit=20&sort=createdAt&order=desc");
        const d = r.ok ? await r.json() : { data: [] };
        const list = d.data || [];
        if (!cancelled) {
          setSavedResumes(list);
          /* Auto-select the most recent resume so it's ready for feedback */
          if (list.length > 0 && !resumeText) {
            setResumeText(list[0].content);
          }
        }
      } catch {
        /* Network error — ignore */
      } finally {
        if (!cancelled) setResumesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [resumeText]);

  /* ---- Generate interview questions ---- */
  const handlePredict = async () => {
    setQuestions("");
    setParsedQuestions([]);
    const fullResult = await streamAI("interview_questions", { jobTitle, company, companyPromptBlock, jobDescription });
    if (fullResult) {
      setQuestions(fullResult);
      setParsedQuestions(parseQuestionsFromMarkdown(fullResult));
    }
  };

  /* ---- Get AI feedback on a specific question ---- */
  const handleGetFeedback = useCallback(async (q: ParsedQuestion) => {
    const userAnswer = userAnswers[q.id];
    setFeedbackQId(q.id);

    const action = userAnswer?.trim() ? "interview_feedback" : "interview_answer";
    const payload: Record<string, unknown> = {
      question: q.question,
      resume: resumeText,
      jobDescription,
      company,
      companyPromptBlock,
      ...(userAnswer?.trim() ? { userAnswer } : {}),
    };

    const fullResult = await streamAI(action, payload);
    if (fullResult) {
      setFeedbackMap(prev => ({ ...prev, [q.id]: fullResult }));
    }
    setFeedbackQId(null);
  }, [userAnswers, resumeText, jobDescription, streamAI, company, companyPromptBlock]);

  /* ---- Speech recognition toggle ---- */
  const toggleMic = useCallback((questionId: number) => {
    if (listeningId === questionId) {
      recognitionRef.current?.stop();
      setListeningId(null);
      return;
    }

    if (listeningId !== null) {
      recognitionRef.current?.stop();
    }

    /* # Access SpeechRecognition from window (vendor-prefixed in some browsers) */
    const w = window as unknown as Record<string, unknown>;
    const SRConstructor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SRConstructor) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new (SRConstructor as { new(): MinimalSpeechRecognition })();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = userAnswers[questionId] || "";
    const _baseLength = finalTranscript.length;

    recognition.onresult = (event: unknown) => {
      /* # Cast event to SpeechRecognitionEvent-like shape for type safety */
      const e = event as { resultIndex: number; results: { length: number; [index: number]: { isFinal: boolean; 0: { transcript: string } } } };
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setUserAnswers(prev => ({ ...prev, [questionId]: finalTranscript + interim }));
    };

    recognition.onerror = () => setListeningId(null);
    recognition.onend = () => setListeningId(null);

    recognition.start();
    setListeningId(questionId);
    recognitionRef.current = recognition;
  }, [listeningId, userAnswers]);

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Interview Prep AI
      </h1>
      <p className="text-text-secondary mb-6">
        Predict likely questions and practice your answers with AI coaching.
      </p>

      {/* ---- Mock Interview CTA ---- */}
      <Link
        href="/dashboard/interview/mock"
        className="flex items-center gap-4 p-5 mb-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-brand-indigo/20 hover:border-brand-indigo/40 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-xl shrink-0">
          🎥
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white group-hover:text-brand-light transition-colors">
            Interactive Mock Interview
          </p>
          <p className="text-sm text-text-secondary">
            Practice with video, voice &amp; AI — just like a real interview. Get scored and feedback instantly.
          </p>
        </div>
        <svg className="w-5 h-5 text-text-muted group-hover:text-brand-light transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* ---- Tab Switcher ---- */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => { setActiveTab("predict"); resetAI(); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "predict"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
          }`}
        >
          🎯 Predict Questions
        </button>
        <button
          onClick={() => { setActiveTab("practice"); resetAI(); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "practice"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
          }`}
        >
          💬 Practice Answers
          {parsedQuestions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-indigo/30 text-brand-light text-xs">
              {parsedQuestions.length}
            </span>
          )}
        </button>
      </div>

      <div className="glass-card p-6 sm:p-8">
        {/* ---- Predict Questions Tab ---- */}
        {activeTab === "predict" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Predict Interview Questions</h2>
            {/* Job title */}
            <div className="mb-4">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title *"
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
            </div>

            {/* Target Company — two-tier category → company dropdown, or manual input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">Target Company <span className="text-text-muted">(injects real company-specific questions)</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={companyCategory}
                  onChange={e => {
                    const val = e.target.value as CompanyCategory | "manual" | "";
                    setCompanyCategory(val);
                    setCompanySlug("");
                    if (val === "manual" || val === "") {
                      setCompany("");
                      setCompanyPromptBlock("");
                    } else {
                      const slugs = getCompanySlugsForCategory(val);
                      if (slugs.length > 0) {
                        setCompanySlug(slugs[0].slug);
                        setCompany(slugs[0].name);
                        setCompanyPromptBlock(buildCompanyPromptBlock(COMPANY_PROFILES[slugs[0].slug]));
                      }
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm"
                >
                  <option value="">Select category...</option>
                  {COMPANY_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label} — {cat.description}</option>
                  ))}
                  <option value="manual">Type company name manually</option>
                </select>

                {companyCategory && companyCategory !== "manual" ? (
                  <select
                    value={companySlug}
                    onChange={e => {
                      const slug = e.target.value;
                      setCompanySlug(slug);
                      if (slug && COMPANY_PROFILES[slug]) {
                        setCompany(COMPANY_PROFILES[slug].name);
                        setCompanyPromptBlock(buildCompanyPromptBlock(COMPANY_PROFILES[slug]));
                      } else {
                        setCompany("");
                        setCompanyPromptBlock("");
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:border-brand-indigo text-sm"
                  >
                    {getCompanySlugsForCategory(companyCategory as CompanyCategory).map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                ) : companyCategory === "manual" ? (
                  <input
                    type="text"
                    value={company}
                    onChange={e => { setCompany(e.target.value); setCompanyPromptBlock(""); }}
                    placeholder="e.g., Spotify, Goldman Sachs, Shopify..."
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
                  />
                ) : null}
              </div>

              {/* Company interview style preview */}
              {companySlug && COMPANY_PROFILES[companySlug] && (
                <div className="mt-3 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20">
                  <p className="text-xs text-brand-light font-medium mb-1">{COMPANY_PROFILES[companySlug].name} Interview Style</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{COMPANY_PROFILES[companySlug].interviewStyle}</p>
                  <p className="text-xs text-text-muted mt-2">Rounds: {COMPANY_PROFILES[companySlug].rounds.join(" → ")}</p>
                </div>
              )}
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={handlePredict}
              disabled={!jobTitle || !jobDescription || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Predicting..." : "🎯 Generate Questions"}
            </button>

            {(streaming && activeTab === "predict" ? streamResult : questions) && (
              <div>
                <MarkdownResult result={streaming && activeTab === "predict" ? streamResult : questions} showDownload={false} />
                {streaming && activeTab === "predict" && (
                  <div className="mt-3 flex items-center gap-2 text-brand-light text-sm">
                    <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                    <span>Generating...</span>
                  </div>
                )}
                {!streaming && parsedQuestions.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-between">
                    <p className="text-sm text-gray-300">
                      <span className="text-white font-semibold">{parsedQuestions.length} questions</span> ready to practice
                    </p>
                    <button
                      onClick={() => { setActiveTab("practice"); resetAI(); }}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:bg-brand-indigo/30 transition-colors"
                    >
                      Start Practicing →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---- Practice Answers Tab ---- */}
        {activeTab === "practice" && (
          <div>
            {parsedQuestions.length === 0 ? (
              /* No questions generated yet */
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-space-600 border border-card-border flex items-center justify-center text-3xl mx-auto mb-4">
                  🎯
                </div>
                <h2 className="text-xl font-bold mb-2">No Questions Yet</h2>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  Generate predicted interview questions first, then come back here to practice answering each one.
                </p>
                <button
                  onClick={() => setActiveTab("predict")}
                  className="btn-primary"
                >
                  Go to Predict Questions
                </button>
              </div>
            ) : (
              <div>
                {/* Practice tab header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Practice Your Answers</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      {parsedQuestions.length} questions for <span className="text-white">{jobTitle}</span> at <span className="text-white">{company}</span>
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
                    <span className="px-2 py-1 rounded bg-space-600 border border-card-border">Type</span>
                    <span>or</span>
                    <span className="px-2 py-1 rounded bg-space-600 border border-card-border flex items-center gap-1"><MicIcon /> Speak</span>
                    <span>your answer</span>
                  </div>
                </div>

                {/* Resume import for personalized feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Your Resume <span className="text-text-muted">(for personalized AI feedback)</span>
                  </label>

                  {/* Saved resumes selector */}
                  {savedResumes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {savedResumes.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setResumeText(r.content)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
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
                  )}
                  {resumesLoading && (
                    <p className="text-xs text-text-muted mb-3">Loading saved resumes...</p>
                  )}
                  {!resumesLoading && savedResumes.length === 0 && (
                    <p className="text-xs text-text-muted mb-3">
                      No saved resumes found. <a href="/dashboard/resume" className="text-brand-light hover:underline">Upload one</a> or paste below.
                    </p>
                  )}

                  {/* Text area — shows imported content or allows paste */}
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Select a resume above or paste your resume text here..."
                    rows={resumeText ? 4 : 2}
                    className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-y text-sm"
                  />
                  {resumeText && (
                    <button
                      onClick={() => setResumeText("")}
                      className="mt-2 text-xs text-text-muted hover:text-red-400 transition-colors"
                    >
                      Clear resume
                    </button>
                  )}
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                  {parsedQuestions.map((q) => {
                    const isExpanded = expandedId === q.id;
                    const hasFeedback = !!feedbackMap[q.id];
                    const isLoadingThis = feedbackQId === q.id && loading;
                    const isStreamingThis = feedbackQId === q.id && streaming;
                    const hasAnswer = !!userAnswers[q.id]?.trim();
                    const isListening = listeningId === q.id;

                    return (
                      <div
                        key={q.id}
                        className={`rounded-xl border transition-all ${
                          isExpanded
                            ? "bg-space-700/60 border-brand-indigo/30"
                            : "bg-space-700/30 border-card-border hover:border-card-border-hover"
                        }`}
                      >
                        {/* Question header — click to expand */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          className="w-full flex items-start gap-3 p-4 text-left"
                        >
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light text-sm font-bold shrink-0 mt-0.5">
                            {q.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-[15px] leading-snug">{q.question}</p>
                            <p className="text-xs text-text-muted mt-1">{q.category}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {hasAnswer && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs">
                                Answered
                              </span>
                            )}
                            {hasFeedback && (
                              <span className="px-2 py-0.5 rounded-full bg-brand-indigo/15 border border-brand-indigo/20 text-brand-light text-xs">
                                Reviewed
                              </span>
                            )}
                            <svg
                              className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="px-4 pb-5 pt-0">
                            <div className="ml-0 sm:ml-10">
                              {/* Hints toggle */}
                              {(q.lookingFor || q.howToPrepare) && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => setShowHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                    className="text-xs text-brand-light hover:text-white transition-colors flex items-center gap-1"
                                  >
                                    <svg className={`w-3 h-3 transition-transform ${showHints[q.id] ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    {showHints[q.id] ? "Hide Hints" : "Show Hints"}
                                  </button>
                                  {showHints[q.id] && (
                                    <div className="mt-2 space-y-2">
                                      {q.lookingFor && (
                                        <div className="pl-4 py-2 border-l-2 border-brand-indigo/40 bg-brand-indigo/5 rounded-r-lg">
                                          <p className="text-[13px] text-gray-400"><span className="text-gray-300 font-medium">What they&apos;re looking for:</span> {q.lookingFor}</p>
                                        </div>
                                      )}
                                      {q.howToPrepare && (
                                        <div className="pl-4 py-2 border-l-2 border-emerald-500/40 bg-emerald-500/5 rounded-r-lg">
                                          <p className="text-[13px] text-gray-400"><span className="text-gray-300 font-medium">How to prepare:</span> {q.howToPrepare}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Answer text area */}
                              <div className="relative mb-3">
                                <textarea
                                  value={userAnswers[q.id] || ""}
                                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  placeholder="Type your answer here, or click the mic to speak..."
                                  rows={4}
                                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-space-800 border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-y text-sm leading-relaxed ${
                                    isListening ? "border-red-400/50 bg-red-500/5" : "border-card-border"
                                  }`}
                                />
                                {/* Mic button inside textarea */}
                                <button
                                  onClick={() => toggleMic(q.id)}
                                  className={`absolute right-2 sm:right-3 top-2 sm:top-3 p-2 rounded-lg transition-all ${
                                    isListening
                                      ? "bg-red-500/20 border border-red-400/30 text-red-400 animate-pulse"
                                      : "bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30"
                                  }`}
                                  title={isListening ? "Stop recording" : "Start voice recording"}
                                >
                                  <MicIcon active={isListening} />
                                </button>
                                {isListening && (
                                  <div className="absolute right-14 sm:right-16 top-3 sm:top-4 flex items-center gap-1.5 text-red-400 text-xs">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                                    <span className="hidden sm:inline">Recording...</span>
                                    <span className="sm:hidden">Rec</span>
                                  </div>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-wrap gap-2">
                                {hasAnswer && (
                                  <button
                                    onClick={() => handleGetFeedback(q)}
                                    disabled={loading || !resumeText.trim()}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-indigo/20 border border-brand-indigo/30 text-brand-light hover:bg-brand-indigo/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    {isLoadingThis || isStreamingThis ? "Analyzing..." : "✨ Get AI Feedback"}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setUserAnswers(prev => ({ ...prev, [q.id]: "" }));
                                    handleGetFeedback(q);
                                  }}
                                  disabled={loading || !resumeText.trim()}
                                  className="px-4 py-2 rounded-lg text-sm font-medium bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {(isLoadingThis || isStreamingThis) && !hasAnswer ? "Generating..." : "💡 Show Model Answer"}
                                </button>
                                {!resumeText.trim() && (
                                  <p className="text-xs text-text-muted self-center">Paste your resume above for AI feedback</p>
                                )}
                              </div>

                              {/* AI feedback / model answer result */}
                              {(isLoadingThis || isStreamingThis || hasFeedback) && (
                                <div className="mt-4">
                                  {isLoadingThis && !streamResult ? (
                                    <div className="flex items-center gap-3 py-6 justify-center text-text-secondary">
                                      <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
                                      <span className="text-sm">Generating model answer...</span>
                                    </div>
                                  ) : (
                                    <>
                                      <MarkdownResult
                                        result={isStreamingThis ? streamResult : feedbackMap[q.id]}
                                        showDownload={false}
                                      />
                                      {isStreamingThis && (
                                        <div className="mt-2 flex items-center gap-2 text-brand-light text-sm">
                                          <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                                          <span>Generating...</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading indicator (before stream starts) */}
        {loading && !streaming && !streamResult && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Generating...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
