import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  adminEnabled: vi.fn(),
  createSessionValue: vi.fn(),
  verifyPassword: vi.fn(),
  clientIp: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  ADMIN_COOKIE: "nv_admin",
  adminEnabled: mocks.adminEnabled,
  createSessionValue: mocks.createSessionValue,
  verifyPassword: mocks.verifyPassword,
}));

vi.mock("@/lib/rate-limit", () => ({
  clientIp: mocks.clientIp,
  rateLimit: mocks.rateLimit,
}));

import { POST, DELETE } from "../app/api/admin/login/route";

function makeRequest(body: string, contentLength?: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (contentLength !== undefined) {
    headers.set("Content-Length", contentLength);
  }

  return new Request("http://localhost/api/admin/login", {
    method: "POST",
    headers,
    body,
  });
}

describe("admin login API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.adminEnabled.mockReturnValue(true);
    mocks.verifyPassword.mockImplementation(
      (password: string) => password === "correct-password",
    );
    mocks.createSessionValue.mockReturnValue("test-session-value");
    mocks.clientIp.mockReturnValue("test-admin-login");
    mocks.rateLimit.mockReturnValue({
      allowed: true,
      retryAfterSeconds: 60,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 when admin authentication is disabled", async () => {
    mocks.adminEnabled.mockReturnValue(false);
    expect((await POST(makeRequest('{"password":"correct-password"}'))).status)
      .toBe(503);
  });

  it("rejects invalid JSON", async () => {
    expect((await POST(makeRequest("{invalid"))).status).toBe(400);
  });

  it("rejects non-object JSON bodies", async () => {
    for (const body of ["null", "[]", '"text"', "42"]) {
      expect((await POST(makeRequest(body))).status).toBe(400);
    }
  });

  it("rejects oversized requests using Content-Length", async () => {
    expect((await POST(makeRequest('{"password":"x"}', "9000"))).status)
      .toBe(413);
  });

  it("rejects oversized bodies without Content-Length", async () => {
    const body = JSON.stringify({ password: "x".repeat(9000) });
    expect((await POST(makeRequest(body))).status).toBe(413);
  });

  it("rejects an incorrect password", async () => {
    expect((await POST(makeRequest('{"password":"wrong"}'))).status)
      .toBe(401);
  });

  it("rejects an excessively long password before verification", async () => {
    const response = await POST(
      makeRequest(JSON.stringify({ password: "x".repeat(1025) })),
    );
    expect(response.status).toBe(401);
    expect(mocks.verifyPassword).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    mocks.rateLimit.mockReturnValue({
      allowed: false,
      retryAfterSeconds: 120,
    });

    const response = await POST(makeRequest('{"password":"wrong"}'));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("120");
    expect(mocks.verifyPassword).not.toHaveBeenCalled();
  });

  it("creates an HttpOnly session cookie for valid credentials", async () => {
    const response = await POST(
      makeRequest('{"password":"correct-password"}'),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("nv_admin=test-session-value");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
    expect(cookie).toContain("Max-Age=43200");
  });

  it("clears the admin cookie on logout", async () => {
    const response = await DELETE();
    expect(response.status).toBe(200);

    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("nv_admin=");
    expect(cookie).toContain("Max-Age=0");
  });
});
