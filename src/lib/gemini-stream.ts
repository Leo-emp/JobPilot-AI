/* ============================================================
   GEMINI STREAMING CLIENT - Token-by-token AI responses
   ============================================================
   Uses Gemini's streamGenerateContent endpoint to return tokens
   as they're generated. Falls back through models on failure
   just like the non-streaming version.
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

/* Models that returned 404 — skip them for 1 hour, then retry */
const deadModels = new Map<string, number>();
const DEAD_MODEL_TTL_MS = 60 * 60 * 1000;
const AI_TIMEOUT_MS = 30_000;

export interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  model: string;
}

export async function streamGemini(prompt: string, temperature = 0.7): Promise<StreamResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  let lastError = "";

  for (const model of GEMINI_MODELS) {
    const deadSince = deadModels.get(model);
    if (deadSince && Date.now() - deadSince < DEAD_MODEL_TTL_MS) continue;
    if (deadSince) deadModels.delete(model);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              maxOutputTokens: 8192,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (response.status === 404) {
        deadModels.set(model, Date.now());
        continue;
      }

      if (response.status === 429 || response.status === 503) {
        lastError = `Model ${model} rate-limited`;
        continue;
      }

      if (!response.ok) {
        lastError = `Model ${model} error ${response.status}`;
        continue;
      }

      if (!response.body) {
        lastError = "No response body";
        continue;
      }

      /* Transform the SSE stream into plain text chunks */
      const encoder = new TextEncoder();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      return {
        model,
        stream: new ReadableStream({
          async pull(ctrl) {
            try {
              const { done, value } = await reader.read();
              if (done) {
                ctrl.close();
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    ctrl.enqueue(encoder.encode(text));
                  }
                } catch {
                  /* Skip malformed JSON chunks */
                }
              }
            } catch {
              ctrl.close();
            }
          },
          cancel() {
            reader.cancel();
          },
        }),
      };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error.message : "Network error";
      continue;
    }
  }

  throw new Error(lastError || "AI is temporarily unavailable. Please try again in a moment.");
}

export async function streamGeminiMultimodal(prompt: string, images: { data: string; mimeType: string }[], temperature = 0.7): Promise<StreamResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const parts: any[] = [{ text: prompt }];
  for (const img of images) {
    const base64Data = img.data.includes(",") ? img.data.split(",")[1] : img.data;
    parts.push({ inlineData: { mimeType: img.mimeType, data: base64Data } });
  }

  let lastError = "";

  for (const model of GEMINI_MODELS) {
    const deadSince = deadModels.get(model);
    if (deadSince && Date.now() - deadSince < DEAD_MODEL_TTL_MS) continue;
    if (deadSince) deadModels.delete(model);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature,
              maxOutputTokens: 8192,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (response.status === 404) { deadModels.set(model, Date.now()); continue; }
      if (response.status === 429 || response.status === 503) { lastError = `${model} rate-limited`; continue; }
      if (!response.ok || !response.body) { lastError = `${model} error`; continue; }

      const encoder = new TextEncoder();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      return {
        model,
        stream: new ReadableStream({
          async pull(ctrl) {
            try {
              const { done, value } = await reader.read();
              if (done) { ctrl.close(); return; }

              const chunk = decoder.decode(value, { stream: true });
              for (const line of chunk.split("\n")) {
                if (!line.startsWith("data: ")) continue;
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) ctrl.enqueue(encoder.encode(text));
                } catch {}
              }
            } catch { ctrl.close(); }
          },
          cancel() { reader.cancel(); },
        }),
      };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error.message : "Network error";
      continue;
    }
  }

  throw new Error(lastError || "AI is temporarily unavailable.");
}
