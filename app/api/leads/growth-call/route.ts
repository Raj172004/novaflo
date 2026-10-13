import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateGrowthCall } from "@/lib/validation";
import {
  addLead,
  forwardToWebhook,
  type LeadRecord,
} from "@/lib/leads";
import { readAttribution } from "@/lib/attribution";
import { sendLeadNotification } from "@/lib/email";
import { readJsonBody } from "../../../../lib/request-body";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  const limit = rateLimit(`gc:${ip}`, {
    max: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
        },
      },
    );
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return NextResponse.json(
      { ok: false, error: body.error },
      { status: body.status },
    );
  }

  const result = validateGrowthCall(body.value);

  if (!result.value || Object.keys(result.errors).length > 0) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  let lead: LeadRecord;

  try {
    const attribution = await readAttribution();

    lead = await addLead({
      name: result.value.name,
      business: result.value.business,
      email: result.value.email,
      phone: result.value.phone,
      industry: result.value.industry,
      city: result.value.city,
      instagram: result.value.instagram || undefined,
      challenge: result.value.challenge,
      message: result.value.message || undefined,
      contactMethod: result.value.contactMethod,
      type: "growth_call",
      ...attribution,
    });
  } catch (error) {
    console.error("Failed to save growth-call lead:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to submit your request right now." },
      { status: 503 },
    );
  }

  const integrations = await Promise.allSettled([
    forwardToWebhook(lead),
    sendLeadNotification(lead),
  ]);

  for (const integration of integrations) {
    if (integration.status === "rejected") {
      console.error(
        "Growth-call lead integration failed:",
        integration.reason,
      );
    }
  }

  return NextResponse.json(
    { ok: true, id: lead.id },
    { status: 201 },
  );
}