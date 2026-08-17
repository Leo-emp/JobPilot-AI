/* ============================================================
   CONVERSION — GET, POST /api/auth/convert/[token]
   ============================================================
   GET: Verify a conversion token and return pre-fill data.
        The frontend uses this to show a pre-filled signup form.
   POST: Complete conversion after the user signs up.
         Links the ExternalCandidate to the new User and
         migrates all CandidateMatch records.

   This endpoint is public (no auth required for GET).
   POST requires authentication (user must have signed up).
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { verifyConversionToken, completeConversion } from "@/lib/conversion-token";
import { audit } from "@/lib/audit";
import { authHandler, type AuthSession } from "@/lib/api-handler";
import { isB2BEnabled } from "@/lib/b2b-gate";

/* # GET — Verify token and return pre-fill data for signup form */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!isB2BEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { token } = await params;

  const result = await verifyConversionToken(token);

  if (!result.valid || !result.externalCandidate) {
    return NextResponse.json(
      { error: result.error ?? "Invalid token" },
      { status: 400 },
    );
  }

  /* # Return data to pre-fill the signup form */
  const ext = result.externalCandidate;
  let skills: string[] = [];
  try {
    skills = ext.skills ? JSON.parse(ext.skills) : [];
  } catch {
    /* # Invalid JSON — skip */
  }

  return NextResponse.json({
    valid: true,
    prefill: {
      name: ext.name,
      email: ext.email,
      source: ext.source,
      profileUrl: ext.profileUrl,
      skills,
    },
  });
}

/* # POST — Complete the conversion after signup */
export const POST = authHandler(async (
  req: NextRequest,
  session: AuthSession,
) => {
  const url = new URL(req.url);
  /* # Extract token from the URL path */
  const pathParts = url.pathname.split("/");
  const token = pathParts[pathParts.length - 1];

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 },
    );
  }

  /* # Verify the token */
  const result = await verifyConversionToken(token);

  if (!result.valid || !result.externalCandidate) {
    return NextResponse.json(
      { error: result.error ?? "Invalid token" },
      { status: 400 },
    );
  }

  /* # Complete the conversion */
  await completeConversion(result.externalCandidate.id, session.user.id);

  audit("sourcing.candidate.converted", {
    userId: session.user.id,
    detail: `external:${result.externalCandidate.id} source:${result.externalCandidate.source}`,
  });

  return NextResponse.json({
    converted: true,
    message: "Welcome to JobPilot! Your profile has been linked with your match history.",
    matchesTransferred: true,
  });
});
