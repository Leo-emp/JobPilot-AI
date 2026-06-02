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
import { buildWelcomeEmail } from "@/lib/welcome-email";

/* # Lazy-init so missing env var doesn't crash the module on import */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function POST(req: NextRequest) {
  try {
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
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    /* ---- Check for Existing User ---- */
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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

    /* ---- Create the User in the Database ---- */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    /* Log the successful signup */
    audit("auth.signup", { userId: user.id, email: user.email, ip });

    /* Send welcome email (fire-and-forget — don't block signup on email delivery) */
    getResend().emails.send({
      from: "JobPilot AI <noreply@jobpilotai.co>",
      to: email,
      subject: "Welcome to JobPilot AI",
      html: buildWelcomeEmail(name),
    }).catch(() => {});

    /* Return success with the new user's info (never send password back) */
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 } // 201 Created
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
