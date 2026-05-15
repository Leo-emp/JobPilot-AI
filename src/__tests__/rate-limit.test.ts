import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows requests within the limit", async () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 });
    const r1 = await limiter.check("user-1");
    const r2 = await limiter.check("user-1");
    const r3 = await limiter.check("user-1");

    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding the limit", async () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 });
    await limiter.check("user-2");
    await limiter.check("user-2");
    const r3 = await limiter.check("user-2");

    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.resetIn).toBeGreaterThan(0);
  });

  it("tracks users independently", async () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });
    const rA = await limiter.check("user-a");
    const rB = await limiter.check("user-b");

    expect(rA.allowed).toBe(true);
    expect(rB.allowed).toBe(true);

    const rA2 = await limiter.check("user-a");
    expect(rA2.allowed).toBe(false);
  });

  it("returns correct remaining count", async () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
    const r = await limiter.check("user-remain");
    expect(r.remaining).toBe(4);
  });

  it("provides resetIn when rate limited", async () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 10_000 });
    await limiter.check("user-reset");
    const blocked = await limiter.check("user-reset");

    expect(blocked.allowed).toBe(false);
    expect(blocked.resetIn).toBeGreaterThan(0);
    expect(blocked.resetIn).toBeLessThanOrEqual(10_000);
  });
});
