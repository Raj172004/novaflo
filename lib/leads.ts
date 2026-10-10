import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Zero-dependency lead storage.
 * Writes leads to a JSON file outside the public webroot (default ./.data).
 * When CRM_WEBHOOK_URL is configured, submissions are also forwarded.
 * Swap this module for a database integration later — the interface is tiny.
 */

export interface LeadRecord {
  id: string;
  createdAt: string;
  type: "growth_call" | "contact";
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  name: string;
  business: string;
  phone: string;
  email: string;
  industry?: string;
  city?: string;
  instagram?: string;
  challenge?: string;
  subject?: string;
  message?: string;
  contactMethod: string;
  source: string;
  landingPage?: string;
  utm: Record<string, string>;
}

function leadsDir(): string {
  return process.env.LEADS_DIR || path.join(process.cwd(), ".data");
}

function leadsFile(): string {
  return path.join(leadsDir(), "leads.json");
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(leadsDir(), { recursive: true });
}

export async function readLeads(): Promise<LeadRecord[]> {
  try {
    const raw = await fs.readFile(leadsFile(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeLeads(leads: LeadRecord[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(leadsFile(), JSON.stringify(leads, null, 2), "utf8");
}

export async function addLead(
  lead: Omit<LeadRecord, "id" | "createdAt" | "status">
): Promise<LeadRecord> {
  const record: LeadRecord = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const leads = await readLeads();
  leads.push(record);
  await writeLeads(leads);
  return record;
}

export async function updateLeadStatus(id: string, status: LeadRecord["status"]): Promise<boolean> {
  const leads = await readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  leads[idx].status = status;
  await writeLeads(leads);
  return true;
}

/** Fire-and-forget forwarding to CRM/automation webhook when configured. */
export async function forwardToWebhook(lead: LeadRecord): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "lead.created", lead }),
    });
  } catch {
    /* never let webhook failures break form submissions */
  }
}
