/**
 * Isomorphic validation shared by client forms and server API routes.
 * The server always re-validates; client validation is UX only.
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
  nickname?: string; // honeypot
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
  nickname?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** 10–15 digits after stripping separators; Indian numbers commonly 10. */
const PHONE_RE = /^\+?[\d\s\-()]{10,17}$/;
const IG_RE = /^[a-zA-Z0-9._]{1,30}$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export const CONTACT_METHODS = ["Phone Call", "WhatsApp", "Email"] as const;

export function validateGrowthCall(data: unknown): {
  errors: FieldErrors;
  value: GrowthCallInput | null;
} {
  const d = (data ?? {}) as Record<string, unknown>;
  const value: GrowthCallInput = {
    name: str(d.name),
    business: str(d.business),
    phone: str(d.phone),
    email: str(d.email),
    industry: str(d.industry),
    city: str(d.city),
    instagram: str(d.instagram).replace(/^@/, ""),
    challenge: str(d.challenge),
    contactMethod: str(d.contactMethod) || "Phone Call",
    message: str(d.message),
    consent: d.consent === true || d.consent === "true",
    nickname: str(d.nickname),
  };

  const errors: FieldErrors = {};
  if (value.name.length < 2) errors.name = "Please enter your full name.";
  if (value.business.length < 2) errors.business = "Please enter your business name.";
  const digits = value.phone.replace(/\D/g, "");
  if (!PHONE_RE.test(value.phone) || digits.length < 10 || digits.length > 15)
    errors.phone = "Please enter a valid phone number.";
  if (!EMAIL_RE.test(value.email)) errors.email = "Please enter a valid email address.";
  if (value.industry.length < 2) errors.industry = "Please tell us your business type or industry.";
  if (value.city.length < 2) errors.city = "Please enter your city or location.";
  if (value.instagram && !IG_RE.test(value.instagram))
    errors.instagram = "Instagram handles may only contain letters, numbers, dots and underscores.";
  if (value.challenge.length < 5)
    errors.challenge = "Please briefly describe your main marketing challenge.";
  if (!CONTACT_METHODS.includes(value.contactMethod as (typeof CONTACT_METHODS)[number]))
    errors.contactMethod = "Please choose a preferred contact method.";
  if (value.message.length > 2000) errors.message = "Message is too long (max 2000 characters).";
  if (!value.consent) errors.consent = "Please accept to continue.";
  if (value.nickname) errors.nickname = "Spam detected."; // honeypot: silently reject

  return { errors, value: Object.keys(errors).length ? null : value };
}

export function validateContact(data: unknown): {
  errors: FieldErrors;
  value: ContactInput | null;
} {
  const d = (data ?? {}) as Record<string, unknown>;
  const value: ContactInput = {
    name: str(d.name),
    business: str(d.business),
    email: str(d.email),
    phone: str(d.phone),
    subject: str(d.subject),
    message: str(d.message),
    contactMethod: str(d.contactMethod) || "Email",
    consent: d.consent === true || d.consent === "true",
    nickname: str(d.nickname),
  };

  const errors: FieldErrors = {};
  if (value.name.length < 2) errors.name = "Please enter your name.";
  if (value.business.length < 2) errors.business = "Please enter your business name.";
  if (!EMAIL_RE.test(value.email)) errors.email = "Please enter a valid email address.";
  if (value.phone) {
    const digits = value.phone.replace(/\D/g, "");
    if (!PHONE_RE.test(value.phone) || digits.length < 10 || digits.length > 15)
      errors.phone = "Please enter a valid phone number (or leave it empty).";
  }
  if (value.subject.length < 3) errors.subject = "Please add a short subject.";
  if (value.message.length < 10) errors.message = "Please write a short message (at least 10 characters).";
  if (value.message.length > 2000) errors.message = "Message is too long (max 2000 characters).";
  if (!CONTACT_METHODS.includes(value.contactMethod as (typeof CONTACT_METHODS)[number]))
    errors.contactMethod = "Please choose a preferred contact method.";
  if (!value.consent) errors.consent = "Please accept to continue.";
  if (value.nickname) errors.nickname = "Spam detected.";

  return { errors, value: Object.keys(errors).length ? null : value };
}
