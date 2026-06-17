/* ============================================================
   GEMINI FALLBACK TESTS
   ============================================================
   Tests for the 6-model fallback chain in src/lib/gemini.ts
   Verifies: model rotation, dead model caching, rate limit
   handling, timeout behavior, and retry passes.
   ============================================================ */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/* # Mock Sentry — prevent real span creation */
vi.mock("@sentry/nextjs", () => ({
  startSpan: vi.fn((_opts: unknown, fn: (span: unknown) => unknown) => {
    const fakeSpan = {
      updateName: vi.fn(),
      setAttribute: vi.fn(),
    };
    return fn(fakeSpan);
  }),
  captureException: vi.fn(),
}));

/* # Mock fetch — controls all HTTP responses */
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

/* # Need to re-import after mocking so the module uses our mocked fetch */
let callGemini: typeof import("@/lib/gemini").callGemini;

beforeEach(async () => {
  vi.clearAllMocks();
  process.env.GEMINI_API_KEY = "test-key";

  /* # Fresh module import each test so deadModels Map is clean */
  vi.resetModules();
  const mod = await import("@/lib/gemini");
  callGemini = mod.callGemini;
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* # Helper: mock a successful Gemini API response */
function successResponse(text: string, model = "gemini-2.5-flash") {
  return new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ text }] } }],
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("Gemini fallback chain", () => {
  /* # First model works — should return immediately */
  it("returns result from first available model", async () => {
    mockFetch.mockResolvedValueOnce(successResponse("Hello world"));

    const result = await callGemini("test prompt");

    expect(result.text).toBe("Hello world");
    expect(result.model).toBe("gemini-2.5-flash");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  /* # First model 429 → falls through to second model */
  it("skips rate-limited models and tries next", async () => {
    mockFetch
      .mockResolvedValueOnce(new Response("{}", { status: 429 }))
      .mockResolvedValueOnce(successResponse("Fallback response"));

    const result = await callGemini("test prompt");

    expect(result.text).toBe("Fallback response");
    expect(result.model).toBe("gemini-2.5-flash-lite");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  /* # 404 model gets cached as dead — second call should skip it */
  it("caches 404 models and skips them on subsequent calls", async () => {
    /* # First call: model 1 returns 404, model 2 succeeds */
    mockFetch
      .mockResolvedValueOnce(new Response("{}", { status: 404 }))
      .mockResolvedValueOnce(successResponse("From model 2"));

    const result1 = await callGemini("prompt 1");
    expect(result1.model).toBe("gemini-2.5-flash-lite");

    /* # Second call: model 1 should be skipped (dead), model 2 answers */
    mockFetch.mockResolvedValueOnce(successResponse("Cached skip"));
    const result2 = await callGemini("prompt 2");

    /* # Only 1 fetch call for the second request (skipped dead model) */
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result2.model).toBe("gemini-2.5-flash-lite");
  });

  /* # 503 should also trigger fallback */
  it("skips 503 models and tries next", async () => {
    mockFetch
      .mockResolvedValueOnce(new Response("{}", { status: 503 }))
      .mockResolvedValueOnce(successResponse("Service recovered"));

    const result = await callGemini("test");
    expect(result.text).toBe("Service recovered");
  });

  /* # 500 server error should also trigger fallback */
  it("skips 500 server error models", async () => {
    mockFetch
      .mockResolvedValueOnce(new Response("{}", { status: 500 }))
      .mockResolvedValueOnce(successResponse("After server error"));

    const result = await callGemini("test");
    expect(result.text).toBe("After server error");
  });

  /* # All models fail → should throw after exhausting retry passes */
  it("throws when all models fail across all retry passes", async () => {
    /* # 6 models × 2 passes = 12 failed attempts */
    for (let i = 0; i < 12; i++) {
      mockFetch.mockResolvedValueOnce(new Response("{}", { status: 429 }));
    }

    await expect(callGemini("doomed prompt")).rejects.toThrow(
      "AI is temporarily unavailable"
    );
  });

  /* # Empty response from model should trigger fallback */
  it("skips models that return empty text", async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: "" }] } }] }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(successResponse("Non-empty response"));

    const result = await callGemini("test");
    expect(result.text).toBe("Non-empty response");
  });

  /* # Missing API key should throw immediately */
  it("throws when GEMINI_API_KEY is not set", async () => {
    delete process.env.GEMINI_API_KEY;

    /* # Need fresh import to pick up missing env var */
    vi.resetModules();
    const mod = await import("@/lib/gemini");

    await expect(mod.callGemini("test")).rejects.toThrow("GEMINI_API_KEY");
  });

  /* # systemInstruction should be included in the request body */
  it("passes systemInstruction when provided", async () => {
    mockFetch.mockResolvedValueOnce(successResponse("Cached response"));

    await callGemini("user prompt", 0.7, "You are a resume expert.");

    /* # Verify the fetch body includes systemInstruction */
    const fetchBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(fetchBody.systemInstruction).toEqual({
      parts: [{ text: "You are a resume expert." }],
    });
    expect(fetchBody.contents[0].parts[0].text).toBe("user prompt");
  });

  /* # Without systemInstruction, the field should be absent */
  it("omits systemInstruction when not provided", async () => {
    mockFetch.mockResolvedValueOnce(successResponse("No system"));

    await callGemini("plain prompt");

    const fetchBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(fetchBody.systemInstruction).toBeUndefined();
  });

  /* # Network error should trigger fallback to next model */
  it("handles network errors and falls through", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockResolvedValueOnce(successResponse("Recovered from network error"));

    const result = await callGemini("test");
    expect(result.text).toBe("Recovered from network error");
  });
});
