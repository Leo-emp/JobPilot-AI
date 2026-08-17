/* ============================================================
   CONVERSION TOKEN — External candidate → User conversion
   ============================================================
   Generates and verifies tokens for converting external
   candidates into full JobPilot users.

   Flow:
   1. After outreach, a unique token is generated for the external candidate
   2. Token is hashed (SHA-256) and stored on ExternalCandidate.inviteToken
   3. The raw token is sent in the invite email link
   4. When clicked, the token is verified and the candidate signs up
   5. On signup, ExternalCandidate.convertedUserId is set
   6. All CandidateMatch records are migrated to the new User

   Tokens expire after 7 days (inviteExpiresAt).
   ============================================================ */

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";

/* # Token expiry: 7 days */
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/* # Generate a secure random token and its hash */
export function generateConversionToken(): {
  raw: string;     // # Send this in the email link
  hashed: string;  // # Store this in the database
} {
  /* # 32 bytes = 256 bits of entropy, URL-safe base64 */
  const raw = crypto.randomBytes(32).toString("base64url");

  /* # SHA-256 hash for storage — raw token never stored */
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");

  return { raw, hashed };
}

/* # Hash a raw token for lookup */
export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/* # Create a conversion token for an external candidate */
export async function createConversionToken(
  externalCandidateId: string,
): Promise<string | null> {
  const { raw, hashed } = generateConversionToken();

  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  /* # Store hashed token on the ExternalCandidate */
  await dbRetry(() =>
    prisma.externalCandidate.update({
      where: { id: externalCandidateId },
      data: {
        inviteToken: hashed,
        inviteExpiresAt: expiresAt,
      },
    })
  );

  return raw;
}

/* # Verify a conversion token and return the external candidate */
export async function verifyConversionToken(rawToken: string): Promise<{
  valid: boolean;
  externalCandidate?: {
    id: string;
    name: string;
    email: string | null;
    skills: string | null;
    source: string;
    profileUrl: string;
    convertedUserId: string | null;
  };
  error?: string;
}> {
  const hashed = hashToken(rawToken);

  /* # Look up the external candidate by hashed token */
  const candidate = await dbRetry(() =>
    prisma.externalCandidate.findUnique({
      where: { inviteToken: hashed },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        source: true,
        profileUrl: true,
        convertedUserId: true,
        inviteExpiresAt: true,
      },
    })
  );

  if (!candidate) {
    return { valid: false, error: "Invalid or expired invite token" };
  }

  /* # Check if already converted */
  if (candidate.convertedUserId) {
    return { valid: false, error: "This invite has already been used" };
  }

  /* # Check expiry */
  if (candidate.inviteExpiresAt && candidate.inviteExpiresAt < new Date()) {
    return { valid: false, error: "This invite has expired" };
  }

  return { valid: true, externalCandidate: candidate };
}

/* # Complete the conversion: link external candidate to new user */
export async function completeConversion(
  externalCandidateId: string,
  userId: string,
): Promise<void> {
  /* # Set convertedUserId on ExternalCandidate */
  await dbRetry(() =>
    prisma.externalCandidate.update({
      where: { id: externalCandidateId },
      data: {
        convertedUserId: userId,
        inviteToken: null,       // # Clear the token — one-time use
        inviteExpiresAt: null,
      },
    })
  );

  /* # Migrate all CandidateMatch records from externalId to candidateId */
  await dbRetry(() =>
    prisma.candidateMatch.updateMany({
      where: { externalId: externalCandidateId },
      data: {
        candidateId: userId,
        source: "internal",      // # Now an internal candidate
      },
    })
  );
}
