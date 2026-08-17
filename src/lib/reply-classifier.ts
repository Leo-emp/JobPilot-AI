/* ============================================================
   REPLY CLASSIFIER — AI-powered email reply analysis
   ============================================================
   Classifies candidate responses to outreach emails as:
   - positive: interested, wants to learn more, open to conversation
   - negative: not interested, already employed, opt out
   - neutral: acknowledges but non-committal
   - uncertain: AI can't determine (flagged for manual employer review)

   Uses Gemini for classification with a structured output prompt.
   ============================================================ */

import { callGemini } from "@/lib/gemini";

/* # Classification result */
export interface ReplyClassification {
  sentiment: "positive" | "negative" | "neutral" | "uncertain";
  confidence: number;    // 0-100
  summary: string;       // One-line human-readable summary
  wantsOptOut: boolean;  // Whether the reply explicitly requests opt-out
}

/* # Classify a candidate's reply to an outreach email */
export async function classifyReply(
  replyText: string,
  originalSubject: string,
): Promise<ReplyClassification> {
  const prompt = `Classify this email reply to a recruiting outreach message.

Original outreach subject: "${originalSubject}"

Candidate's reply:
"""
${replyText.substring(0, 2000)}
"""

Classify the reply into one of these categories:
- "positive": interested, wants to learn more, open to a call/chat, asks for details
- "negative": not interested, declines, says they are happy in current role, tells you to stop
- "neutral": acknowledges receipt but is non-committal, asks a basic question without showing interest
- "uncertain": ambiguous, unclear intent, may need human review

Also determine:
- confidence: 0-100 how confident you are in the classification
- summary: one-line human-readable summary of their response
- wantsOptOut: true if the reply explicitly asks to be removed from emails or not be contacted again

Return ONLY a JSON object:
{"sentiment": "positive|negative|neutral|uncertain", "confidence": 80, "summary": "...", "wantsOptOut": false}`;

  try {
    const result = await callGemini(prompt, 0.1);
    const cleaned = result.text
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    /* # Validate the response shape */
    const validSentiments = ["positive", "negative", "neutral", "uncertain"];
    if (!validSentiments.includes(parsed.sentiment)) {
      parsed.sentiment = "uncertain";
    }

    return {
      sentiment: parsed.sentiment,
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
      summary: String(parsed.summary ?? "Reply received"),
      wantsOptOut: Boolean(parsed.wantsOptOut),
    };
  } catch (err) {
    console.error("[reply-classifier] Classification failed:", err);

    /* # Fallback: uncertain, flag for manual review */
    return {
      sentiment: "uncertain",
      confidence: 0,
      summary: "Could not classify reply automatically",
      wantsOptOut: false,
    };
  }
}
