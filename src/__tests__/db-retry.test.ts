import { describe, it, expect, vi } from "vitest";
import { dbRetry } from "@/lib/db-retry";

describe("dbRetry", () => {
  it("returns result on first try when operation succeeds", async () => {
    const result = await dbRetry(() => Promise.resolve("ok"));
    expect(result).toBe("ok");
  });

  it("retries on transient connection errors", async () => {
    const op = vi.fn()
      .mockRejectedValueOnce(new Error("ECONNRESET"))
      .mockResolvedValueOnce("recovered");

    const result = await dbRetry(op);
    expect(result).toBe("recovered");
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("retries on database locked errors", async () => {
    const op = vi.fn()
      .mockRejectedValueOnce(new Error("SQLITE_BUSY: database is locked"))
      .mockResolvedValueOnce("unlocked");

    const result = await dbRetry(op);
    expect(result).toBe("unlocked");
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("retries on fetch failed errors (Turso cloud)", async () => {
    const op = vi.fn()
      .mockRejectedValueOnce(new Error("fetch failed"))
      .mockRejectedValueOnce(new Error("Connection refused"))
      .mockResolvedValueOnce("connected");

    const result = await dbRetry(op);
    expect(result).toBe("connected");
    expect(op).toHaveBeenCalledTimes(3);
  });

  it("does NOT retry on non-transient errors (e.g. unique constraint)", async () => {
    const op = vi.fn()
      .mockRejectedValue(new Error("Unique constraint failed on the fields: (`email`)"));

    await expect(dbRetry(op)).rejects.toThrow("Unique constraint");
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on validation errors", async () => {
    const op = vi.fn()
      .mockRejectedValue(new Error("Invalid `prisma.user.create()` invocation"));

    await expect(dbRetry(op)).rejects.toThrow("Invalid");
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("throws after exhausting all retries", async () => {
    const op = vi.fn()
      .mockRejectedValue(new Error("ECONNREFUSED"));

    await expect(dbRetry(op, { maxRetries: 2 })).rejects.toThrow("ECONNREFUSED");
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("respects custom maxRetries option", async () => {
    const op = vi.fn()
      .mockRejectedValue(new Error("ETIMEDOUT"));

    await expect(dbRetry(op, { maxRetries: 1 })).rejects.toThrow("ETIMEDOUT");
    expect(op).toHaveBeenCalledTimes(1);
  });
});
