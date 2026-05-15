import { describe, it, expect, vi, beforeEach } from "vitest";
import { isLocked, recordFailure, resetFailures } from "@/lib/account-lock";

beforeEach(async () => {
  /* Reset by clearing failures for the test email */
  await resetFailures("test@example.com");
  await resetFailures("other@example.com");
});

describe("Account Lockout", () => {
  it("is not locked by default", async () => {
    const result = await isLocked("test@example.com");
    expect(result.locked).toBe(false);
  });

  it("is not locked after a few failures", async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailure("test@example.com");
    }
    expect((await isLocked("test@example.com")).locked).toBe(false);
  });

  it("locks after 10 consecutive failures", async () => {
    for (let i = 0; i < 10; i++) {
      await recordFailure("test@example.com");
    }
    const result = await isLocked("test@example.com");
    expect(result.locked).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets failures on successful login", async () => {
    for (let i = 0; i < 9; i++) {
      await recordFailure("test@example.com");
    }
    await resetFailures("test@example.com");
    await recordFailure("test@example.com");
    expect((await isLocked("test@example.com")).locked).toBe(false);
  });

  it("tracks accounts independently", async () => {
    for (let i = 0; i < 10; i++) {
      await recordFailure("test@example.com");
    }
    expect((await isLocked("test@example.com")).locked).toBe(true);
    expect((await isLocked("other@example.com")).locked).toBe(false);
  });

  it("is case-insensitive", async () => {
    for (let i = 0; i < 10; i++) {
      await recordFailure("Test@Example.COM");
    }
    expect((await isLocked("test@example.com")).locked).toBe(true);
  });

  it("unlocks after lockout expires", async () => {
    for (let i = 0; i < 10; i++) {
      await recordFailure("test@example.com");
    }
    expect((await isLocked("test@example.com")).locked).toBe(true);

    /* Fast-forward past lockout duration */
    vi.useFakeTimers();
    vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
    expect((await isLocked("test@example.com")).locked).toBe(false);
    vi.useRealTimers();
  });
});
