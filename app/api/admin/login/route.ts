import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminEnabled,
  createSessionValue,
  verifyPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;
const MAX_BODY_BYTES = 8 * 1024;
const MAX_PASSWORD_LENGTH = 1024;

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured correctly." },
      { status: 503 },
    );
  }

  const ip = clientIp(request.headers);
  const { allowed, retryAfterSeconds } = rateLimit(`admin:${ip}`, {
    max: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) ||
      Number(contentLength) > MAX_BODY_BYTES)
  ) {
    return NextResponse.json(
      { error: "Request body is too large or invalid." },
      { status: 413 },
    );
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: "Unable to read request." },
      { status: 400 },
    );
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 },
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const password = (body as Record<string, unknown>).password;

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > MAX_PASSWORD_LENGTH ||
    !verifyPassword(password)
  ) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  try {
    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: ADMIN_COOKIE,
      value: createSessionValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Admin session creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create an admin session." },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
