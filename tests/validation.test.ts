import { describe, expect, it } from "vitest";
import { validateContact, validateGrowthCall } from "../lib/validation";

const validContact = {
  name: "Test User",
  business: "Test Business",
  email: "test@example.com",
  phone: "9876543210",
  subject: "Website enquiry",
  message: "I would like to know more about your services.",
  contactMethod: "Email",
  consent: true,
};

const validGrowthCall = {
  name: "Test User",
  business: "Test Business",
  phone: "9876543210",
  email: "test@example.com",
  industry: "Retail",
  city: "Anantapur",
  instagram: "test.business",
  challenge: "I need more qualified leads.",
  contactMethod: "Phone Call",
  message: "Please contact me about your services.",
  consent: true,
};

describe("server-side form validation", () => {
  it("accepts a valid contact request", () => {
    expect(validateContact(validContact).value).not.toBeNull();
  });

  it("rejects null, arrays, and primitive request bodies", () => {
    for (const body of [null, [], "hello", 42]) {
      expect(validateContact(body).value).toBeNull();
      expect(validateGrowthCall(body).value).toBeNull();
    }
  });

  it("rejects oversized contact messages", () => {
    const result = validateContact({
      ...validContact,
      message: "x".repeat(2001),
    });
    expect(result.value).toBeNull();
    expect(result.errors.message).toBeDefined();
  });

  it("rejects oversized names", () => {
    const result = validateContact({
      ...validContact,
      name: "x".repeat(121),
    });
    expect(result.value).toBeNull();
    expect(result.errors.name).toBeDefined();
  });

  it("rejects missing consent", () => {
    expect(
      validateContact({ ...validContact, consent: false }).value,
    ).toBeNull();
  });

  it("rejects the honeypot field when populated", () => {
    expect(
      validateContact({ ...validContact, nickname: "bot" }).value,
    ).toBeNull();
  });

  it("accepts a valid growth-call request", () => {
    expect(validateGrowthCall(validGrowthCall).value).not.toBeNull();
  });

  it("rejects oversized growth-call challenge text", () => {
    const result = validateGrowthCall({
      ...validGrowthCall,
      challenge: "x".repeat(1001),
    });
    expect(result.value).toBeNull();
    expect(result.errors.challenge).toBeDefined();
  });
});

