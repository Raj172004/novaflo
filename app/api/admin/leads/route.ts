import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readLeads, updateLeadStatus } from "@/lib/leads";
import { leadStatuses, type LeadStatus } from "@/lib/config";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await readLeads();
  // newest first
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ leads });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = (await request.json()) as { id?: string; status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = String(body.id ?? "");
  const status = String(body.status ?? "") as LeadStatus;
  if (!id || !leadStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid lead id or status." }, { status: 400 });
  }
  const updated = await updateLeadStatus(id, status);
  if (!updated) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
