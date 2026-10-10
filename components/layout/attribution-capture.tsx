"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution-keys";

/**
 * Stores first-party UTM / landing-page attribution in a cookie on landing,
 * so API routes can persist it with lead submissions.
 * Rendered once in the root layout.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
        const v = params.get(key);
        if (v) utm[key] = v;
      }
      const hasUtm = Object.keys(utm).length > 0;
      const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`))
        ?.split("=")[1];

      if (!hasUtm && existing) return; // keep first/last-touch as-is

      const payload = {
        ...utm,
        source: utm.utm_source ?? "website",
        landingPage: window.location.pathname + (window.location.search || ""),
        ts: new Date().toISOString(),
      };
      const maxAge = 60 * 60 * 24 * 30; // 30 days, first-party only
      document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(
        JSON.stringify(payload)
      )}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch {
      /* attribution must never break the page */
    }
  }, []);

  return null;
}
