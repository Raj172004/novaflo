
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  adminEnabled,
  createSessionValue,
  isValidSession,
  verifyPassword,
} from "../lib/auth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin authentication", () => {
  it("disables admin access when required secrets are missing", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("LEADS_SECRET", "");

    expect(adminEnabled()).toBe(false);
  });

  it("requires a sufficiently long signing secret", () => {
    vi.stubEnv("ADMIN_PASSWORD", "test-password");
    vi.stubEnv("LEADS_SECRET", "short");

    expect(adminEnabled()).toBe(false);
  });

  it("accepts configured admin credentials", () => {
    vi.stubEnv("ADMIN_PASSWORD", "test-password");
    vi.stubEnv("LEADS_SECRET", "a".repeat(64));

    expect(adminEnabled()).toBe(true);
    expect(verifyPassword("test-password")).toBe(true);
    expect(verifyPassword("wrong-password")).toBe(false);
  });

  it("creates a valid session value", () => {
    vi.stubEnv("ADMIN_PASSWORD", "test-password");
    vi.stubEnv("LEADS_SECRET", "a".repeat(64));

    const session = createSessionValue();

    expect(isValidSession(session)).toBe(true);
  });

  it("rejects malformed and modified session values", () => {
    vi.stubEnv("ADMIN_PASSWORD", "test-password");
    vi.stubEnv("LEADS_SECRET", "a".repeat(64));

    const session = createSessionValue();

    expect(isValidSession(undefined)).toBe(false);
    expect(isValidSession("invalid")).toBe(false);
    expect(isValidSession(`${session}tampered`)).toBe(false);
  });
});
