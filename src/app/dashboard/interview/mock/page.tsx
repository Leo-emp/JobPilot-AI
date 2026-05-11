/* ============================================================
   INTERACTIVE MOCK INTERVIEW — Video Interview Simulation
   ============================================================
   Realistic interview experience with:
   - User's live webcam feed (practice body language & eye contact)
   - AI interviewer with avatar and speaking animation
   - Voice input via browser Speech Recognition API (free)
   - AI speaks questions aloud via SpeechSynthesis API (free)
   - Real-time feedback after each answer
   - Final score dashboard with detailed breakdown
   ============================================================ */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

/* ---- Types ---- */
interface QuestionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
  starAnalysis: { situation: boolean; task: boolean; action: boolean; result: boolean };
}

interface InterviewResult {
  question: string;
  answer: string;
  feedback: QuestionFeedback;
}

interface FinalScore {
  overallScore: number;
  categories: Record<string, number>;
  topStrengths: string[];
  keyImprovements: string[];
  overallFeedback: string;
  readinessLevel: string;
}

type Phase = "setup" | "interview" | "results";

/* ---- Helper: call AI endpoint ---- */
async function callAI(action: string, payload: Record<string, string>): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data.result;
}

/* ---- Helper: parse JSON from AI response (strips code fences) ---- */
function parseAIJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

/* ---- Helper: speak text aloud ---- */
function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    /* Try to pick a natural-sounding English voice */
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.includes("Female"))
      || voices.find(v => v.lang.startsWith("en") && v.localService)
      || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

