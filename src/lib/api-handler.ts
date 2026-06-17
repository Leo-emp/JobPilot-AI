/* ============================================================
   API ROUTE WRAPPER — Global error handling + timeout for all API routes
   ============================================================
   Wraps any API handler with:
   - Request timeout (default 30s, prevents hanging requests)
   - try/catch + Sentry reporting
   - Clean 500 JSON response (never leaks internals)

   Usage:
     import { safeHandler, authHandler } from "@/lib/api-handler";
     export const GET = safeHandler(async (req) => { ... });
     export const POST = authHandler(async (req, session) => { ... });
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { TimeoutError } from "@/lib/with-timeout";
import { auth } from "@/lib/auth";

/* # Default request timeout — 30 seconds for most routes */
const DEFAULT_TIMEOUT_MS = 30_000;

interface SafeHandlerOptions {
  timeoutMs?: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type RouteHandler = (...args: any[]) => Promise<Response | NextResponse>;

/* # Session type passed to authHandler callbacks */
export interface AuthSession {
  user: { id: string; isAdmin?: boolean; email?: string; name?: string };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type AuthedRouteHandler = (req: NextRequest, session: AuthSession, ...rest: any[]) => Promise<Response | NextResponse>;

/* # authHandler — safeHandler + automatic session check
   Rejects with 401 if unauthenticated, passes verified session to handler */
export function authHandler(handler: AuthedRouteHandler, options?: SafeHandlerOptions): RouteHandler {
  return safeHandler(async (...args: any[]) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const req = args[0] as NextRequest;
    return handler(req, session as unknown as AuthSession, ...args.slice(1));
  }, options);
}

export function safeHandler(handler: RouteHandler, options?: SafeHandlerOptions): RouteHandler {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return async (...args: any[]) => {
    try {
      /* # Race the handler against a timeout to prevent compute waste */
      const result = await Promise.race([
        handler(...args),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new TimeoutError(timeoutMs)), timeoutMs)
        ),
      ]);
      return result;
    } catch (error: unknown) {
      const req = args[0] as NextRequest;
      const path = new URL(req.url).pathname;

      /* # Return 504 for timeouts, 500 for everything else */
      if (error instanceof TimeoutError) {
        Sentry.captureMessage(`Request timeout: ${req.method} ${path}`, {
          level: "error",
          tags: { component: "api", method: req.method, path },
        });
        console.error(`API timeout [${req.method} ${path}]: ${timeoutMs}ms`);
        return NextResponse.json(
          { error: "Request timed out. Please try again." },
          { status: 504 }
        );
      }

      Sentry.captureException(error, {
        tags: {
          component: "api",
          method: req.method,
          path,
        },
      });
      console.error(`API error [${req.method} ${path}]:`, error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  };
}
