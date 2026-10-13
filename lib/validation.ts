
/**
 * Shared client/server validation.
 * Server-side API routes must always validate incoming data again.
 */

export type FieldErrors = Record<string, string>;

export interface GrowthCallInput {
  name: string;
  business: string;
  phone: string;
  email: string;
  industry: string;
  city: string;
  instagram: string;
  challenge: string;
  contactMethod: string;
  message: string;
  consent: boolean;
  nickname?: string;
}

export interface ContactInput {
  name: string;
  business: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactMethod: string;
  consent: boolean;
  nickname?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()]{10,17}$/;
const IG_RE = /^[a-zA-Z0-9._]{1,30}$/;

export const CONTACT_METHODS = ["Phone Call", "WhatsApp", "Email"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

function validPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return PHONE_RE.test(value) && digits.length >= 10 && digits.length <= 15;
}

function addMaxLengthError(
  errors: FieldErrors,
  field: string,
  value: string,
  max: number,
): void {
  if (value.length > max) {
    errors[field] = `Maximum length is ${max} characters.`;
  }
}

export function validateGrowthCall(data: unknown): {
  errors: FieldErrors;
  value: GrowthCallInput | null;
} {
  if (!isRecord(data)) {
    return {
      errors: { request: "Invalid request body." },
      value: null,
    };
  }

  const value: GrowthCallInput = {
    name: str(data.name),
    business: str(data.business),
    phone: str(data.phone),
    email: str(data.email),
    industry: str(data.industry),
    city: str(data.city),
    instagram: str(data.instagram).replace(/^@/, ""),
    challenge: str(data.challenge),
    contactMethod: str(data.contactMethod) || "Phone Call",
    message: str(data.message),
    consent: data.consent === true || data.consent === "true",
    nickname: str(data.nickname),
  };

  const errors: FieldErrors = {};

  if (value.name.length < 2) errors.name = "Please enter your full name.";
  if (value.business.length < 2) errors.business = "Please enter your business name.";
  if (!validPhone(value.phone)) errors.phone = "Please enter a valid phone number.";
  if (!validEmail(value.email)) errors.email = "Please enter a valid email address.";
  if (value.industry.length < 2) errors.industry = "Please tell us your business type or industry.";
  if (value.city.length < 2) errors.city = "Please enter your city or location.";

  if (value.instagram && !IG_RE.test(value.instagram)) {
    errors.instagram = "Instagram handles may only contain letters, numbers, dots and underscores.";
  }

  if (value.challenge.length < 5) {
    errors.challenge = "Please briefly describe your main marketing challenge.";
  }

  if (!CONTACT_METHODS.includes(value.contactMethod as (typeof CONTACT_METHODS)[number])) {
    errors.contactMethod = "Please choose a preferred contact method.";
  }

  if (!value.consent) errors.consent = "Please accept to continue.";
  if (value.nickname) errors.nickname = "Spam detected.";

  addMaxLengthError(errors, "name", value.name, 120);
  addMaxLengthError(errors, "business", value.business, 160);
  addMaxLengthError(errors, "email", value.email, 254);
  addMaxLengthError(errors, "phone", value.phone, 30);
  addMaxLengthError(errors, "industry", value.industry, 100);
  addMaxLengthError(errors, "city", value.city, 100);
  addMaxLengthError(errors, "challenge", value.challenge, 1000);
  addMaxLengthError(errors, "message", value.message, 2000);
  addMaxLengthError(errors, "nickname", value.nickname ?? "", 200);

  return { errors, value: Object.keys(errors).length ? null : value };
}

export function validateContact(data: unknown): {
  errors: FieldErrors;
  value: ContactInput | null;
} {
  if (!isRecord(data)) {
    return {
      errors: { request: "Invalid request body." },
      value: null,
    };
  }

  const value: ContactInput = {
    name: str(data.name),
    business: str(data.business),
    email: str(data.email),
    phone: str(data.phone),
    subject: str(data.subject),
    message: str(data.message),
    contactMethod: str(data.contactMethod) || "Email",
    consent: data.consent === true || data.consent === "true",
    nickname: str(data.nickname),
  };

  const errors: FieldErrors = {};

  if (value.name.length < 2) errors.name = "Please enter your name.";
  if (value.business.length < 2) errors.business = "Please enter your business name.";
  if (!validEmail(value.email)) errors.email = "Please enter a valid email address.";

  if (value.phone && !validPhone(value.phone)) {
    errors.phone = "Please enter a valid phone number (or leave it empty).";
  }

  if (value.subject.length < 3) errors.subject = "Please add a short subject.";
  if (value.message.length < 10) {
    errors.message = "Please write a short message (at least 10 characters).";
  }

  if (!CONTACT_METHODS.includes(value.contactMethod as (typeof CONTACT_METHODS)[number])) {
    errors.contactMethod = "Please choose a preferred contact method.";
  }

  if (!value.consent) errors.consent = "Please accept to continue.";
  if (value.nickname) errors.nickname = "Spam detected.";

  addMaxLengthError(errors, "name", value.name, 120);
  addMaxLengthError(errors, "business", value.business, 160);
  addMaxLengthError(errors, "email", value.email, 254);
  addMaxLengthError(errors, "phone", value.phone, 30);
  addMaxLengthError(errors, "subject", value.subject, 160);
  addMaxLengthError(errors, "message", value.message, 2000);
  addMaxLengthError(errors, "nickname", value.nickname ?? "", 200);

  return { errors, value: Object.keys(errors).length ? null : value };
}
