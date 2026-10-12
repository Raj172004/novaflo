import { beforeEach, describe, expect, it, vi } from "vitest";
import { clientIp, rateLimit } from "../lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the configured limit", () => {
    const options = { max: 2, windowMs: 60_000 };

    expect(rateLimit("test-allowed", options).allowed).toBe(true);
    expect(rateLimit("test-allowed", options).allowed).toBe(true);
  });

  it("blocks requests after the configured limit", () => {
    const options = { max: 1, windowMs: 60_000 };

    expect(rateLimit("test-blocked", options).allowed).toBe(true);

    const result = rateLimit("test-blocked", options);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets a bucket after its window expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const options = { max: 1, windowMs: 1_000 };

    expect(rateLimit("test-expiry", options).allowed).toBe(true);
    expect(rateLimit("test-expiry", options).allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    expect(rateLimit("test-expiry", options).allowed).toBe(true);
  });

  it("uses separate limits for separate keys", () => {
    const options = { max: 1, windowMs: 60_000 };

    expect(rateLimit("test-user-a", options).allowed).toBe(true);
    expect(rateLimit("test-user-b", options).allowed).toBe(true);
  });
});

describe("clientIp", () => {
  it("reads the first forwarded IP address", () => {
    const headers = new Headers({
      "x-forwarded-for": "192.0.2.10, 10.0.0.1",
    });

    expect(clientIp(headers)).toBe("192.0.2.10");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "192.0.2.20" });

    expect(clientIp(headers)).toBe("192.0.2.20");
  });

  it("returns unknown when no IP headers exist", () => {
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
