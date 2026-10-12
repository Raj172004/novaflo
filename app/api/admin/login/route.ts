
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminEnabled,
  createSessionValue,
  verifyPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

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

  let body: { password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  if (typeof body.password !== "string" || !verifyPassword(body.password)) {
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
