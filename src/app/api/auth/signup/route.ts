/* ============================================================
   SIGNUP API ROUTE - Create New User Account
   ============================================================
   Handles POST requests to /api/auth/signup
   Validates input, hashes password with bcrypt, creates user in DB.
   Returns the new user's ID and email on success.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    /* Parse the JSON body from the request */
    const { name, email, password } = await req.json();

    /* ---- Input Validation ---- */
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    /* Password must be at least 8 characters for security */
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

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

    /* Return success with the new user's info (never send password back) */
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
