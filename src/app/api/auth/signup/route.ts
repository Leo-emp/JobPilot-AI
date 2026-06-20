/* ============================================================
   SIGNUP API ROUTE - Create New User Account
   ============================================================
   Handles POST requests to /api/auth/signup
   Validates input, hashes password with bcrypt, creates user in DB.
   Returns the new user's ID and email on success.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { signupSchema, formatZodError } from "@/lib/validations";
import { authPerMinute, authPerHour } from "@/lib/rate-limit";
import { audit, getClientIp } from "@/lib/audit";
import * as Sentry from "@sentry/nextjs";
import { buildWelcomeEmail } from "@/lib/welcome-email";
import { verifyTurnstile } from "@/lib/turnstile";
import { safeHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

/* # Lazy-init so missing env var doesn't crash the module on import */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export const POST = safeHandler(async (req: NextRequest) => {
  /* ---- Rate limiting by IP — blocks brute-force signup attempts ---- */
  const ip = getClientIp(req.headers);
  const minuteCheck = await authPerMinute.check(`signup:${ip}`);
  if (!minuteCheck.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(minuteCheck.resetIn / 1000)) } }
    );
  }
  const hourCheck = await authPerHour.check(`signup:${ip}`);
  if (!hourCheck.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(hourCheck.resetIn / 1000)) } }
    );
  }

  /* Parse and validate the JSON body with Zod */
  const body = await req.json();

  /* # Verify Turnstile CAPTCHA token (only enforced when configured) */
  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Bot verification failed. Please try again." },
      { status: 403 }
    );
  }

  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  /* ---- Check for Existing User ---- */
  const existingUser = await dbRetry(() =>
    prisma.user.findUnique({
      where: { email },
    })
  );

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 } // 409 Conflict
    );
  }

  /* ---- Hash the Password ---- */
  /* bcrypt.hash() with cost factor 12 (higher = more secure but slower) */
  /* The salt is automatically generated and embedded in the hash */
  const hashedPassword = await bcrypt.hash(password, 12);

  /* ---- Capture UTM Attribution Data ---- */
  // # Read UTM data from request body — frontend passes this from URL params / cookie
  // # This lets Marketing HQ attribute signups to specific campaigns and channels
  const utmData = body.utm;
  let referralSource: string | null = null;
  if (utmData && typeof utmData === "object") {
    // # Store all UTM params as a JSON string in the referralSource field
    // # Keys are normalised to utm_* so the funnel events API can parse them consistently
    referralSource = JSON.stringify({
      utm_source: (utmData as Record<string, unknown>).source ?? null,
      utm_medium: (utmData as Record<string, unknown>).medium ?? null,
      utm_campaign: (utmData as Record<string, unknown>).campaign ?? null,
      utm_term: (utmData as Record<string, unknown>).term ?? null,
      utm_content: (utmData as Record<string, unknown>).content ?? null,
    });
  }

  /* ---- Create the User in the Database ---- */
  const user = await dbRetry(() =>
    prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // # Spread referralSource only when UTM data was provided — avoids overwriting
        // # any default value and keeps the field null for non-attributed signups
        ...(referralSource ? { referralSource } : {}),
      },
    })
  );

  /* Log the successful signup */
  audit("auth.signup", { userId: user.id, email: user.email, ip });

  /* Send welcome email (fire-and-forget — don't block signup on email delivery) */
  getResend().emails.send({
    from: "JobPilot AI <noreply@jobpilotai.co>",
    to: email,
    subject: "Welcome to JobPilot AI",
    html: buildWelcomeEmail(name),
  }).catch((err) => { Sentry.captureException(err, { tags: { email_type: "welcome" } }); });

  /* Return success with the new user's info (never send password back) */
  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name },
    { status: 201 } // 201 Created
  );
});
