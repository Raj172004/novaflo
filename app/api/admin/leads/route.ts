
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readLeads, updateLeadStatus } from "@/lib/leads";
import { leadStatuses, type LeadStatus } from "@/lib/config";

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

  let body: { id?: unknown; status?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body.id !== "string" ||
    body.id.trim().length === 0 ||
    typeof body.status !== "string" ||
    !leadStatuses.includes(body.status as LeadStatus)
  ) {
    return NextResponse.json(
      { error: "Invalid lead ID or status." },
      { status: 400 },
    );
  }

  try {
    const updated = await updateLeadStatus(
      body.id.trim(),
      body.status as LeadStatus,
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
