
import { NextResponse } from "next/server";
import { validateGrowthCall } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { addLead, forwardToWebhook } from "@/lib/leads";
import { readAttribution } from "@/lib/attribution";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const { allowed, retryAfterSeconds } = rateLimit(`gc:${ip}`, {
    max: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { errors, value } = validateGrowthCall(body);

  if (!value) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const attribution = await readAttribution();

    const lead = await addLead({
      type: "growth_call",
      name: value.name,
      business: value.business,
      phone: value.phone,
      email: value.email,
      industry: value.industry,
      city: value.city,
      instagram: value.instagram || undefined,
      challenge: value.challenge,
      message: value.message || undefined,
      contactMethod: value.contactMethod,
      source: attribution.source,
      landingPage: attribution.landingPage,
      utm: attribution.utm,
    });

    await forwardToWebhook(lead);
    await sendLeadNotification(lead);

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Growth-call submission failed:", error);

    return NextResponse.json(
      { error: "We couldn't submit your request right now. Please try again." },
      { status: 503 },
    );
  }
}
