"use client";

/**
 * Lightweight analytics layer.
 * Works with Google Analytics (gtag) and Meta Pixel when configured;
 * silently does nothing when neither is present.
 */

export type AnalyticsEvent =
  | "growth_call_form_submit"
  | "contact_form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "primary_cta_click"
  | "secondary_cta_click"
  | "service_page_view"
  | "insight_view"
  | "booking_click"
  | "audit_request"
  | "navigation_cta_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
  } catch {
    /* analytics must never break the UI */
  }
}
