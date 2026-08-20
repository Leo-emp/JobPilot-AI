/* ============================================================
   INTERACTIVE MOCK INTERVIEW — Google Meet Style
   ============================================================
   Realistic video-call interview experience with:
   - Google Meet-style layout (side-by-side video tiles)
   - Animated AI interviewer avatar with speaking/idle states
   - Adaptive conversation (AI responds to your actual answers)
   - High-quality female TTS voice (warm, professional)
   - Live webcam feed for body language practice
   - Voice input via Speech Recognition API
   - Classic + role-specific interview questions
   - Final score dashboard with per-question breakdown
   ============================================================ */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { COMPANY_CATEGORIES, COMPANY_PROFILES, getCompanySlugsForCategory, buildCompanyPromptBlock, type CompanyCategory } from "@/lib/companyProfiles";
import { useDefaultResume } from "@/hooks/useDefaultResume";

/* ---- Types ---- */
/* Each message in the conversation (AI or user) */
interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

/* Per-question score returned in the final summary */
interface QuestionScore {
  question: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

/* Final assessment after the interview */
interface FinalScore {
  overallScore: number;
  categories: Record<string, number>;
  questionScores: QuestionScore[];
  topStrengths: string[];
  keyImprovements: string[];
  overallFeedback: string;
  readinessLevel: string;
}

/* Three phases of the interview flow */
type Phase = "setup" | "interview" | "results";

/* ---- Constants ---- */
/* Max exchanges as a safety limit — AI decides when to wrap up naturally */
const MAX_EXCHANGES = 30;

/* ---- Helper: call the /api/ai endpoint (non-streaming for scoring) ---- */
async function callAI(action: string, payload: Record<string, string>): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "AI request failed");
  if (!data?.result) throw new Error("No response from AI");
  return data.result;
}

/* ---- Helper: stream AI response, calling onToken for each chunk ---- */
async function streamAI(
  action: string,
  payload: Record<string, string>,
  onToken: (text: string) => void
): Promise<string> {
  const res = await fetch("/api/ai/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "AI request failed");
  }
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No stream available");
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    onToken(full);
  }
  return full;
}

/* ---- Helper: parse JSON from AI response (strips code fences) ---- */
function parseAIJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

/* ---- Helper: find the best female English voice for TTS ---- */
/* Priority order: Microsoft Neural voices (sound human on Win11) > Google > Apple > any English */
/* Microsoft Online/Neural voices (Jenny, Aria, Zira Online) are dramatically better than old TTS */
function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  /* Ordered preference list — first match wins */
  /* Google US voices are loud and clear on Chrome; Microsoft Neural are best on Edge/Win */
  const tests: ((v: SpeechSynthesisVoice) => boolean)[] = [
    /* Google Chrome voices — loud, clear, widely available */
    v => /Google US English/i.test(v.name) && v.lang.startsWith("en-US"),
    v => v.name.includes("Google") && v.lang.startsWith("en-US"),
    v => v.name.includes("Google") && v.lang.startsWith("en"),
    /* Windows 11 Neural voices — sound natural on Edge */
    v => /Microsoft.*Jenny.*Online/i.test(v.name),
    v => /Microsoft.*Aria.*Online/i.test(v.name),
    v => /Microsoft.*Jenny/i.test(v.name),
    v => /Microsoft.*Aria/i.test(v.name),
    v => /Microsoft.*Zira/i.test(v.name),
    /* Mac voices */
    v => v.name.includes("Samantha"),
    v => v.name.includes("Karen"),
    /* Any English female */
    v => v.lang.startsWith("en") && /female|woman/i.test(v.name),
    /* Any English voice (prefer US) */
    v => v.lang === "en-US",
    v => v.lang.startsWith("en"),
  ];

  for (const test of tests) {
    const match = voices.find(test);
    if (match) return match;
  }
  return voices[0];
}

/* ---- Cached voice reference (avoids re-searching every utterance) ---- */
let cachedVoice: SpeechSynthesisVoice | null = null;

/* ---- Helper: speak text aloud — single utterance for gapless flow ---- */
/* One utterance = no inter-sentence pauses. Faster rate + higher pitch = energetic. */
/* Chrome pauses long utterances after ~15s — a periodic resume() keeps it flowing. */
function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();

    if (!cachedVoice) cachedVoice = getBestVoice();
    if (!text.trim()) { resolve(); return; }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.15;
    utterance.volume = 1.0;
    if (cachedVoice) utterance.voice = cachedVoice;

    /* Chrome bug workaround: resume every 5s to prevent stalling on long text */
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
    }, 5000);

    /* Safety timeout: if TTS hangs (Chrome bug), force-resolve after 30s */
    const timeout = setTimeout(() => {
      clearInterval(keepAlive);
      window.speechSynthesis.cancel();
      resolve();
    }, 30000);

    utterance.onend = () => { clearTimeout(timeout); clearInterval(keepAlive); resolve(); };
    utterance.onerror = () => { clearTimeout(timeout); clearInterval(keepAlive); resolve(); };

    window.speechSynthesis.speak(utterance);
  });
}

