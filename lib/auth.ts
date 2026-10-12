
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "nv_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function signingSecret(): string {
  const secret = process.env.LEADS_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error("LEADS_SECRET must contain at least 32 characters.");
  }

  return secret;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminEnabled(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD?.trim() &&
    process.env.LEADS_SECRET?.trim() &&
    process.env.LEADS_SECRET.trim().length >= 32
  );
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  return safeEqual(input, expected);
}

export function createSessionValue(): string {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  const signature = createHmac("sha256", signingSecret())
    .update(expiresAt)
    .digest("hex");

  return `${expiresAt}.${signature}`;
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;

  const separator = value.indexOf(".");
  if (separator <= 0) return false;

  const expiresAt = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  if (!/^\d+$/.test(expiresAt) || !/^[a-f0-9]{64}$/.test(signature)) {
    return false;
  }

  const expiry = Number(expiresAt);
  if (!Number.isSafeInteger(expiry) || expiry <= Date.now()) return false;

  try {
    const expectedSignature = createHmac("sha256", signingSecret())
      .update(expiresAt)
      .digest("hex");

    return safeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!adminEnabled()) return false;

  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(ADMIN_COOKIE)?.value);
}
