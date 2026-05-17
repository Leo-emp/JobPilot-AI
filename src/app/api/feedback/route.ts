/* ============================================================
   FEEDBACK API — User Feedback Collection
   ============================================================
   POST /api/feedback
   Accepts user feedback from the in-app widget and logs it
   via the audit system. No database writes — logs go to
   Vercel's log drain / Sentry breadcrumbs for review.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { z } from "zod";

/* # Validate feedback payload */
const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "improvement", "other"]),
  message: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  /* # Authenticate — only logged-in users can submit feedback */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* # Parse and validate the request body */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid feedback data" }, { status: 400 });
  }

  /* # Log the feedback via audit system (captured by Vercel log drain) */
  audit("feedback.submitted", {
    userId: session.user.id,
    email: session.user.email || undefined,
    category: parsed.data.category,
    detail: parsed.data.message,
  });

  return NextResponse.json({ success: true });
}
