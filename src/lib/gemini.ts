/* ============================================================
   GEMINI CLIENT - Google Gemini AI API
   ============================================================
   Handles calling the Gemini API with smart retry logic:
   - Multiple model fallback (each has independent rate limits)
   - 404 models permanently skipped
   - 429/503 models skipped to next immediately
   - 30-second timeout per request via AbortController
   - Two passes: immediate, then 2s delay retry
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
const MAX_RETRY_PASSES = 2;
const AI_TIMEOUT_MS = 30_000;

async function callGeminiCore(parts: any[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  let lastError = "";

  for (let pass = 0; pass < MAX_RETRY_PASSES; pass++) {
    if (pass > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }

    for (const model of GEMINI_MODELS) {
      const deadSince = deadModels.get(model);
      if (deadSince && Date.now() - deadSince < DEAD_MODEL_TTL_MS) continue;
      if (deadSince) deadModels.delete(model);

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.7,
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

        if (response.status === 500) {
          lastError = `Model ${model} server error`;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json();
          const msg = errorData.error?.message || "Gemini API error";
          lastError = msg;
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          lastError = "Empty response from AI model";
          continue;
        }

        return text;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error.message : "Network error";
        continue;
      }
    }
  }

  throw new Error("AI is temporarily unavailable. Please try again in a moment.");
}

export async function callGemini(prompt: string): Promise<string> {
  return callGeminiCore([{ text: prompt }]);
}

export async function callGeminiMultimodal(prompt: string, images: { data: string; mimeType: string }[]): Promise<string> {
  const parts: any[] = [{ text: prompt }];
  for (const img of images) {
    const base64Data = img.data.includes(",") ? img.data.split(",")[1] : img.data;
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: base64Data,
      },
    });
  }
  return callGeminiCore(parts);
}
