import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

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

const leadsCollection = () => adminDb.collection("leads");

function toLeadRecord(
  id: string,
  data: FirebaseFirestore.DocumentData,
): LeadRecord {
  return {
    ...data,
    id,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : data.createdAt?.toDate?.()?.toISOString?.() ??
          new Date(0).toISOString(),
  } as LeadRecord;
}

export async function readLeads(): Promise<LeadRecord[]> {
  const snapshot = await leadsCollection().get();
  return snapshot.docs.map((doc: any) => toLeadRecord(doc.id, doc.data()));
}

export async function addLead(
  lead: Omit<LeadRecord, "id" | "createdAt" | "status">,
): Promise<LeadRecord> {
  const record = {
    ...lead,
    createdAt: new Date().toISOString(),
    status: "new" as const,
  };

  // Firestore does not accept undefined field values.
  const firestoreRecord = Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  );

  const docRef = leadsCollection().doc();

  await docRef.set({
    ...firestoreRecord,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
  });

  return {
    ...record,
    id: docRef.id,
  };
}

export async function updateLeadStatus(
  id: string,
  status: LeadRecord["status"],
): Promise<boolean> {
  const docRef = leadsCollection().doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) return false;

  await docRef.update({ status });
  return true;
}

/** Forward a newly created lead to a configured CRM webhook. */
export async function forwardToWebhook(lead: LeadRecord): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "lead.created", lead }),
    });

    if (!response.ok) {
      console.error("Lead webhook returned HTTP", response.status);
    }
  } catch (error) {
    console.error("Lead webhook forwarding failed:", error);
  }
}

/** Forward a newly created lead to the optional Google Sheets receiver. */
export async function forwardToGoogleSheets(
  lead: LeadRecord,
): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();

  // Google Sheets integration remains optional until configured.
  if (!url || !secret) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "lead.created",
        secret,
        lead,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Google Sheets integration returned HTTP",
        response.status,
      );
    }
  } catch (error) {
    // A Sheets outage must not invalidate a lead already saved in Firestore.
    console.error("Google Sheets forwarding failed:", error);
  }
}

