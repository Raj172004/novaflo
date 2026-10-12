
import "server-only";
import { Resend } from "resend";
import type { LeadRecord } from "@/lib/leads";

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim() ?? "",
    to: process.env.LEAD_NOTIFICATION_EMAIL?.trim() ?? "",
    from: process.env.LEAD_EMAIL_FROM?.trim() ?? "",
  };
}

function escapeHtml(value: string | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
}

export async function sendLeadNotification(
  lead: LeadRecord,
): Promise<void> {
  const config = getEmailConfig();

  // Email is optional: keep the application functional until configured.
  if (!config.apiKey || !config.to || !config.from) {
    return;
  }

  try {
    const resend = new Resend(config.apiKey);
    const leadType =
      lead.type === "growth_call" ? "Growth-call request" : "Contact enquiry";

    const details: Array<[string, string | undefined]> = [
      ["Name", lead.name],
      ["Business", lead.business],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Request type", leadType],
      ["Subject", lead.subject],
      ["Industry", lead.industry],
      ["City", lead.city],
      ["Instagram", lead.instagram],
      ["Challenge", lead.challenge],
      ["Message", lead.message],
      ["Preferred contact", lead.contactMethod],
      ["Source", lead.source],
      ["Landing page", lead.landingPage],
      ["Lead ID", lead.id],
    ];

    const rows = details
      .filter(([, value]) => Boolean(value))
      .map(
        ([label, value]) =>
          `<tr>
            <td style="padding:10px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td>
          </tr>`,
      )
      .join("");

    const { error } = await resend.emails.send({
      from: config.from,
      to: [config.to],
      subject: `New Novaflo ${leadType.toLowerCase()}: ${lead.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#202020">
          <h2>New lead received</h2>
          <p>A new enquiry has been saved in the Novaflo lead system.</p>
          <table style="width:100%;border-collapse:collapse">${rows}</table>
          <p style="font-size:12px;color:#666">This is an automated notification from Novaflo.</p>
        </div>
      `,
      text: details
        .filter(([, value]) => Boolean(value))
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n"),
    });

    if (error) {
      console.error("Lead notification email failed:", error.message);
    }
  } catch (error) {
    // Do not turn a saved lead into a failed form submission because email failed.
    console.error("Lead notification email failed:", error);
  }
}
