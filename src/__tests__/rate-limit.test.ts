import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows requests within the limit", () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 });
    const r1 = limiter.check("user-1");
    const r2 = limiter.check("user-1");
    const r3 = limiter.check("user-1");

    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding the limit", () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check("user-2");
    limiter.check("user-2");
    const r3 = limiter.check("user-2");

    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.resetIn).toBeGreaterThan(0);
  });

  it("tracks users independently", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });
    const rA = limiter.check("user-a");
    const rB = limiter.check("user-b");

    expect(rA.allowed).toBe(true);
    expect(rB.allowed).toBe(true);

    const rA2 = limiter.check("user-a");
    expect(rA2.allowed).toBe(false);
  });

  it("returns correct remaining count", () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
    const r = limiter.check("user-remain");
    expect(r.remaining).toBe(4);
  });

  it("provides resetIn when rate limited", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 10_000 });
    limiter.check("user-reset");
    const blocked = limiter.check("user-reset");

    expect(blocked.allowed).toBe(false);
    expect(blocked.resetIn).toBeGreaterThan(0);
    expect(blocked.resetIn).toBeLessThanOrEqual(10_000);
  });
});
