/* ============================================================
   CRON AUTH TESTS — Timing-safe secret verification
   ============================================================ */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { verifyCronSecret } from "@/lib/cron-auth";

describe("verifyCronSecret", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    /* # Reset env before each test */
    process.env = { ...ORIGINAL_ENV, CRON_SECRET: "test-secret-123" };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns null for valid Bearer token", () => {
    /* # Valid auth should pass — null means no error */
    const req = new NextRequest("http://localhost/api/cron/test", {
      headers: { authorization: "Bearer test-secret-123" },
    });
    const result = verifyCronSecret(req);
    expect(result).toBeNull();
  });

  it("returns 401 for invalid token", () => {
    /* # Wrong secret should be rejected */
    const req = new NextRequest("http://localhost/api/cron/test", {
      headers: { authorization: "Bearer wrong-secret" },
    });
    const result = verifyCronSecret(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 for missing Authorization header", () => {
    /* # No header at all should be rejected */
    const req = new NextRequest("http://localhost/api/cron/test");
    const result = verifyCronSecret(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 when CRON_SECRET is not configured", () => {
    /* # Missing env var should fail closed, not open */
    delete process.env.CRON_SECRET;
    const req = new NextRequest("http://localhost/api/cron/test", {
      headers: { authorization: "Bearer anything" },
    });
    const result = verifyCronSecret(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 for non-Bearer auth scheme", () => {
    /* # Basic auth or other schemes should not work */
    const req = new NextRequest("http://localhost/api/cron/test", {
      headers: { authorization: "Basic dGVzdDp0ZXN0" },
    });
    const result = verifyCronSecret(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });
});
