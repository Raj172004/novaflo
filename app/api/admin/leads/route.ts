import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readLeads, updateLeadStatus } from "@/lib/leads";
import { leadStatuses, type LeadStatus } from "@/lib/config";
import { readJsonBody } from "../../../../lib/request-body";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await readLeads();
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Failed to retrieve admin leads:", error);

    return NextResponse.json(
      { error: "Unable to load leads right now. Please try again." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return NextResponse.json(
      { error: body.error },
      { status: body.status },
    );
  }

  if (
    typeof body.value !== "object" ||
    body.value === null ||
    Array.isArray(body.value)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = body.value as Record<string, unknown>;

  if (
    typeof payload.id !== "string" ||
    payload.id.trim().length === 0 ||
    typeof payload.status !== "string" ||
    !leadStatuses.includes(payload.status as LeadStatus)
  ) {
    return NextResponse.json(
      { error: "Invalid lead ID or status." },
      { status: 400 },
    );
  }

  try {
    const updated = await updateLeadStatus(
      payload.id.trim(),
      payload.status as LeadStatus,
    );

    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update lead status:", error);

    return NextResponse.json(
      { error: "Unable to update the lead right now. Please try again." },
      { status: 503 },
    );
  }
}
