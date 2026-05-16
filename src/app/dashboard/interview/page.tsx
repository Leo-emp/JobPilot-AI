/* ============================================================
   INTERVIEW PREP PAGE
   ============================================================
   Two-tab interface:
   Tab 1: Generate predicted interview questions for a role
   Tab 2: Practice answering questions with AI coaching
   ============================================================ */

"use client";

import { useState } from "react";
import Link from "next/link";
import MarkdownResult from "@/components/MarkdownResult";
import { useAIStream } from "@/hooks/useAIStream";

export default function InterviewPage() {
  /* Tab state */
  const [activeTab, setActiveTab] = useState<"predict" | "practice">("predict");

  /* Predict tab fields */
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState("");

  /* Practice tab fields */
  const [resumeText, setResumeText] = useState("");
  const [practiceQuestion, setPracticeQuestion] = useState("");
  const [practiceDesc, setPracticeDesc] = useState("");
  const [answer, setAnswer] = useState("");

  /* AI streaming hook */
  const { result: streamResult, loading, streaming, error, callAI: streamAI, reset: resetAI } = useAIStream();

  /* Generate interview questions */
  const handlePredict = async () => {
    setQuestions("");
    const fullResult = await streamAI("interview_questions", {
      jobTitle,
      company,
      jobDescription,
    });
    if (fullResult) setQuestions(fullResult);
  };

  /* Generate answer to a practice question */
  const handlePractice = async () => {
    setAnswer("");
    const fullResult = await streamAI("interview_answer", {
      question: practiceQuestion,
      resume: resumeText,
      jobDescription: practiceDesc,
    });
    if (fullResult) setAnswer(fullResult);
  };

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
        </button>
      </div>

      <div className="glass-card p-6 sm:p-8">
        {/* ---- Predict Questions Tab ---- */}
        {activeTab === "predict" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Predict Interview Questions</h2>
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
              placeholder="Paste the job description..."
              rows={5}
              className="w-full px-4 py-3 mb-4 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
            />
            <button
              onClick={handlePredict}
              disabled={!jobTitle || !company || !jobDescription || loading}
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
              </div>
            )}
          </div>
        )}

        {/* ---- Practice Answers Tab ---- */}
        {activeTab === "practice" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Practice Your Answers</h2>
            <div className="space-y-4 mb-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text for personalized answers..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
              <input
                type="text"
                value={practiceQuestion}
                onChange={(e) => setPracticeQuestion(e.target.value)}
                placeholder="Enter an interview question..."
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm"
              />
              <textarea
                value={practiceDesc}
                onChange={(e) => setPracticeDesc(e.target.value)}
                placeholder="Job description (optional, for context)..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo resize-none text-sm"
              />
            </div>
            <button
              onClick={handlePractice}
              disabled={!practiceQuestion || !resumeText || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "💬 Generate Answer"}
            </button>

            {(streaming && activeTab === "practice" ? streamResult : answer) && (
              <div>
                <MarkdownResult result={streaming && activeTab === "practice" ? streamResult : answer} showDownload={false} />
                {streaming && activeTab === "practice" && (
                  <div className="mt-3 flex items-center gap-2 text-brand-light text-sm">
                    <div className="w-2 h-2 bg-brand-indigo rounded-full animate-pulse" />
                    <span>Generating...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading (before stream starts) */}
        {loading && !streaming && !streamResult && (
          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Connecting to AI...</span>
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
