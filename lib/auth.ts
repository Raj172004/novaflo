import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Server-side admin authentication.
 * Enabled only when ADMIN_PASSWORD is set. The session cookie is an HMAC
 * of the password signed with LEADS_SECRET (or a derived fallback).
 */

export const ADMIN_COOKIE = "nv_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function signingSecret(): string {
  return (
    process.env.LEADS_SECRET?.trim() ||
    `nv-fallback::${process.env.ADMIN_PASSWORD?.trim() || "none"}`
  );
}

function expectedToken(): string {
  return createHmac("sha256", signingSecret())
    .update(`admin:${process.env.ADMIN_PASSWORD?.trim()}`)
    .digest("hex");
}

export function adminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return safeEqual(input.trim(), expected);
}

export function createSessionValue(): string {
  const payload = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", signingSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const expectedSig = createHmac("sha256", signingSecret()).update(payload).digest("hex");
  if (!safeEqual(sig, expectedSig)) return false;
  return Number(payload) > Date.now();
}

/** Check the current request's admin session. Call from server components/routes. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(ADMIN_COOKIE)?.value);
}
