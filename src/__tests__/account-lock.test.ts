import { describe, it, expect, vi, beforeEach } from "vitest";
import { isLocked, recordFailure, resetFailures } from "@/lib/account-lock";

beforeEach(() => {
  /* Reset by clearing failures for the test email */
  resetFailures("test@example.com");
  resetFailures("other@example.com");
});

describe("Account Lockout", () => {
  it("is not locked by default", () => {
    const result = isLocked("test@example.com");
    expect(result.locked).toBe(false);
  });

  it("is not locked after a few failures", () => {
    for (let i = 0; i < 5; i++) {
      recordFailure("test@example.com");
    }
    expect(isLocked("test@example.com").locked).toBe(false);
  });

  it("locks after 10 consecutive failures", () => {
    for (let i = 0; i < 10; i++) {
      recordFailure("test@example.com");
    }
    const result = isLocked("test@example.com");
    expect(result.locked).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets failures on successful login", () => {
    for (let i = 0; i < 9; i++) {
      recordFailure("test@example.com");
    }
    resetFailures("test@example.com");
    recordFailure("test@example.com");
    expect(isLocked("test@example.com").locked).toBe(false);
  });

  it("tracks accounts independently", () => {
    for (let i = 0; i < 10; i++) {
      recordFailure("test@example.com");
    }
    expect(isLocked("test@example.com").locked).toBe(true);
    expect(isLocked("other@example.com").locked).toBe(false);
  });

  it("is case-insensitive", () => {
    for (let i = 0; i < 10; i++) {
      recordFailure("Test@Example.COM");
    }
    expect(isLocked("test@example.com").locked).toBe(true);
  });

  it("unlocks after lockout expires", () => {
    for (let i = 0; i < 10; i++) {
      recordFailure("test@example.com");
    }
    expect(isLocked("test@example.com").locked).toBe(true);

    /* Fast-forward past lockout duration */
    vi.useFakeTimers();
    vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
    expect(isLocked("test@example.com").locked).toBe(false);
    vi.useRealTimers();
  });
});
