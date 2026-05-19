/* ============================================================
   2FA VERIFY API — /api/auth/two-factor/verify
   ============================================================
   Verifies a TOTP code from the user's authenticator app.
   Two modes:
   - Setup: enables 2FA for the first time (no 2FA active yet)
   - Login: validates code during sign-in (2FA already active)
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as OTPAuth from "otpauth";
import { z } from "zod";
import { formatZodError } from "@/lib/validations";
import { authPerMinute } from "@/lib/rate-limit";

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be numeric"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Rate limit — prevents brute-force of 6-digit codes */
  const limitCheck = await authPerMinute.check(`2fa:${session.user.id}`);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limitCheck.resetIn / 1000)) } }
    );
  }

  const body = await req.json();
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  /* Fetch user's stored secret */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "2FA has not been set up. Run setup first." }, { status: 400 });
  }

  /* Validate the TOTP code (allows ±1 time window for clock drift) */
  const totp = new OTPAuth.TOTP({
    issuer: "JobPilot AI",
    label: session.user.email || "user",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
  });

  const delta = totp.validate({ token: parsed.data.code, window: 1 });

  if (delta === null) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  /* If 2FA wasn't enabled yet, enable it now (first-time setup flow) */
  if (!user.twoFactorEnabled) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    });
  }

  return NextResponse.json({ verified: true });
}
