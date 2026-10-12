
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  validateContact,
  validateGrowthCall,
  addLead,
  forwardToWebhook,
  readAttribution,
  rateLimit,
} = vi.hoisted(() => ({
  validateContact: vi.fn(),
  validateGrowthCall: vi.fn(),
  addLead: vi.fn(),
  forwardToWebhook: vi.fn(),
  readAttribution: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/validation", () => ({
  validateContact,
  validateGrowthCall,
}));

vi.mock("@/lib/rate-limit", () => ({
  clientIp: () => "test-ip",
  rateLimit,
}));

vi.mock("@/lib/leads", () => ({
  addLead,
  forwardToWebhook,
}));

vi.mock("@/lib/email", () => ({
  sendLeadNotification: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/attribution", () => ({
  readAttribution,
}));

import { POST as contactPOST } from "../app/api/leads/contact/route";
import { POST as growthCallPOST } from "../app/api/leads/growth-call/route";

const makeRequest = (path: string) =>
  new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: true }),
  });

describe("public lead APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    rateLimit.mockReturnValue({
      allowed: true,
      retryAfterSeconds: 60,
    });

    readAttribution.mockResolvedValue({
      source: "website",
      landingPage: "/contact",
      utm: {},
    });
  });

  it("rejects invalid contact submissions", async () => {
    validateContact.mockReturnValue({
      errors: { email: "Invalid email" },
      value: null,
    });

    const response = await contactPOST(makeRequest("/api/leads/contact"));

    expect(response.status).toBe(400);
    expect(addLead).not.toHaveBeenCalled();
  });

  it("rejects invalid growth-call submissions", async () => {
    validateGrowthCall.mockReturnValue({
      errors: { name: "Name is required" },
      value: null,
    });

    const response = await growthCallPOST(
      makeRequest("/api/leads/growth-call"),
    );

    expect(response.status).toBe(400);
    expect(addLead).not.toHaveBeenCalled();
  });

  it("rejects submissions when rate limited", async () => {
    rateLimit.mockReturnValue({
      allowed: false,
      retryAfterSeconds: 60,
    });

    const response = await contactPOST(makeRequest("/api/leads/contact"));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(validateContact).not.toHaveBeenCalled();
    expect(addLead).not.toHaveBeenCalled();
  });

  it("returns 503 if saving a contact lead fails", async () => {
    validateContact.mockReturnValue({
      errors: {},
      value: {
        name: "Test User",
        business: "Test Business",
        phone: "9876543210",
        email: "test@example.com",
        subject: "Test",
        message: "Test message",
        contactMethod: "email",
      },
    });

    addLead.mockRejectedValue(new Error("Simulated database failure"));

    const response = await contactPOST(makeRequest("/api/leads/contact"));

    expect(response.status).toBe(503);
    expect(forwardToWebhook).not.toHaveBeenCalled();
  });

  it("returns 503 if saving a growth-call lead fails", async () => {
    validateGrowthCall.mockReturnValue({
      errors: {},
      value: {
        name: "Test User",
        business: "Test Business",
        phone: "9876543210",
        email: "test@example.com",
        industry: "Technology",
        city: "Bengaluru",
        instagram: "",
        challenge: "Growth",
        message: "Test message",
        contactMethod: "email",
      },
    });

    addLead.mockRejectedValue(new Error("Simulated database failure"));

    const response = await growthCallPOST(
      makeRequest("/api/leads/growth-call"),
    );

    expect(response.status).toBe(503);
    expect(forwardToWebhook).not.toHaveBeenCalled();
  });
});
