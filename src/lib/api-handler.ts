/* ============================================================
   API ROUTE WRAPPER — Global error handling for all API routes
   ============================================================
   Wraps any API handler with try/catch + Sentry reporting.
   Prevents raw 500 errors from reaching users.

   Usage:
     import { safeHandler } from "@/lib/api-handler";
     export const GET = safeHandler(async (req) => { ... });
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

type Handler = (req: NextRequest, ctx?: unknown) => Promise<Response | NextResponse>;

export function safeHandler(handler: Handler): Handler {
  return async (req: NextRequest, ctx?: unknown) => {
    try {
      return await handler(req, ctx);
    } catch (error: unknown) {
      Sentry.captureException(error, {
        tags: {
          component: "api",
          method: req.method,
          path: new URL(req.url).pathname,
        },
      });
      console.error(`API error [${req.method} ${new URL(req.url).pathname}]:`, error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  };
}
