import "server-only";
import { cookies } from "next/headers";
import { ATTRIBUTION_COOKIE } from "./attribution-keys";

export { ATTRIBUTION_COOKIE };

/**
 * Last-touch UTM / landing-page attribution.
 * The AttributionCapture client component stores first-party cookies on
 * landing; API routes read them here and persist the values with the lead.
 */

export interface Attribution {
  source: string;
  landingPage: string;
  utm: Record<string, string>;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function safeParse(value: string | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    const json = JSON.parse(decodeURIComponent(value));
    return typeof json === "object" && json !== null ? json : {};
  } catch {
    return {};
  }
}

export async function readAttribution(): Promise<Attribution> {
  const store = await cookies();
  const raw = store.get(ATTRIBUTION_COOKIE)?.value;
  const data = safeParse(raw);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = data[key];
    if (typeof v === "string" && v) utm[key] = v.slice(0, 200);
  }
  return {
    source: typeof data.source === "string" ? data.source.slice(0, 200) : "website",
    landingPage: typeof data.landingPage === "string" ? data.landingPage.slice(0, 500) : "/",
    utm,
  };
}
