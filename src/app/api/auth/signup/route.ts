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

const resend = new Resend(process.env.RESEND_API_KEY);

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
    resend.emails.send({
      from: "JobPilot AI <noreply@jobpilotai.co>",
      to: email,
      subject: "Welcome to JobPilot AI — let's land your dream job",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">Welcome aboard, ${name}!</h1>
          </div>
          <p style="line-height: 1.7; font-size: 16px;">
            You're all set. JobPilot AI is your personal career co-pilot — here's what you can do right now:
          </p>
          <ul style="line-height: 2; font-size: 15px; padding-left: 20px;">
            <li><strong>Upload your resume</strong> — get an instant ATS score and improvement tips</li>
            <li><strong>Search for jobs</strong> — AI-matched to your skills and experience</li>
            <li><strong>Generate cover letters</strong> — tailored to each job in seconds</li>
            <li><strong>Practice interviews</strong> — AI mock interviews with real-time feedback</li>
          </ul>
          <div style="text-align: center; margin: 36px 0;">
            <a href="https://jobpilotai.co/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4338CA, #7C3AED); color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Go to Dashboard
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6; text-align: center;">
            Questions? Just reply to this email — we read every message.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            JobPilot AI — Your AI-powered career co-pilot
          </p>
        </div>
      `,
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
