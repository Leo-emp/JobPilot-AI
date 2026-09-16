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
import { trackEvent } from "@/lib/track-event";

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
  const [activeTab, setActiveTab] = useState<"predict" | "practice" | "saythis" | "star">("predict");

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
        const d = r.ok ? await r.json().catch(() => ({ data: [] })) : { data: [] };
        const list = d.data || [];
        if (!cancelled) {
          setSavedResumes(list);
          /* Auto-select the most recent resume so it's ready for feedback */
          if (list.length > 0 && !resumeText) {
            setResumeText(list[0].content);
          }
        }
      } catch {
        trackEvent("interview_prep.load_resumes_failed");
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
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
          Predict Questions
        </button>
        <button
          onClick={() => { setActiveTab("practice"); resetAI(); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "practice"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
          }`}
        >
          Practice Answers
          {parsedQuestions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-indigo/30 text-brand-light text-xs">
              {parsedQuestions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab("saythis"); resetAI(); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "saythis"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
          }`}
        >
          Say This, Not That
        </button>
        <button
          onClick={() => { setActiveTab("star"); resetAI(); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "star"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600 border border-transparent"
          }`}
        >
          STAR Templates
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
              {loading ? "Predicting..." : "Generate Questions"}
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
                <div className="w-16 h-16 rounded-2xl bg-space-600 border border-card-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                                  {(isLoadingThis || isStreamingThis) && !hasAnswer ? "Generating..." : "Show Model Answer"}
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
          <div className="mt-6 flex flex-col items-center gap-3 text-text-secondary py-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Preparing your interview questions...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ============================================================
           SAY THIS, NOT THAT TAB
           ============================================================
           Static content — zero AI calls. Casual-to-professional phrase
           swaps organized by common interview situations.
           ============================================================ */}
        {activeTab === "saythis" && (
          <div>
            <h2 className="text-xl font-bold mb-2">Say This, Not That</h2>
            <p className="text-text-secondary text-sm mb-6">Swap casual phrases for professional ones. Organized by interview situation.</p>

            <div className="space-y-4">

              {/* ---- Why did you leave? ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked: Why did you leave?</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;My boss was terrible and didn&apos;t appreciate my work.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I&apos;d maximized my growth in that role and I&apos;m seeking an environment where I can take on broader ownership.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Never criticize a former employer — interviewers hear it as a red flag about your attitude. Reframe as what you&apos;re moving toward.</p>
                </div>
              </div>

              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked: Why did you leave?</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;It was boring and I wasn&apos;t learning anything new.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I&apos;d reached a point where the role no longer challenged me technically, and I wanted to be in a high-growth environment.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">&ldquo;Boring&rdquo; sounds entitled. &ldquo;No longer challenged me&rdquo; positions you as someone who actively seeks growth.</p>
                </div>
              </div>

              {/* ---- What's your weakness? ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked: What&apos;s your weakness?</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I&apos;m a perfectionist&rdquo; or &ldquo;I work too hard.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;Earlier in my career, I tended to take on too much myself rather than delegating. I&apos;ve since learned to trust my team and distribute work based on strengths.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Clich&eacute; answers signal you&apos;re dodging the question. Name a real weakness, show self-awareness, and demonstrate you&apos;ve worked on it.</p>
                </div>
              </div>

              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked: What&apos;s your weakness?</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I don&apos;t really have any weaknesses.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I sometimes spend too long researching before making a decision. I&apos;ve started setting myself time-boxed research windows to move faster.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Claiming no weakness is the worst answer. It signals zero self-awareness. Always pair the weakness with an active fix.</p>
                </div>
              </div>

              {/* ---- Describing your impact ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When describing your impact</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I helped with the project and did some data stuff.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I led the data analysis workstream, identifying three cost-saving opportunities that reduced operational expenses by 12%.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">&ldquo;Helped&rdquo; and &ldquo;stuff&rdquo; erase your contribution. Use a strong verb (led, designed, built) + specific scope + measurable outcome.</p>
                </div>
              </div>

              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When describing your impact</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I was responsible for the website.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I owned the end-to-end redesign of our customer-facing platform, resulting in a 25% increase in user engagement.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">&ldquo;Responsible for&rdquo; is passive. &ldquo;Owned&rdquo; shows initiative and accountability — exactly what interviewers want to hear.</p>
                </div>
              </div>

              {/* ---- Teamwork ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When discussing teamwork</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I&apos;m a good team player.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I coordinated across product, design, and engineering to align on the launch timeline — we shipped on schedule with zero critical bugs.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Claiming a trait is meaningless. Proving it with a specific example is everything. Replace adjectives with evidence.</p>
                </div>
              </div>

              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When discussing teamwork</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;We all worked together and got it done.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;I facilitated daily syncs between three teams, identified a dependency risk early, and re-sequenced our deliverables to keep us on track.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Vague group statements hide your individual contribution. Name your specific role and what YOU did to drive the outcome.</p>
                </div>
              </div>

              {/* ---- Why this company? ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked: Why this company?</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I heard it&apos;s a great company to work for.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;Your team&apos;s work on [specific product/initiative] stood out to me because it aligns with my experience in [your relevant skill], and I&apos;m excited to contribute to [specific goal].&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Generic flattery sounds like you applied everywhere. Reference something specific about the company and connect it to your skills.</p>
                </div>
              </div>

              {/* ---- Salary / Compensation ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When asked about salary expectations</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I&apos;ll take whatever you offer&rdquo; or &ldquo;I need at least $X because of my bills.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;Based on my research and the scope of this role, I&apos;m targeting the [range] bracket. I&apos;m flexible depending on the total compensation package.&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Never anchor to personal needs — anchor to market value. Giving a range shows you&apos;ve done research and are negotiating professionally.</p>
                </div>
              </div>

              {/* ---- Opening / First impression ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When opening your answer</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;That&apos;s a great question!&rdquo; or &ldquo;So basically...&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">Jump straight into your answer. &ldquo;In my previous role at [Company], I...&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Filler openers waste time and signal nervousness. Going straight to the substance shows confidence and respect for the interviewer&apos;s time.</p>
                </div>
              </div>

              {/* ---- Gaps in experience ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-indigo/10 border-b border-card-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">When addressing gaps in experience</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-red-400 mb-1">Don&apos;t say</p>
                      <p className="text-sm text-red-400">&ldquo;I don&apos;t have experience with that, sorry.&rdquo;</p>
                    </div>
                    <div className="rounded-lg bg-green-500/5 border border-green-500/15 p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-1">Say this</p>
                      <p className="text-sm text-green-400">&ldquo;While I haven&apos;t worked with [X] directly, I have strong experience with [related skill], and I&apos;ve already started upskilling through [course/project].&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary border-l-2 border-card-border pl-3">Never apologize for a gap. Bridge it to what you DO have, then show you&apos;re already closing it. That&apos;s initiative.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
           STAR TEMPLATES TAB
           ============================================================
           Static fill-in-the-blank STAR frameworks for common
           behavioral interview questions. Zero AI calls.
           ============================================================ */}
        {activeTab === "star" && (
          <div>
            <h2 className="text-xl font-bold mb-2">STAR Answer Templates</h2>
            <p className="text-text-secondary text-sm mb-6">Fill-in-the-blank frameworks for common behavioral questions. Practice filling these with your real experience.</p>

            <div className="space-y-6">

              {/* ---- Template 1: Conflict ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-3 bg-brand-indigo/10 border-b border-card-border">
                  <p className="text-sm font-semibold text-white italic">&ldquo;Tell me about a time you had a conflict with a coworker.&rdquo;</p>
                </div>
                <div className="p-4 space-y-4">
                  {/* S */}
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">S</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Situation</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">While working on <em>[project]</em> at <em>[company]</em>, a teammate and I disagreed on <em>[the specific decision]</em>.</p>
                      </div>
                    </div>
                  </div>
                  {/* T */}
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">T</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Task</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">We needed to reach a decision by <em>[deadline]</em> because <em>[what was at stake]</em>.</p>
                      </div>
                    </div>
                  </div>
                  {/* A */}
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">A</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Action</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I scheduled a 1-on-1, listened to their perspective first, then proposed <em>[your compromise or data-driven approach]</em>.</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">Tip: Show you listened, didn&apos;t escalate, and found a solution together.</p>
                    </div>
                  </div>
                  {/* R */}
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">R</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Result</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">The approach worked — <em>[measurable outcome]</em>. We also established <em>[process improvement]</em> to prevent similar issues.</p>
                      </div>
                    </div>
                  </div>
                  {/* Example */}
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4 mt-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-2">Example completed answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed">While building the checkout redesign at Acme Corp, a teammate and I disagreed on whether to prioritize speed or accessibility. We needed to decide within two days because QA was waiting. I set up a quick call, heard their concerns about load time, then proposed we run a Lighthouse audit on both approaches. The data showed we could hit both targets with lazy-loaded components. We shipped on time, and the page scored 94 on accessibility with a 1.2s load time.</p>
                  </div>
                </div>
              </div>

              {/* ---- Template 2: Initiative ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-3 bg-brand-indigo/10 border-b border-card-border">
                  <p className="text-sm font-semibold text-white italic">&ldquo;Tell me about a time you took initiative without being asked.&rdquo;</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">S</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Situation</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I noticed that <em>[a recurring problem]</em> at <em>[company]</em> was costing the team <em>[time/money/quality]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">T</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Task</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">No one had formally prioritized fixing it, but I saw an opportunity to <em>[the improvement]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">A</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Action</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">On my own time, I <em>[built/researched/prototyped]</em> a solution using <em>[tool/approach]</em>. I presented it to <em>[who]</em> with a demo showing the before/after.</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">Tip: Show you saw the gap, took ownership, and brought a solution — not just a complaint.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">R</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Result</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">The team adopted it, saving <em>[hours/money]</em>. My manager <em>[recognized it / expanded it / gave me more ownership]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4 mt-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-2">Example completed answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed">I noticed our sales team was manually copying CRM data into spreadsheets every Friday — about 4 hours of work. Nobody had flagged it as a priority. I spent a weekend building an automated pipeline using Zapier and Google Sheets. I demoed it Monday, we rolled it out that week, and it freed up 16 hours of labor per month. My manager then asked me to audit other manual workflows.</p>
                  </div>
                </div>
              </div>

              {/* ---- Template 3: Failure ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-3 bg-brand-indigo/10 border-b border-card-border">
                  <p className="text-sm font-semibold text-white italic">&ldquo;Tell me about a time you failed.&rdquo;</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">S</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Situation</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">During <em>[project]</em> at <em>[company]</em>, I was responsible for <em>[your responsibility]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">T</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Task</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">The goal was to <em>[deliverable]</em> by <em>[deadline]</em>, and <em>[what depended on it]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">A</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Action</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I made the mistake of <em>[specific mistake]</em>. As a result, <em>[what went wrong]</em>.</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">Tip: Name the real mistake honestly. Vague failures (&ldquo;I worked too hard&rdquo;) sound rehearsed.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">R</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Result</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I took accountability, then <em>[how you fixed it]</em>. The lesson I applied since: <em>[behavioral change + proof]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4 mt-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-2">Example completed answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed">During a product launch, I was responsible for the payment API integration. I underestimated international transaction edge cases and didn&apos;t flag the risk early enough — we missed launch by a week. I took full accountability in the retro, documented every edge case, and created a pre-launch integration checklist the team still uses. On the next launch, we shipped two days early.</p>
                  </div>
                </div>
              </div>

              {/* ---- Template 4: Leadership under pressure ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-3 bg-brand-indigo/10 border-b border-card-border">
                  <p className="text-sm font-semibold text-white italic">&ldquo;Describe a time you had to lead under pressure.&rdquo;</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">S</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Situation</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">During <em>[critical moment — e.g., outage, tight deadline, team crisis]</em> at <em>[company]</em>, <em>[what happened]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">T</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Task</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I needed to <em>[immediate goal]</em> while keeping the team <em>[calm/focused/aligned]</em> under <em>[time constraint]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">A</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Action</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I <em>[took charge by doing X]</em>, delegated <em>[Y to whom]</em>, and communicated <em>[Z to stakeholders]</em>.</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">Tip: Show calm decision-making, clear delegation, and stakeholder communication.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">R</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Result</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">We resolved it in <em>[timeframe]</em> with <em>[outcome]</em>. The experience led to <em>[lasting improvement]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4 mt-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-2">Example completed answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed">Our main API went down during a product demo to a key client. I immediately organized a war room — assigned one engineer to the fix, another to draft client comms, and kept our VP updated every 15 minutes. We restored service in 40 minutes. I then wrote the post-mortem and implemented automated alerting that caught the next issue before it reached production.</p>
                  </div>
                </div>
              </div>

              {/* ---- Template 5: Achievement ---- */}
              <div className="rounded-xl border border-card-border overflow-hidden">
                <div className="px-4 py-3 bg-brand-indigo/10 border-b border-card-border">
                  <p className="text-sm font-semibold text-white italic">&ldquo;What&apos;s your greatest professional achievement?&rdquo;</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">S</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Situation</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">At <em>[company]</em>, the team was facing <em>[challenge or opportunity]</em> that no one had tackled.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">T</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Task</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I stepped up to <em>[own/lead/design]</em> the solution, with the goal of <em>[specific target]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">A</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Action</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">I <em>[specific actions — research, build, coordinate, present]</em> over <em>[timeframe]</em>, working with <em>[who]</em>.</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">Tip: Pick an achievement relevant to the role you&apos;re applying for, not just the most impressive one.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">R</div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">Result</p>
                      <div className="rounded-lg bg-brand-indigo/5 border border-dashed border-brand-indigo/25 p-3">
                        <p className="text-sm text-brand-light">The outcome was <em>[quantified result]</em>. It became <em>[lasting impact — adopted company-wide, promoted, recognized]</em>.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4 mt-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-400 mb-2">Example completed answer</p>
                    <p className="text-sm text-text-secondary leading-relaxed">At my previous company, customer churn was at 8% monthly and no one had a data-driven approach to fix it. I proposed and built a predictive churn model using our CRM and usage data, then partnered with the success team to create targeted intervention workflows. Within three months, churn dropped to 4.5%. The model was adopted across all regions and I was asked to present the approach at our all-hands.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