/* ============================================================ */
export default function MockInterviewPage() {
  /* ---- Phase state ---- */
  const [phase, setPhase] = useState<Phase>("setup");

  /* ---- Setup form ---- */
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("Mid-level");
  const [interviewType, setInterviewType] = useState("Behavioral");
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Interview state ---- */
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionFeedback | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  /* ---- Results state ---- */
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  /* ---- Shared state ---- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---- Refs ---- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Webcam ---- */
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      /* Webcam not available — interview still works without it */
    }
  }, []);

  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  /* ---- Timer ---- */
  useEffect(() => {
    if (phase === "interview") {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  /* ---- Resume File Upload ---- */
  const handleResumeUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum 5MB.");
      return;
    }

    /* .txt files: read client-side */
    if (file.name.endsWith(".txt")) {
      const text = await file.text();
      setResume(text);
      setResumeFileName(file.name);
      return;
    }

    /* .pdf files: send to server for parsing */
    if (file.name.endsWith(".pdf")) {
      setResumeUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResume(data.text);
        setResumeFileName(file.name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse resume file");
      } finally {
        setResumeUploading(false);
      }
      return;
    }

    setError("Unsupported file type. Upload a PDF or TXT file.");
  };

  /* ---- Speech Recognition ---- */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim = event.results[i][0].transcript;
        }
      }
      setUserAnswer(finalTranscript + interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  /* ---- Start Interview ---- */
  const handleStartInterview = async () => {
    if (!role.trim()) { setError("Please enter the role you're interviewing for."); return; }
    setLoading(true);
    setError("");

    try {
      const result = await callAI("mock_interview_start", {
        role, industry, experience, interviewType, company, resume,
      });
      const parsed = parseAIJson<string[]>(result);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No questions generated");
      setQuestions(parsed);
      setCurrentQ(0);
      setResults([]);
      setElapsedTime(0);
      setPhase("interview");
      await startWebcam();

      /* Load voices then speak first question */
      setTimeout(async () => {
        setIsSpeaking(true);
        await speakText(parsed[0]);
        setIsSpeaking(false);
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Submit Answer ---- */
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    stopListening();
    setIsEvaluating(true);
    setShowFeedback(false);

    try {
      const result = await callAI("mock_interview_evaluate", {
        question: questions[currentQ],
        answer: userAnswer,
        role,
        interviewType,
      });
      const feedback = parseAIJson<QuestionFeedback>(result);
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      setResults(prev => [...prev, { question: questions[currentQ], answer: userAnswer, feedback }]);
    } catch {
      setCurrentFeedback({ score: 5, strengths: ["Answer recorded"], improvements: ["Could not evaluate"], betterAnswer: "", starAnalysis: { situation: false, task: false, action: false, result: false } });
      setShowFeedback(true);
      setResults(prev => [...prev, { question: questions[currentQ], answer: userAnswer, feedback: { score: 5, strengths: ["Recorded"], improvements: ["Evaluation unavailable"], betterAnswer: "", starAnalysis: { situation: false, task: false, action: false, result: false } } }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  /* ---- Next Question ---- */
  const handleNextQuestion = async () => {
    const next = currentQ + 1;
    if (next >= questions.length) {
      await handleFinishInterview();
      return;
    }
    setCurrentQ(next);
    setUserAnswer("");
    setShowFeedback(false);
    setCurrentFeedback(null);

    setIsSpeaking(true);
    await speakText(questions[next]);
    setIsSpeaking(false);
  };

  /* ---- Finish Interview ---- */
  const handleFinishInterview = async () => {
    stopWebcam();
    stopListening();
    window.speechSynthesis?.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setLoadingResults(true);
    setPhase("results");

    try {
      const transcript = results.map((r, i) =>
        `Q${i + 1}: ${r.question}\nAnswer: ${r.answer}\nScore: ${r.feedback.score}/10`
      ).join("\n\n");

      const result = await callAI("mock_interview_summary", {
        role, interviewType, transcript,
      });
      const score = parseAIJson<FinalScore>(result);
      setFinalScore(score);
    } catch {
      setFinalScore({
        overallScore: 0, categories: {}, topStrengths: [], keyImprovements: [],
        overallFeedback: "Could not generate final assessment.", readinessLevel: "Unknown",
      });
    } finally {
      setLoadingResults(false);
    }
  };

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      stopWebcam();
      stopListening();
      window.speechSynthesis?.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopWebcam, stopListening]);

  /* ============================================================
     RENDER: SETUP PHASE
     ============================================================ */
  if (phase === "setup") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard/interview" className="text-text-secondary hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
            Mock Interview
          </h1>
        </div>
        <p className="text-text-secondary mb-8">
          Practice in a realistic video interview simulation with AI feedback.
        </p>

        <div className="max-w-2xl space-y-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Role You&apos;re Interviewing For *</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, Sales Executive"
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g., Tech, Finance, Consulting, Healthcare"
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Experience Level + Interview Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Experience Level</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors"
              >
                <option value="Fresh Graduate">Fresh Graduate</option>
                <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                <option value="Mid-level">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
                <option value="Leadership">Leadership / Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Interview Type</label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors"
              >
                <option value="Behavioral">Behavioral</option>
                <option value="Technical">Technical</option>
                <option value="Case Interview">Case Interview</option>
                <option value="HR Screening">HR Screening</option>
                <option value="Final Round">Final Round</option>
                <option value="Mixed">Mixed (All Types)</option>
              </select>
            </div>
          </div>

          {/* Company (optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Target Company <span className="text-text-muted">(optional — enables company-specific questions)</span></label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g., Google, Amazon, McKinsey, Deloitte"
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Resume Upload (optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Your Resume <span className="text-text-muted">(optional — AI asks about your real experience)</span></label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }}
            />

            {!resume ? (
              /* Upload zone */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-brand-indigo/50"); }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-indigo/50"); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-brand-indigo/50"); const f = e.dataTransfer.files[0]; if (f) handleResumeUpload(f); }}
                className="w-full px-4 py-8 rounded-xl bg-space-700 border-2 border-dashed border-card-border text-center cursor-pointer hover:border-brand-indigo/40 transition-colors"
              >
                {resumeUploading ? (
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Extracting text from resume...
                  </div>
                ) : (
                  <>
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-white font-medium">Drop your resume here or click to upload</p>
                    <p className="text-sm text-text-muted mt-1">PDF or TXT — max 5MB</p>
                  </>
                )}
              </div>
            ) : (
              /* Resume loaded — show preview */
              <div className="w-full rounded-xl bg-space-700 border border-card-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-space-600/50 border-b border-card-border">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <span className="text-sm text-white font-medium">{resumeFileName || "Pasted resume"}</span>
                    <span className="text-xs text-text-muted">({resume.length.toLocaleString()} chars)</span>
                  </div>
                  <button
                    onClick={() => { setResume(""); setResumeFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="px-4 py-3 max-h-28 overflow-y-auto">
                  <p className="text-xs text-text-muted whitespace-pre-wrap line-clamp-4">{resume.slice(0, 500)}{resume.length > 500 ? "..." : ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20">
            <p className="text-sm text-text-secondary">
              <span className="text-brand-light font-medium">How it works:</span> The AI interviewer will ask you 6 questions one by one.
              You can answer by <strong className="text-white">speaking into your microphone</strong> or typing.
              Your <strong className="text-white">webcam</strong> will be shown so you can practice body language and eye contact.
              After each answer, you&apos;ll get instant feedback. A final score dashboard is shown at the end.
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Start button */}
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Preparing your interview...
              </span>
            ) : "Start Mock Interview"}
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER: INTERVIEW PHASE
     ============================================================ */
  if (phase === "interview") {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* ---- Top bar: timer + progress + end ---- */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-text-secondary bg-space-700 px-3 py-1.5 rounded-lg">
              {formatTime(elapsedTime)}
            </span>
            <span className="text-sm text-text-secondary">
              Question <span className="text-white font-semibold">{currentQ + 1}</span> of {questions.length}
            </span>
          </div>
          <button
            onClick={handleFinishInterview}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            End Interview
          </button>
        </div>

        {/* ---- Progress bar ---- */}
        <div className="w-full h-1.5 bg-space-700 rounded-full mb-5">
          <div
            className="h-full bg-gradient-to-r from-brand-indigo to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {/* ---- Main interview area ---- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">

          {/* ---- LEFT: AI Interviewer + Question ---- */}
          <div className="flex flex-col gap-4">
            {/* AI Interviewer card */}
            <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-indigo to-purple-500 flex items-center justify-center text-2xl">
                    👩‍💼
                  </div>
                  {isSpeaking && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-space-700 animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah Mitchell</p>
                  <p className="text-sm text-text-secondary">AI Interviewer{company ? ` • ${company}` : ""}</p>
                </div>
                {isSpeaking && (
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-1 h-3 bg-green-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                    <div className="w-1 h-5 bg-green-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s]" />
                    <div className="w-1 h-4 bg-green-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s]" />
                    <div className="w-1 h-6 bg-green-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.45s]" />
                    <div className="w-1 h-3 bg-green-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.6s]" />
                  </div>
                )}
              </div>

              {/* Current question */}
              <div className="p-4 rounded-xl bg-space-600/50 border border-card-border/50">
                <p className="text-white leading-relaxed text-[15px]">{questions[currentQ]}</p>
              </div>
            </div>

            {/* Feedback panel (shown after evaluation) */}
            {showFeedback && currentFeedback && (
              <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Feedback</h3>
                  <span className={`text-lg font-bold ${currentFeedback.score >= 7 ? "text-green-400" : currentFeedback.score >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                    {currentFeedback.score}/10
                  </span>
                </div>

                {/* STAR indicators */}
                <div className="flex gap-2 mb-4">
                  {(["situation", "task", "action", "result"] as const).map(key => (
                    <span
                      key={key}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${currentFeedback.starAnalysis[key] ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-space-600 text-text-muted border border-card-border"}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  ))}
                </div>

                {currentFeedback.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-green-400 mb-1">Strengths</p>
                    {currentFeedback.strengths.map((s, i) => (
                      <p key={i} className="text-sm text-text-secondary ml-3">• {s}</p>
                    ))}
                  </div>
                )}
                {currentFeedback.improvements.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-yellow-400 mb-1">Improvements</p>
                    {currentFeedback.improvements.map((s, i) => (
                      <p key={i} className="text-sm text-text-secondary ml-3">• {s}</p>
                    ))}
                  </div>
                )}
                {currentFeedback.betterAnswer && (
                  <div>
                    <p className="text-sm font-medium text-brand-light mb-1">Better Answer</p>
                    <p className="text-sm text-text-secondary italic">&ldquo;{currentFeedback.betterAnswer}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- RIGHT: Webcam + Answer area ---- */}
          <div className="flex flex-col gap-4">
            {/* Webcam feed */}
            <div className="relative rounded-2xl overflow-hidden bg-space-800 border border-card-border aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }}
              />
              {/* Overlay: name badge */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                <p className="text-xs text-white font-medium">You • {role}</p>
              </div>
              {/* Recording indicator */}
              {isListening && (
                <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs text-white font-medium">Recording</span>
                </div>
              )}
            </div>

            {/* Answer input area */}
            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder={isListening ? "Listening... speak your answer" : "Type your answer or click the mic to speak..."}
                rows={4}
                disabled={showFeedback}
                className="flex-1 w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors resize-none disabled:opacity-50"
              />

              {/* Controls */}
              <div className="flex items-center gap-3">
                {!showFeedback ? (
                  <>
                    {/* Mic toggle */}
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`p-3 rounded-xl border transition-all ${isListening ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30" : "bg-space-600 border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30"}`}
                      title={isListening ? "Stop recording" : "Start speaking"}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    </button>

                    {/* Submit answer */}
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || isEvaluating}
                      className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isEvaluating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Evaluating...
                        </span>
                      ) : "Submit Answer"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all"
                  >
                    {currentQ + 1 >= questions.length ? "See Final Results" : `Next Question (${currentQ + 2}/${questions.length})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER: RESULTS PHASE
     ============================================================ */
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard/interview" className="text-text-secondary hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">
          Interview Results
        </h1>
      </div>
      <p className="text-text-secondary mb-8">
        {role} • {interviewType} Interview • {formatTime(elapsedTime)}
      </p>

      {loadingResults ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-brand-indigo mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-text-secondary">Generating your final assessment...</p>
        </div>
      ) : finalScore ? (
        <div className="space-y-6">
          {/* ---- Overall Score Card ---- */}
          <div className="p-6 rounded-2xl bg-space-700/80 border border-card-border text-center">
            <div className={`text-6xl font-bold mb-2 ${finalScore.overallScore >= 70 ? "text-green-400" : finalScore.overallScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {finalScore.overallScore}
            </div>
            <p className="text-text-secondary text-lg">out of 100</p>
            <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${
              finalScore.readinessLevel === "Excellent" || finalScore.readinessLevel === "Interview Ready"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : finalScore.readinessLevel === "Almost There"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}>
              {finalScore.readinessLevel}
            </span>
            {finalScore.overallFeedback && (
              <p className="mt-4 text-text-secondary text-sm max-w-xl mx-auto">{finalScore.overallFeedback}</p>
            )}
          </div>

          {/* ---- Category Scores ---- */}
          {Object.keys(finalScore.categories).length > 0 && (
            <div className="p-6 rounded-2xl bg-space-700/80 border border-card-border">
              <h3 className="font-semibold text-white mb-4">Skill Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(finalScore.categories).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold ${val >= 7 ? "text-green-400" : val >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                      {val}
                    </div>
                    <p className="text-xs text-text-secondary mt-1 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                    <div className="mt-2 h-1.5 bg-space-600 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${val >= 7 ? "bg-green-400" : val >= 5 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${val * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- Strengths & Improvements ---- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {finalScore.topStrengths.length > 0 && (
              <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
                <h3 className="font-semibold text-green-400 mb-3">Top Strengths</h3>
                {finalScore.topStrengths.map((s, i) => (
                  <p key={i} className="text-sm text-text-secondary mb-2">✓ {s}</p>
                ))}
              </div>
            )}
            {finalScore.keyImprovements.length > 0 && (
              <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
                <h3 className="font-semibold text-yellow-400 mb-3">Key Improvements</h3>
                {finalScore.keyImprovements.map((s, i) => (
                  <p key={i} className="text-sm text-text-secondary mb-2">→ {s}</p>
                ))}
              </div>
            )}
          </div>

          {/* ---- Per-Question Breakdown ---- */}
          <div className="p-6 rounded-2xl bg-space-700/80 border border-card-border">
            <h3 className="font-semibold text-white mb-4">Question-by-Question Review</h3>
            <div className="space-y-4">
              {results.map((r, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-space-600/50 hover:bg-space-600 transition-colors">
                    <span className="text-sm text-white">Q{i + 1}: {r.question.slice(0, 80)}{r.question.length > 80 ? "..." : ""}</span>
                    <span className={`text-sm font-bold ml-3 ${r.feedback.score >= 7 ? "text-green-400" : r.feedback.score >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                      {r.feedback.score}/10
                    </span>
                  </summary>
                  <div className="mt-2 ml-3 p-3 rounded-xl bg-space-800/50 space-y-2">
                    <p className="text-sm text-text-secondary"><span className="text-text-muted">Your answer:</span> {r.answer}</p>
                    {r.feedback.strengths.map((s, j) => (
                      <p key={j} className="text-sm text-green-400/80">✓ {s}</p>
                    ))}
                    {r.feedback.improvements.map((s, j) => (
                      <p key={j} className="text-sm text-yellow-400/80">→ {s}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* ---- Action buttons ---- */}
          <div className="flex gap-4">
            <button
              onClick={() => { setPhase("setup"); setFinalScore(null); setResults([]); setQuestions([]); setError(""); }}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-indigo to-purple-500 text-white hover:from-brand-indigo/90 hover:to-purple-500/90 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/dashboard/interview"
              className="flex-1 py-3 rounded-xl font-semibold text-center bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all"
            >
              Back to Interview Prep
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
