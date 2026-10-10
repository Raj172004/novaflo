/**
 * Central Novaflo configuration.
 * All optional integrations / contact details come from env vars.
 * The site must remain fully functional when nothing is configured.
 */

function env(key: string, fallback = ""): string {
  return (process.env[key] ?? fallback).trim();
}

export const siteConfig = {
  name: "Novaflo",
  tagline: "Make your business the trusted name customers remember.",
  description:
    "Novaflo is a social media growth agency helping ambitious businesses build a professional online presence through strategy, premium content and transparent reporting.",
  url: env("NEXT_PUBLIC_SITE_URL", "https://novaflo.in"),
  location: env("NEXT_PUBLIC_NOVAFLO_LOCATION"),
  /* Verified contact details — hidden on the website until configured */
  email: env("NEXT_PUBLIC_NOVAFLO_EMAIL"),
  phone: env("NEXT_PUBLIC_NOVAFLO_PHONE"),
  whatsapp: env("NEXT_PUBLIC_NOVAFLO_WHATSAPP"),
  instagram: env("NEXT_PUBLIC_NOVAFLO_INSTAGRAM"),
  /* Integrations */
  gaId: env("NEXT_PUBLIC_GA_ID"),
  metaPixelId: env("NEXT_PUBLIC_META_PIXEL_ID"),
  bookingUrl: env("BOOKING_URL"),
  crmWebhookUrl: env("CRM_WEBHOOK_URL"),
} as const;

export const whatsappMessage =
  env("NEXT_PUBLIC_WHATSAPP_MESSAGE") ||
  "Hi Novaflo, I would like to discuss social media growth for my business.";

/** Normalises a phone/WhatsApp number to digits-only international form. */
export function normalizeNumber(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function whatsappLink(source?: string): string | null {
  const digits = normalizeNumber(siteConfig.whatsapp);
  if (!digits) return null;
  const text = encodeURIComponent(
    source ? `${whatsappMessage} (via ${source})` : whatsappMessage
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function bookingLink(): string | null {
  return siteConfig.bookingUrl || null;
}

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];
