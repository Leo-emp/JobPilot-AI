/* ============================================================
   useAIStream - Hook for streaming AI responses
   ============================================================
   Calls /api/ai/stream and updates state as tokens arrive.
   Text appears word-by-word in the UI. Falls back to the
   non-streaming /api/ai endpoint if streaming fails.
   ============================================================ */

"use client";

import { useState, useCallback, useRef } from "react";
import { usePlan } from "./usePlan";

interface UseAIStreamReturn {
  result: string;
  loading: boolean;
  streaming: boolean;
  error: string;
  plan: string;
  remaining: number | "unlimited" | null;
  callAI: (action: string, payload: Record<string, unknown>) => Promise<string | null>;
  reset: (prefill?: string) => void;
}

export function useAIStream(): UseAIStreamReturn {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const { plan, remaining, updateRemaining } = usePlan();
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback((prefill?: string) => {
    setResult(prefill ?? "");
    setError("");
    setLoading(false);
    setStreaming(false);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const callAI = useCallback(async (action: string, payload: Record<string, unknown>): Promise<string | null> => {
    setLoading(true);
    setStreaming(false);
    setError("");
    setResult("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
        signal: controller.signal,
      });

      /* Non-streaming error responses come back as JSON */
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "AI request failed.");
        setLoading(false);
        return null;
      }

      /* Stream the response token by token */
      setStreaming(true);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setResult(fullText);
      }

      /* Update remaining count (decrement locally) */
      if (typeof remaining === "number") {
        updateRemaining(Math.max(0, remaining - 1));
      }

      setStreaming(false);
      setLoading(false);
      return fullText;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setLoading(false);
        setStreaming(false);
        return null;
      }

      /* Fallback to non-streaming endpoint */
      try {
        const fallbackRes = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload }),
        });

        const data = await fallbackRes.json();
        if (!fallbackRes.ok) {
          setError(data.error || "AI request failed.");
          setLoading(false);
          return null;
        }

        setResult(data.result);
        if (data.remaining !== undefined) updateRemaining(data.remaining);
        setLoading(false);
        return data.result;
      } catch {
        setError("Failed to connect to AI. Please try again.");
        setLoading(false);
        return null;
      }
    }
  }, [remaining, updateRemaining]);

  return { result, loading, streaming, error, plan, remaining, callAI, reset };
}
