import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { addLead, forwardToWebhook } from "@/lib/leads";
import { readAttribution } from "@/lib/attribution";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const { allowed, retryAfterSeconds } = rateLimit(`ct:${ip}`, { max: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { errors, value } = validateContact(body);
  if (!value) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const attribution = await readAttribution();

  const lead = await addLead({
    type: "contact",
    name: value.name,
    business: value.business,
    phone: value.phone,
    email: value.email,
    subject: value.subject,
    message: value.message,
    contactMethod: value.contactMethod,
    source: attribution.source,
    landingPage: attribution.landingPage,
    utm: attribution.utm,
  });

  await forwardToWebhook(lead);

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
