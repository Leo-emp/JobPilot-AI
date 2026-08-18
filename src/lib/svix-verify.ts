/* ============================================================
   SVIX WEBHOOK VERIFICATION — HMAC signature check
   ============================================================
   Resend uses Svix to sign webhook payloads. This module
   verifies the HMAC-SHA256 signature to ensure the request
   actually came from Resend, not an attacker.

   Svix signing format:
   - Secret is base64-encoded, prefixed with "whsec_"
   - Signature payload = "{svix-id}.{svix-timestamp}.{body}"
   - Multiple signatures may be comma-separated (key rotation)
   - We verify at least one matches
   ============================================================ */

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface VerifyResult {
  ok: boolean;
  body: string | null;
  errorResponse: NextResponse | null;
}

/* # Verify a Svix-signed webhook request.
   Returns the raw body string on success, or an error NextResponse on failure. */
export async function verifySvixWebhook(
  req: NextRequest,
  secret: string,
): Promise<VerifyResult> {
  /* # Extract required Svix headers */
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return {
      ok: false,
      body: null,
      errorResponse: NextResponse.json(
        { error: "Missing webhook signature headers" },
        { status: 401 },
      ),
    };
  }

  /* # Reject stale timestamps (5 min window) to prevent replay attacks */
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(svixTimestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) {
    return {
      ok: false,
      body: null,
      errorResponse: NextResponse.json(
        { error: "Webhook timestamp expired" },
        { status: 401 },
      ),
    };
  }

  /* # Read raw body for signature computation */
  const rawBody = await req.text();

  /* # Svix secrets are base64-encoded with a "whsec_" prefix */
  const secretBytes = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64",
  );

  /* # Construct the signed content: "{msg_id}.{timestamp}.{body}" */
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;

  /* # Compute expected HMAC-SHA256 */
  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  /* # Svix may send multiple signatures (comma-separated) for key rotation.
     At least one must match. Each entry is like "v1,{base64}" */
  const signatures = svixSignature.split(" ");
  const matched = signatures.some((sig) => {
    const parts = sig.split(",");
    /* # We only support v1 signatures */
    if (parts[0] !== "v1" || !parts[1]) return false;
    /* # Constant-time comparison to prevent timing attacks */
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(parts[1]),
      );
    } catch {
      return false;
    }
  });

  if (!matched) {
    return {
      ok: false,
      body: null,
      errorResponse: NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      ),
    };
  }

  return { ok: true, body: rawBody, errorResponse: null };
}