/* ---- Helper: create a single TTS utterance with the cached voice ---- */
function makeUtterance(text: string): SpeechSynthesisUtterance {
  if (!cachedVoice) cachedVoice = getBestVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1.15;
  u.volume = 1.0;
  if (cachedVoice) u.voice = cachedVoice;
  return u;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function MockInterviewPage() {
  /* ---- Phase state ---- */
  const [phase, setPhase] = useState<Phase>("setup");

  /* ---- Setup form fields ---- */
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("Mid-level");
  const [interviewType, setInterviewType] = useState("Behavioral");
  const [companyCategory, setCompanyCategory] = useState<CompanyCategory | "manual" | "">("");
  const [companySlug, setCompanySlug] = useState("");
  const [company, setCompany] = useState("");
  const [companyPromptBlock, setCompanyPromptBlock] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Auto-load user's default resume */
  const { defaultResume } = useDefaultResume();
  const [prevDefault, setPrevDefault] = useState(defaultResume);
  if (defaultResume && defaultResume !== prevDefault) {
    setPrevDefault(defaultResume);
    setResume(defaultResume.content);
    setResumeFileName(defaultResume.fileName);
  }

  /* ---- Interview conversation state ---- */
  const [messages, setMessages] = useState<ChatMessage[]>([]);          /* full conversation log */
  const [currentAIMessage, setCurrentAIMessage] = useState("");         /* currently displayed AI message */
  const [exchangeNumber, setExchangeNumber] = useState(0);              /* tracks which exchange we're on */
  const [questionNumber, setQuestionNumber] = useState(0);              /* tracks actual question count (not exchanges) */
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]); /* questions user skipped */
  const [userAnswer, setUserAnswer] = useState("");                     /* what the user is typing/saying */
  const [isAISpeaking, setIsAISpeaking] = useState(false);              /* AI voice is playing */
  const [isAIThinking, setIsAIThinking] = useState(false);              /* waiting for AI response */
  const [isListening, setIsListening] = useState(false);                /* mic is recording */
  const [elapsedTime, setElapsedTime] = useState(0);                    /* seconds since interview started */
  const [waitingForUser, setWaitingForUser] = useState(false);          /* AI finished speaking, user's turn */

  /* ---- Results state ---- */
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  /* ---- Webcam state (triggers re-render so video element gets the stream) ---- */
  const [webcamReady, setWebcamReady] = useState(false);

  /* ---- Shared state ---- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---- Refs ---- */
  const videoRef = useRef<HTMLVideoElement>(null);                      /* user's webcam element */
  const streamRef = useRef<MediaStream | null>(null);                   /* webcam MediaStream */
  const recognitionRef = useRef<SpeechRecognition | null>(null);        /* speech recognition instance */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); /* interview timer */
  const messagesRef = useRef<ChatMessage[]>([]);                        /* sync ref for messages in closures */
  const spokenLenRef = useRef(0);                                       /* chars already sent to TTS */
  const ttsKeepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);                                   /* guard: ignore late recognition results after submit */
  const questionBankRef = useRef<string[]>([]);                          /* pre-generated question bank for faster responses */

  /* Keep messagesRef in sync with messages state */
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  /* ---- Preload browser voices and cache the best one ---- */
  /* Chrome loads voices asynchronously — this ensures they're ready before the interview starts */
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const cacheVoice = () => {
        cachedVoice = getBestVoice();
      };
      window.speechSynthesis.getVoices();
      cacheVoice();
      window.speechSynthesis.onvoiceschanged = cacheVoice;
    }
  }, []);

  /* ---- Webcam: request camera + mic with graceful fallbacks ---- */
  /* Try video+audio → video-only → audio-only → continue without media.
     Each fallback ensures the interview works regardless of permissions. */
  const startWebcam = useCallback(async () => {
    /* Best case: video + audio together */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setWebcamReady(true);
      return;
    } catch { /* fall through to next attempt */ }

    /* Fallback 1: video only (mic might be blocked separately) */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setWebcamReady(true);
      return;
    } catch { /* fall through */ }

    /* Fallback 2: audio only (camera blocked but mic allowed) */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      streamRef.current = stream;
      return;
    } catch { /* all media blocked — interview continues without */ }
  }, []);

  /* ---- Webcam: stop user's camera ---- */
  const stopWebcam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setWebcamReady(false);
  }, []);

  /* ---- Connect webcam stream to video element after DOM renders ---- */
  /* Runs on phase change AND webcamReady change. Also retries after a
     short delay to handle cases where the video element isn't in the
     DOM yet when the stream becomes available. */
  useEffect(() => {
    const connect = () => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    };
    if (phase === "interview" && (webcamReady || streamRef.current)) {
      connect();
      const retry = setTimeout(connect, 500);
      return () => clearTimeout(retry);
    }
  }, [webcamReady, phase]);

  /* ---- Auto-start mic when it's the user's turn ---- */
  /* Silently attempts to start — if mic permission was already granted via */
  /* the webcam setup (audio:true), this works instantly. If not, fails */
  /* silently and user can click the mic button manually. */
  /* ---- Timer: count seconds while in interview phase ---- */
  useEffect(() => {
    if (phase === "interview") {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  /* Format seconds as M:SS */
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ---- Resume File Upload (PDF parsed client-side, TXT read directly) ---- */
  const handleResumeUpload = async (file: File) => {
    /* Reject files over 5MB */
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

    /* .pdf files: parse client-side with pdfjs-dist (no server needed) */
    if (file.name.endsWith(".pdf")) {
      setResumeUploading(true);
      setError("");
      try {
        const text = await extractTextFromPdf(file);
        if (!text.trim()) throw new Error("Could not extract text from PDF");
        setResume(text.trim());
        setResumeFileName(file.name);
      } catch (e) {
        setError("Failed to parse this file. Please try a different PDF or use a .txt file instead.");
      } finally {
        setResumeUploading(false);
      }
      return;
    }

    setError("Unsupported file type. Upload a PDF or TXT file.");
  };

  /* ---- Speech Recognition: start listening to user's microphone ---- */
  /* First requests mic permission via getUserMedia (needed on some browsers), */
  /* then starts SpeechRecognition. If recognition dies (Chrome stops after ~60s */
  /* of silence), we auto-restart as long as isListening is true. */
  const startListening = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not supported in this browser. Please type your answer instead.");
      return;
    }

    /* Stop any existing recognition session */
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    (recognition as unknown as Record<string, unknown>).maxAlternatives = 1;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      /* Ignore late results after user has submitted their answer */
      if (submittedRef.current) return;
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

    recognition.onerror = (e: Event) => {
      const err = (e as unknown as { error?: string }).error || "";
      if (err === "no-speech" || err === "aborted") return;
      if (err === "not-allowed") {
        setIsListening(false);
        setError("Microphone blocked. Click the lock icon in your browser address bar, allow microphone, then reload the page.");
        return;
      }
      setIsListening(false);
      setError(`Mic error: ${err}. Try clicking the mic again.`);
    };

    /* Auto-restart if recognition stops while user is still supposed to be talking */
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try { recognition.start(); } catch { setIsListening(false); }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setError("");
    } catch {
      setError("Could not start microphone. Please try again or type your answer.");
    }
  }, []);

  /* ---- Speech Recognition: stop listening ---- */
  /* Clears the ref BEFORE stopping so the onend handler doesn't auto-restart */
  const stopListening = useCallback(() => {
    const ref = recognitionRef.current;
    recognitionRef.current = null;
    setIsListening(false);
    try { ref?.stop(); } catch { /* already stopped */ }
  }, []);

  /* ---- Auto-start mic: called explicitly after AI finishes speaking ---- */
  /* Self-contained — kills TTS, stops old recognition, waits for Chrome to
     release the audio system, then starts a fresh recognition with retries. */
  const autoStartMic = useCallback(() => {
    submittedRef.current = false;

    /* Force-cancel any lingering TTS so Chrome releases the audio system */
    window.speechSynthesis?.cancel();

    /* Kill any existing recognition instance cleanly */
    if (recognitionRef.current) {
      const old = recognitionRef.current;
      recognitionRef.current = null;
      try { old.stop(); } catch { /* already stopped */ }
    }
    setIsListening(false);

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    let attempts = 0;
    const tryStart = () => {
      attempts++;
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      (recognition as unknown as Record<string, unknown>).maxAlternatives = 1;
      recognition.lang = "en-US";
      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (submittedRef.current) return;
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

      recognition.onerror = (e: Event) => {
        const err = (e as unknown as { error?: string }).error || "";
        if (err === "no-speech" || err === "aborted") return;
        setIsListening(false);
        /* Retry on transient errors */
        if (attempts < 3) setTimeout(tryStart, 500);
      };

      recognition.onend = () => {
        /* Auto-restart if recognition dies while user is still talking */
        if (recognitionRef.current === recognition && !submittedRef.current) {
          try { recognition.start(); } catch { setIsListening(false); }
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch {
        /* Chrome wasn't ready — retry after a delay */
        if (attempts < 3) setTimeout(tryStart, 500);
      }
    };

    /* Wait 300ms for Chrome to fully release the audio system before starting */
    setTimeout(tryStart, 300);
  }, []);

  /* ---- Format conversation history as a string for the AI prompt ---- */
  const formatHistory = (msgs: ChatMessage[]) => {
    if (msgs.length === 0) return "";
    return msgs.map(m => `${m.role === "ai" ? "Sarah" : "Candidate"}: ${m.text}`).join("\n");
  };

  /* ---- Feed new complete sentences to TTS as they stream in ---- */
  const feedProgressiveTTS = useCallback((messageText: string) => {
    const already = spokenLenRef.current;
    const newText = messageText.slice(already);
    const sentenceRe = /[^.!?]*[.!?]+(?:\s|$)/g;
    let match;
    let consumed = 0;
    while ((match = sentenceRe.exec(newText)) !== null) {
      const sentence = match[0].trim();
      if (sentence) window.speechSynthesis.speak(makeUtterance(sentence));
      consumed = match.index + match[0].length;
    }
    if (consumed > 0) spokenLenRef.current = already + consumed;
  }, []);

  /* ---- Send a message to AI and get the next response (streaming) ---- */
  const getAIResponse = useCallback(async (currentMessages: ChatMessage[], exchNum: number) => {
    /* Pass the pre-generated question bank so AI can pick the next question
       instead of generating from scratch — dramatically reduces response time */
    const bankForExchange = questionBankRef.current.length > 0
      ? JSON.stringify(questionBankRef.current)
      : "";

    const result = await streamAI("mock_interview_respond", {
      role,
      industry,
      experience,
      interviewType,
      company,
      companyPromptBlock,
      jobDescription,
      resume,
      history: formatHistory(currentMessages),
      exchangeNumber: String(exchNum),
      questionNumber: String(questionNumber),
      skippedQuestions: JSON.stringify(skippedQuestions),
      questionBank: bankForExchange,
    }, (partial) => {
      let msgText = "";
      try {
        const parsed = parseAIJson<{ message: string }>(partial);
        if (parsed.message) msgText = parsed.message;
      } catch {
        const m = partial.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (m) msgText = m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      }
      if (msgText) {
        setCurrentAIMessage(msgText);
        feedProgressiveTTS(msgText);
      }
    });

    try {
      return parseAIJson<{ message: string; isComplete: boolean }>(result);
    } catch {
      return { message: result, isComplete: false };
    }
  }, [role, industry, experience, interviewType, company, companyPromptBlock, jobDescription, resume, questionNumber, skippedQuestions, feedProgressiveTTS]);

  /* ---- Start the interview: instant greeting, no AI wait ---- */
  /* The greeting is hardcoded so the interview starts in <1 second. */
  /* The first AI call happens after the user responds to the greeting. */
  const handleStartInterview = async () => {
    if (!role.trim()) { setError("Please enter the role you're interviewing for."); return; }
    setLoading(true);
    setError("");

    try {
      /* Request webcam + mic BEFORE entering interview phase so the
         browser permission prompt appears on the setup screen, not
         after the interview UI has already loaded. */
      await startWebcam();

      /* Switch to interview phase */
      setPhase("interview");
      setMessages([]);
      setExchangeNumber(0);
      setElapsedTime(0);

      /* Instant greeting — no AI call needed */
      const greetingText = `Hey! Great to have you here! I'm Sarah, and I'm really excited to be your interviewer today for the ${role} position${company ? ` at ${company}` : ""}. I've been looking forward to this — let's have a great conversation! Ready to dive in?`;
      const aiMsg: ChatMessage = { role: "ai", text: greetingText };
      setMessages([aiMsg]);
      setCurrentAIMessage(greetingText);

      /* Pre-generate all interview questions in the background while greeting plays.
         This runs in parallel with TTS so questions are ready before the user finishes responding. */
      streamAI("mock_interview_start", {
        role,
        industry,
        experience,
        interviewType,
        company,
        resume,
        jobDescription,
      }, () => {}).then(result => {
        try {
          const questions = parseAIJson<string[]>(result);
          if (Array.isArray(questions) && questions.length > 0) {
            questionBankRef.current = questions;
          }
        } catch { /* non-critical — AI will generate questions on the fly if this fails */ }
      }).catch(() => { /* silently ignore — fallback to on-the-fly generation */ });

      /* Speak the greeting immediately */
      setIsAISpeaking(true);
      await speakText(greetingText);
      setIsAISpeaking(false);
      setWaitingForUser(true);
      autoStartMic();
    } catch {
      setError("Could not start the interview. Please check your camera/mic permissions and try again.");
      setPhase("setup");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Submit the user's answer and get the AI's next response ---- */
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || isAIThinking || isAISpeaking) return;
    submittedRef.current = true;
    stopListening();
    setWaitingForUser(false);

    /* Add the user's message to conversation */
    const userMsg: ChatMessage = { role: "user", text: userAnswer.trim() };
    const updatedMessages = [...messagesRef.current, userMsg];
    setMessages(updatedMessages);
    setUserAnswer("");

    /* Increment both exchange and question counters */
    const nextExchange = exchangeNumber + 1;
    setExchangeNumber(nextExchange);
    setQuestionNumber(prev => prev + 1);

    /* Get AI's next response (streams text + speaks sentences progressively) */
    setIsAIThinking(true);
    setIsAISpeaking(true);
    spokenLenRef.current = 0;
    window.speechSynthesis.cancel();
    ttsKeepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
    }, 5000);
    try {
      const response = await getAIResponse(updatedMessages, nextExchange);
      const aiMsg: ChatMessage = { role: "ai", text: response.message };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentAIMessage(response.message);
      setIsAIThinking(false);

      /* Speak any remaining text not yet sent to TTS */
      const remaining = response.message.slice(spokenLenRef.current).trim();
      if (remaining) window.speechSynthesis.speak(makeUtterance(remaining));

      /* Wait for the speech queue to finish (max 25s to prevent Chrome hang) */
      await new Promise<void>(resolve => {
        const deadline = Date.now() + 25000;
        const check = () => {
          if (!window.speechSynthesis.speaking || Date.now() > deadline) {
            if (Date.now() > deadline) window.speechSynthesis.cancel();
            resolve();
            return;
          }
          setTimeout(check, 200);
        };
        setTimeout(check, 200);
      });
      if (ttsKeepAliveRef.current) clearInterval(ttsKeepAliveRef.current);
      setIsAISpeaking(false);
      /* If AI says interview is complete or we hit the safety limit */
      if (response.isComplete || nextExchange >= MAX_EXCHANGES - 1) {
        await handleFinishInterview([...updatedMessages, aiMsg]);
      } else {
        setUserAnswer("");
        setWaitingForUser(true);
        autoStartMic();
      }
    } catch {
      setIsAIThinking(false);
      setIsAISpeaking(false);
      window.speechSynthesis.cancel();
      if (ttsKeepAliveRef.current) clearInterval(ttsKeepAliveRef.current);
      setError("Sarah had trouble responding. Please try again or skip this question.");
      setUserAnswer("");
      setWaitingForUser(true);
      autoStartMic();
    }
  };

  /* ---- Skip current question and move to the next ---- */
  const handleSkipQuestion = async () => {
    if (isAIThinking || isAISpeaking) return;
    submittedRef.current = true;
    stopListening();
    setWaitingForUser(false);

    /* Record the skipped question (last AI message) */
    const lastAI = messagesRef.current.filter(m => m.role === "ai").pop();
    if (lastAI) setSkippedQuestions(prev => [...prev, lastAI.text]);

    /* Add a skip marker to conversation so AI knows */
    const skipMsg: ChatMessage = { role: "user", text: "[SKIPPED — moved to next question]" };
    const updatedMessages = [...messagesRef.current, skipMsg];
    setMessages(updatedMessages);
    setUserAnswer("");

    const nextExchange = exchangeNumber + 1;
    setExchangeNumber(nextExchange);

    setIsAIThinking(true);
    setIsAISpeaking(true);
    spokenLenRef.current = 0;
    window.speechSynthesis.cancel();
    ttsKeepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
    }, 5000);
    try {
      const response = await getAIResponse(updatedMessages, nextExchange);
      const aiMsg: ChatMessage = { role: "ai", text: response.message };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentAIMessage(response.message);
      setIsAIThinking(false);

      const remaining = response.message.slice(spokenLenRef.current).trim();
      if (remaining) window.speechSynthesis.speak(makeUtterance(remaining));
      await new Promise<void>(resolve => {
        const deadline = Date.now() + 25000;
        const check = () => {
          if (!window.speechSynthesis.speaking || Date.now() > deadline) {
            if (Date.now() > deadline) window.speechSynthesis.cancel();
            resolve();
            return;
          }
          setTimeout(check, 200);
        };
        setTimeout(check, 200);
      });
      if (ttsKeepAliveRef.current) clearInterval(ttsKeepAliveRef.current);
      setIsAISpeaking(false);

      if (response.isComplete || nextExchange >= MAX_EXCHANGES - 1) {
        await handleFinishInterview([...updatedMessages, aiMsg]);
      } else {
        setUserAnswer("");
        setWaitingForUser(true);
        autoStartMic();
      }
    } catch {
      setIsAIThinking(false);
      setIsAISpeaking(false);
      window.speechSynthesis.cancel();
      if (ttsKeepAliveRef.current) clearInterval(ttsKeepAliveRef.current);
      setError("Sarah had trouble responding. Please try again or skip this question.");
      setUserAnswer("");
      setWaitingForUser(true);
      autoStartMic();
    }
  };

  /* ---- Finish the interview and generate the summary ---- */
  const handleFinishInterview = async (finalMessages?: ChatMessage[]) => {
    stopWebcam();
    stopListening();
    window.speechSynthesis?.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setLoadingResults(true);
    setPhase("results");

    try {
      /* Build transcript from conversation for the summary */
      const msgs = finalMessages || messagesRef.current;
      const transcript = msgs
        .map(m => `${m.role === "ai" ? "Sarah (Interviewer)" : "Candidate"}: ${m.text}`)
        .join("\n\n");

      /* Count how many questions the candidate actually answered */
      const candidateAnswers = msgs.filter(m => m.role === "user" && !m.text.includes("[SKIPPED")).length;

      const result = await callAI("mock_interview_summary", {
        role,
        experience,
        interviewType,
        jobDescription,
        transcript,
        skippedCount: String(skippedQuestions.length),
        questionsAnswered: String(candidateAnswers),
        interviewDuration: String(elapsedTime),
      });
      const score = parseAIJson<FinalScore>(result);
      setFinalScore(score);
    } catch {
      setFinalScore({
        overallScore: 0,
        categories: {},
        questionScores: [],
        topStrengths: [],
        keyImprovements: [],
        overallFeedback: "Could not generate final assessment.",
        readinessLevel: "Unknown",
      });
    } finally {
      setLoadingResults(false);
    }
  };

  /* ---- Cleanup all media/timers on unmount ---- */
  useEffect(() => {
    return () => {
      stopWebcam();
      stopListening();
      window.speechSynthesis?.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopWebcam, stopListening]);


  /* ============================================================
     RENDER: SETUP PHASE — Interview configuration form
     ============================================================ */
  if (phase === "setup") {
    return (
      <div>
        {/* ---- Header with back navigation ---- */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard/interview" className="text-text-secondary hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Mock Interview</h1>
        </div>
        <p className="text-text-secondary mb-8">Practice in a realistic video interview with an AI interviewer.</p>

        <div className="max-w-2xl space-y-6">
          {/* Role (required) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Role You&apos;re Interviewing For *</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, Sales Executive"
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors" />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Industry</label>
            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)}
              placeholder="e.g., Tech, Finance, Consulting, Healthcare"
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors" />
          </div>

          {/* Experience Level + Interview Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Experience Level</label>
              <select value={experience} onChange={e => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors">
                <option value="Fresh Graduate">Fresh Graduate</option>
                <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                <option value="Mid-level">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
                <option value="Leadership">Leadership / Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Interview Type</label>
              <select value={interviewType} onChange={e => setInterviewType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors">
                <option value="Behavioral">Behavioral</option>
                <option value="Technical">Technical</option>
                <option value="Case Interview">Case Interview</option>
                <option value="HR Screening">HR Screening</option>
                <option value="Final Round">Final Round</option>
                <option value="Mixed">Mixed (All Types)</option>
              </select>
            </div>
          </div>

          {/* Target Company — two-tier category → company dropdown, or manual input */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Target Company <span className="text-text-muted">(optional — enables real company-specific questions & interview style)</span></label>

            {/* Row 1: Category selector */}
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
                    /* Auto-select first company in category */
                    const slugs = getCompanySlugsForCategory(val);
                    if (slugs.length > 0) {
                      setCompanySlug(slugs[0].slug);
                      setCompany(slugs[0].name);
                      setCompanyPromptBlock(buildCompanyPromptBlock(COMPANY_PROFILES[slugs[0].slug]));
                    }
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors"
              >
                <option value="">Select category...</option>
                {COMPANY_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label} — {cat.description}</option>
                ))}
                <option value="manual">Type company name manually</option>
              </select>

              {/* Row 2: Company dropdown (if category selected) or manual input */}
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
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:border-brand-indigo/50 focus:outline-none transition-colors"
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
                  placeholder="e.g., Spotify, Shopify, Goldman Sachs..."
                  className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors"
                />
              ) : null}
            </div>

            {/* Show selected company's interview style as a preview */}
            {companySlug && COMPANY_PROFILES[companySlug] && (
              <div className="mt-3 p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20">
                <p className="text-xs text-brand-light font-medium mb-1">{COMPANY_PROFILES[companySlug].name} Interview Style</p>
                <p className="text-xs text-text-secondary leading-relaxed">{COMPANY_PROFILES[companySlug].interviewStyle}</p>
                <p className="text-xs text-text-muted mt-2">Rounds: {COMPANY_PROFILES[companySlug].rounds.join(" → ")}</p>
              </div>
            )}
          </div>

          {/* Job Description (optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Job Description <span className="text-text-muted">(optional — tailors questions to specific requirements)</span></label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description and requirements here..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors resize-y text-sm" />
          </div>

          {/* Resume Upload (optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Your Resume <span className="text-text-muted">(optional — AI asks about your real experience)</span></label>
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }} />

            {!resume ? (
              /* Upload dropzone */
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
                    <div className="flex justify-center mb-2"><svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
                    <p className="text-white font-medium">Drop your resume here or click to upload</p>
                    <p className="text-sm text-text-muted mt-1">PDF or TXT — max 5MB</p>
                  </>
                )}
              </div>
            ) : (
              /* Resume loaded preview */
              <div className="w-full rounded-xl bg-space-700 border border-card-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-space-600/50 border-b border-card-border">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <span className="text-sm text-white font-medium">{resumeFileName || "Pasted resume"}</span>
                    <span className="text-xs text-text-muted">({resume.length.toLocaleString()} chars)</span>
                  </div>
                  <button onClick={() => { setResume(""); setResumeFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </div>
                <div className="px-4 py-3 max-h-28 overflow-y-auto">
                  <p className="text-xs text-text-muted whitespace-pre-wrap line-clamp-4">{resume.slice(0, 500)}{resume.length > 500 ? "..." : ""}</p>
                </div>
              </div>
            )}
          </div>

          {/* How it works info box */}
          <div className="p-4 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 space-y-2">
            <p className="text-sm text-text-secondary">
              <span className="text-brand-light font-medium">How it works:</span> You&apos;ll join a video call with Sarah, your AI interviewer.
              She&apos;ll greet you naturally and ask 10 real interview questions based on your role, experience, and company.
              Speak into your <strong className="text-white">microphone</strong> or type — your <strong className="text-white">webcam</strong> will be on so you can practice eye contact and body language.
              At the end, you&apos;ll get a detailed score breakdown.
            </p>
            <p className="text-xs text-text-muted">
              Tip: Allow camera &amp; microphone when prompted. Turn up your device volume for the best experience — Sarah speaks at maximum browser volume.
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Start button */}
          <button onClick={handleStartInterview} disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Connecting to interview...
              </span>
            ) : "Join Interview"}
          </button>
        </div>
      </div>
    );
  }


  /* ============================================================
     RENDER: INTERVIEW PHASE — Google Meet Style Layout
     ============================================================ */
  if (phase === "interview") {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* ---- Inline CSS for avatar animations ---- */}
        <style>{`
          /* Eyelid blink: skin-colored rects scale over eyes periodically */
          @keyframes blink {
            0%, 93%, 100% { transform: scaleY(0); }
            95%, 97% { transform: scaleY(1); }
          }
          .avatar-eyelid { animation: blink 3.5s ease-in-out infinite; }

          /* Mouth opens/closes when AI is speaking */
          @keyframes speak-mouth {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(2.2); }
          }
          .avatar-mouth-speaking { animation: speak-mouth 0.35s ease-in-out infinite; }

          /* Subtle idle breathing/float on the whole avatar */
          @keyframes breathe {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          .avatar-breathe { animation: breathe 4s ease-in-out infinite; }

          /* Glowing ring around avatar when speaking */
          @keyframes glow-ring {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          .avatar-glow { animation: glow-ring 1.5s ease-in-out infinite; }

          /* Audio visualizer bar animation */
          @keyframes audio-bar {
            0%, 100% { height: 8px; }
            50% { height: 24px; }
          }
        `}</style>

        {/* ---- Top bar: timer + question info + end button ---- */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-4">
            {/* Timer */}
            <span className="text-sm font-mono text-text-secondary bg-space-700 px-3 py-1.5 rounded-lg">
              {formatTime(elapsedTime)}
            </span>
            {/* Question counter */}
            <span className="text-sm text-text-secondary">
              {exchangeNumber === 0 ? "Getting started..." : (
                <>Question <span className="text-white font-semibold">{questionNumber + 1}</span>{skippedQuestions.length > 0 && <span className="text-text-muted ml-1">({skippedQuestions.length} skipped)</span>}</>
              )}
            </span>
          </div>
          {/* End interview button */}
          <button onClick={() => handleFinishInterview()} className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
            End Interview
          </button>
        </div>

        {/* ---- Thin accent bar ---- */}
        <div className="w-full h-1 bg-space-700 rounded-full mb-4">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-700" style={{ width: "100%" }} />
        </div>

        {/* ---- Video tiles: Google Meet style (side-by-side) ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 flex-shrink-0">

          {/* ---- LEFT TILE: AI Interviewer (Sarah) ---- */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-space-800 via-space-700 to-space-800 border border-card-border aspect-video flex items-center justify-center">
            {/* Animated avatar */}
            <div className="avatar-breathe flex flex-col items-center">
              {/* Glowing ring behind avatar (visible when speaking) */}
              <div className={`absolute rounded-full w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-blue-500/20 to-blue-500/30 blur-xl ${isAISpeaking ? "avatar-glow" : "opacity-20"}`} />

              {/* Avatar SVG — professional woman illustration */}
              <div className="relative z-10">
                <svg width="120" height="120" viewBox="0 0 200 200" className="md:w-[160px] md:h-[160px]">
                  <defs>
                    <linearGradient id="avatarBg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4338CA" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <clipPath id="avatarClip"><circle cx="100" cy="100" r="94" /></clipPath>
                  </defs>
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="96" fill="url(#avatarBg)" opacity="0.3" />
                  <circle cx="100" cy="100" r="94" fill="#1E1B4B" />
                  <g clipPath="url(#avatarClip)">
                    {/* Body / Blazer */}
                    <path d="M35 195 Q35 160 65 148 L90 140 L100 143 L110 140 L135 148 Q165 160 165 195 L165 220 L35 220 Z" fill="#4338CA" />
                    {/* Shirt collar V-neck */}
                    <path d="M88 142 L100 155 L112 142" fill="none" stroke="#E2E8F0" strokeWidth="2" />
                    {/* Neck */}
                    <rect x="91" y="121" width="18" height="22" rx="9" fill="#DEB0A0" />
                    {/* Face — oval */}
                    <ellipse cx="100" cy="92" rx="40" ry="46" fill="#DEB0A0" />
                    {/* Hair back (dark brunette) */}
                    <path d="M56 78 Q56 38 100 32 Q144 38 144 78 L146 108 Q148 120 140 125 L137 112 L132 98 Q132 55 100 48 Q68 55 68 98 L63 112 L60 125 Q52 120 54 108 Z" fill="#3D2424" />
                    {/* Hair front bangs */}
                    <path d="M62 72 Q68 55 85 50 Q75 62 72 75 Z" fill="#3D2424" />
                    <path d="M138 72 Q132 55 115 50 Q125 62 128 75 Z" fill="#3D2424" />
                    {/* Eyes — expressive */}
                    <ellipse cx="82" cy="88" rx="5.5" ry="5" fill="#2D1B0E" />
                    <ellipse cx="118" cy="88" rx="5.5" ry="5" fill="#2D1B0E" />
                    {/* Eye shine */}
                    <circle cx="84" cy="86" r="2" fill="white" opacity="0.85" />
                    <circle cx="120" cy="86" r="2" fill="white" opacity="0.85" />
                    {/* Eyelids for blink animation (skin-colored, scales over eyes) */}
                    <rect className="avatar-eyelid" x="74" y="81" width="17" height="14" rx="7" fill="#DEB0A0" style={{ transformOrigin: "82.5px 88px" }} />
                    <rect className="avatar-eyelid" x="110" y="81" width="17" height="14" rx="7" fill="#DEB0A0" style={{ transformOrigin: "118.5px 88px" }} />
                    {/* Eyebrows */}
                    <path d="M72 77 Q82 73 92 76" stroke="#3D2424" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M108 76 Q118 73 128 77" stroke="#3D2424" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    {/* Nose */}
                    <path d="M100 92 Q97 100 95 103 Q98 105 100 105 Q102 105 105 103 Q103 100 100 92" fill="#C9998A" opacity="0.5" />
                    {/* Mouth — switches between smile and open when speaking */}
                    <g className={isAISpeaking ? "avatar-mouth-speaking" : ""} style={{ transformOrigin: "100px 115px" }}>
                      {isAISpeaking ? (
                        /* Open mouth (speaking) */
                        <ellipse cx="100" cy="115" rx="10" ry="6" fill="#C25F5F" />
                      ) : (
                        /* Closed smile (idle) */
                        <path d="M88 113 Q94 119 100 119 Q106 119 112 113" stroke="#C25F5F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      )}
                    </g>
                    {/* Cheek blush */}
                    <circle cx="70" cy="102" r="9" fill="rgba(194, 95, 95, 0.1)" />
                    <circle cx="130" cy="102" r="9" fill="rgba(194, 95, 95, 0.1)" />
                    {/* Earrings */}
                    <circle cx="58" cy="103" r="2.5" fill="#F59E0B" opacity="0.8" />
                    <circle cx="142" cy="103" r="2.5" fill="#F59E0B" opacity="0.8" />
                  </g>
                </svg>
              </div>

              {/* Audio visualizer bars (visible when speaking) */}
              {isAISpeaking && (
                <div className="flex items-end gap-1 mt-2 h-6">
                  {[0, 0.15, 0.3, 0.45, 0.6, 0.45, 0.3, 0.15, 0].map((delay, i) => (
                    <div key={i} className="w-1 bg-brand-indigo rounded-full"
                      style={{ animation: `audio-bar 0.6s ease-in-out ${delay}s infinite`, height: "8px" }} />
                  ))}
                </div>
              )}
            </div>

            {/* Name badge (bottom-left, Meet style) */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
              <p className="text-xs text-white font-medium">Sarah Mitchell</p>
              {/* Status dot */}
              {isAISpeaking && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              {isAIThinking && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
            </div>

            {/* Speaking/Thinking indicator (top-right) */}
            {(isAISpeaking || isAIThinking) && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                <span className="text-xs text-text-secondary">
                  {isAIThinking ? "Responding..." : "Speaking..."}
                </span>
              </div>
            )}
          </div>

          {/* ---- RIGHT TILE: User's Webcam ---- */}
          <div className="relative rounded-2xl overflow-hidden bg-space-800 border border-card-border aspect-video">
            <video ref={(el) => {
              videoRef.current = el;
              /* Connect stream immediately when video element mounts */
              if (el && streamRef.current && !el.srcObject) {
                el.srcObject = streamRef.current;
                el.muted = true;
                el.play().catch(() => {});
              }
            }} autoPlay muted playsInline
              className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            {/* Fallback if no webcam — hint how to enable it */}
            {!webcamReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-space-600 flex items-center justify-center text-text-muted"><svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                <p className="text-xs text-text-muted px-4 text-center">Camera off — click the lock icon in your address bar to enable</p>
              </div>
            )}
            {/* Name badge */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
              <p className="text-xs text-white font-medium">You{role ? ` • ${role}` : ""}</p>
            </div>
            {/* Recording indicator */}
            {isListening && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium">REC</span>
              </div>
            )}
          </div>
        </div>

        {/* ---- AI's current message (caption bar, like subtitles) ---- */}
        {currentAIMessage && (
          <div className="mb-3 p-3 rounded-xl bg-space-700/80 border border-card-border/50 flex-shrink-0">
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="text-brand-light font-medium">Sarah: </span>
              {currentAIMessage}
            </p>
          </div>
        )}

        {/* ---- User input area (bottom bar, Meet style) ---- */}
        <div className="mt-auto flex-shrink-0">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <div className="flex items-end gap-3">
            {/* Mic toggle button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!waitingForUser}
              className={`p-3.5 rounded-xl border transition-all flex-shrink-0 ${
                isListening
                  ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : "bg-space-600 border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30"
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              title={isListening ? "Stop recording" : "Start speaking"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>

            {/* Text input */}
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
              placeholder={
                isAIThinking ? "Sarah is responding..."
                  : isAISpeaking ? "Sarah is speaking..."
                    : waitingForUser ? "Type your answer or click the mic..."
                      : "Waiting..."
              }
              rows={2}
              disabled={!waitingForUser}
              className="flex-1 px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:border-brand-indigo/50 focus:outline-none transition-colors resize-none disabled:opacity-40"
            />

            {/* Skip question button */}
            <button
              onClick={handleSkipQuestion}
              disabled={!waitingForUser || exchangeNumber === 0}
              className="px-3 py-3.5 rounded-xl bg-space-600 border border-card-border text-text-secondary hover:text-amber-400 hover:border-amber-400/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 text-xs font-medium"
              title="Skip this question"
            >
              Skip
            </button>

            {/* Submit button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || !waitingForUser}
              className="p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              title="Send answer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }


  /* ============================================================
     RENDER: RESULTS PHASE — Final Score Dashboard
     ============================================================ */
  return (
    <div>
      {/* ---- Header ---- */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard/interview" className="text-text-secondary hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">Interview Results</h1>
      </div>
      <p className="text-text-secondary mb-8">{role} • {interviewType} Interview • {formatTime(elapsedTime)}</p>

      {loadingResults ? (
        /* ---- Loading spinner ---- */
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-brand-indigo mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <p className="text-text-secondary">Sarah is writing up your assessment...</p>
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

          {/* ---- Category Scores (bar chart) ---- */}
          {Object.keys(finalScore.categories).length > 0 && (
            <div className="p-6 rounded-2xl bg-space-700/80 border border-card-border">
              <h3 className="font-semibold text-white mb-4">Skill Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(finalScore.categories).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold ${val >= 7 ? "text-green-400" : val >= 5 ? "text-yellow-400" : "text-red-400"}`}>{val}</div>
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
                {finalScore.topStrengths.map((s, i) => <p key={i} className="text-sm text-text-secondary mb-2">✓ {s}</p>)}
              </div>
            )}
            {finalScore.keyImprovements.length > 0 && (
              <div className="p-5 rounded-2xl bg-space-700/80 border border-card-border">
                <h3 className="font-semibold text-yellow-400 mb-3">Key Improvements</h3>
                {finalScore.keyImprovements.map((s, i) => <p key={i} className="text-sm text-text-secondary mb-2">→ {s}</p>)}
              </div>
            )}
          </div>

          {/* ---- Per-Question Breakdown ---- */}
          {finalScore.questionScores && finalScore.questionScores.length > 0 && (
            <div className="p-6 rounded-2xl bg-space-700/80 border border-card-border">
              <h3 className="font-semibold text-white mb-4">Question-by-Question Review</h3>
              <div className="space-y-4">
                {finalScore.questionScores.map((q, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-space-600/50 hover:bg-space-600 transition-colors">
                      <span className="text-sm text-white">Q{i + 1}: {q.question.slice(0, 80)}{q.question.length > 80 ? "..." : ""}</span>
                      <span className={`text-sm font-bold ml-3 ${q.score >= 7 ? "text-green-400" : q.score >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                        {q.score}/10
                      </span>
                    </summary>
                    <div className="mt-2 ml-3 p-3 rounded-xl bg-space-800/50 space-y-2">
                      {q.strengths.map((s, j) => <p key={j} className="text-sm text-green-400/80">✓ {s}</p>)}
                      {q.improvements.map((s, j) => <p key={j} className="text-sm text-yellow-400/80">→ {s}</p>)}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* ---- Full Transcript (collapsible) ---- */}
          {messages.length > 0 && (
            <details className="p-6 rounded-2xl bg-space-700/80 border border-card-border">
              <summary className="font-semibold text-white cursor-pointer">Full Interview Transcript</summary>
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                {messages.map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm ${m.role === "ai" ? "bg-brand-indigo/10 border border-brand-indigo/20" : "bg-space-600/50 border border-card-border/50"}`}>
                    <span className={`font-medium ${m.role === "ai" ? "text-brand-light" : "text-white"}`}>
                      {m.role === "ai" ? "Sarah:" : "You:"}
                    </span>
                    <span className="text-text-secondary ml-2">{m.text}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* ---- Action buttons ---- */}
          <div className="flex gap-4">
            <button
              onClick={() => { setPhase("setup"); setFinalScore(null); setMessages([]); setCurrentAIMessage(""); setExchangeNumber(0); setQuestionNumber(0); setSkippedQuestions([]); setError(""); setWebcamReady(false); setCompanyCategory(""); setCompanySlug(""); setCompany(""); setCompanyPromptBlock(""); }}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-500/90 transition-all">
              Practice Another Interview
            </button>
            <Link href="/dashboard/interview"
              className="flex-1 py-3 rounded-xl font-semibold text-center bg-space-600 border border-card-border text-text-secondary hover:text-white hover:border-brand-indigo/30 transition-all">
              Back to Interview Prep
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
