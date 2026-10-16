import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const timestampSentinel = { __serverTimestamp: true };

  return {
    timestampSentinel,
    serverTimestamp: vi.fn(() => timestampSentinel),
    collection: vi.fn(),
    collectionGet: vi.fn(),
    doc: vi.fn(),
    docSet: vi.fn(),
    docGet: vi.fn(),
    docUpdate: vi.fn(),
  };
});

vi.mock("server-only", () => ({}));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: {
    serverTimestamp: mocks.serverTimestamp,
  },
}));

vi.mock("../lib/firebase-admin", () => ({
  adminDb: {
    collection: mocks.collection,
  },
}));

import {
  addLead,
  forwardToWebhook,
  readLeads,
  updateLeadStatus,
  type LeadRecord,
} from "../lib/leads";

const sampleLead: Omit<LeadRecord, "id" | "createdAt" | "status"> = {
  type: "contact",
  name: "Test Lead",
  business: "Example Business",
  phone: "+919876543210",
  email: "lead@example.com",
  contactMethod: "email",
  source: "website",
  utm: { source: "test" },
};

function makeStoredLead(id: string, createdAt: unknown = "2026-10-12T10:00:00.000Z") {
  return {
    id,
    createdAt,
    type: "contact",
    status: "new",
    name: "Test Lead",
    business: "Example Business",
    phone: "+919876543210",
    email: "lead@example.com",
    contactMethod: "email",
    source: "website",
    utm: {},
  };
}

describe("lead service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.collection.mockReturnValue({
      get: mocks.collectionGet,
      doc: mocks.doc,
    });

    mocks.doc.mockReturnValue({
      id: "generated-lead-id",
      set: mocks.docSet,
      get: mocks.docGet,
      update: mocks.docUpdate,
    });

    mocks.collectionGet.mockResolvedValue({ docs: [] });
    mocks.docSet.mockResolvedValue(undefined);
    mocks.docGet.mockResolvedValue({ exists: true });
    mocks.docUpdate.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("readLeads", () => {
    it("returns an empty list when no leads exist", async () => {
      await expect(readLeads()).resolves.toEqual([]);
      expect(mocks.collection).toHaveBeenCalledWith("leads");
      expect(mocks.collectionGet).toHaveBeenCalledOnce();
    });

    it("maps document IDs and preserves lead fields", async () => {
      mocks.collectionGet.mockResolvedValue({
        docs: [
          {
            id: "lead-123",
            data: () => makeStoredLead("ignored-document-id"),
          },
        ],
      });

      const leads = await readLeads();

      expect(leads).toHaveLength(1);
      expect(leads[0]).toMatchObject({
        id: "lead-123",
        name: "Test Lead",
        email: "lead@example.com",
        status: "new",
      });
    });

    it("converts Firestore timestamps into ISO date strings", async () => {
      const date = new Date("2026-10-12T10:00:00.000Z");

      mocks.collectionGet.mockResolvedValue({
        docs: [
          {
            id: "lead-123",
            data: () => makeStoredLead("lead-123", {
              toDate: () => date,
            }),
          },
        ],
      });

      const leads = await readLeads();

      expect(leads[0].createdAt).toBe(date.toISOString());
    });

    it("uses the epoch fallback when a timestamp is missing", async () => {
      mocks.collectionGet.mockResolvedValue({
        docs: [
          {
            id: "lead-123",
            data: () => {
              const { createdAt: _missingTimestamp, ...storedLead } = makeStoredLead("lead-123");
              return storedLead;
            },
          },
        ],
      });

      const leads = await readLeads();

      expect(leads[0].createdAt).toBe("1970-01-01T00:00:00.000Z");
    });

    it("propagates database read failures", async () => {
      mocks.collectionGet.mockRejectedValue(new Error("Firestore unavailable"));

      await expect(readLeads()).rejects.toThrow("Firestore unavailable");
    });
  });

  describe("addLead", () => {
    it("creates a lead with a generated ID, timestamp, and new status", async () => {
      const result = await addLead(sampleLead);

      expect(mocks.collection).toHaveBeenCalledWith("leads");
      expect(mocks.doc).toHaveBeenCalledOnce();
      expect(mocks.serverTimestamp).toHaveBeenCalledOnce();

      expect(mocks.docSet).toHaveBeenCalledWith(
        expect.objectContaining({
          ...sampleLead,
          id: "generated-lead-id",
          status: "new",
          createdAt: mocks.timestampSentinel,
        }),
      );

      expect(result).toMatchObject({
        ...sampleLead,
        id: "generated-lead-id",
        status: "new",
      });

      expect(Number.isNaN(Date.parse(result.createdAt))).toBe(false);
    });

    it("omits undefined optional fields from Firestore writes", async () => {
      const leadWithOptionalFields = {
        ...sampleLead,
        industry: undefined,
        city: undefined,
        instagram: undefined,
        challenge: undefined,
        subject: undefined,
        message: undefined,
        landingPage: undefined,
      };

      await addLead(leadWithOptionalFields);

      const savedDocument = mocks.docSet.mock.calls[0][0];

      for (const field of [
        "industry",
        "city",
        "instagram",
        "challenge",
        "subject",
        "message",
        "landingPage",
      ]) {
        expect(savedDocument).not.toHaveProperty(field);
      }

      expect(savedDocument).toMatchObject({
        name: sampleLead.name,
        email: sampleLead.email,
        id: "generated-lead-id",
        status: "new",
      });
    });

    it("propagates database write failures", async () => {
      mocks.docSet.mockRejectedValue(new Error("Firestore write failed"));

      await expect(addLead(sampleLead)).rejects.toThrow(
        "Firestore write failed",
      );
    });
  });

  describe("updateLeadStatus", () => {
    it("updates the status when the lead exists", async () => {
      await expect(
        updateLeadStatus("lead-123", "contacted"),
      ).resolves.toBe(true);

      expect(mocks.doc).toHaveBeenCalledWith("lead-123");
      expect(mocks.docGet).toHaveBeenCalledOnce();
      expect(mocks.docUpdate).toHaveBeenCalledWith({ status: "contacted" });
    });

    it("returns false and does not update a missing lead", async () => {
      mocks.docGet.mockResolvedValue({ exists: false });

      await expect(
        updateLeadStatus("missing-lead", "contacted"),
      ).resolves.toBe(false);

      expect(mocks.docUpdate).not.toHaveBeenCalled();
    });

    it("propagates errors while checking whether a lead exists", async () => {
      mocks.docGet.mockRejectedValue(new Error("Firestore read failed"));

      await expect(
        updateLeadStatus("lead-123", "qualified"),
      ).rejects.toThrow("Firestore read failed");

      expect(mocks.docUpdate).not.toHaveBeenCalled();
    });

    it("propagates errors while updating a lead", async () => {
      mocks.docUpdate.mockRejectedValue(new Error("Firestore update failed"));

      await expect(
        updateLeadStatus("lead-123", "won"),
      ).rejects.toThrow("Firestore update failed");
    });
  });

  describe("forwardToWebhook", () => {
    const webhookLead: LeadRecord = {
      ...sampleLead,
      id: "lead-123",
      createdAt: "2026-10-12T10:00:00.000Z",
      status: "new",
    };

    it("does nothing when no webhook URL is configured", async () => {
      vi.stubEnv("CRM_WEBHOOK_URL", "");
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      await forwardToWebhook(webhookLead);

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends a lead-created event to the configured webhook", async () => {
      vi.stubEnv("CRM_WEBHOOK_URL", "https://example.com/webhook");
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      vi.stubGlobal("fetch", fetchMock);

      await forwardToWebhook(webhookLead);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "lead.created",
            lead: webhookLead,
          }),
        },
      );
    });

    it("does not throw when the webhook returns a failed HTTP status", async () => {
      vi.stubEnv("CRM_WEBHOOK_URL", "https://example.com/webhook");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 500 }),
      );
      vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(forwardToWebhook(webhookLead)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });

    it("does not throw when the webhook request fails", async () => {
      vi.stubEnv("CRM_WEBHOOK_URL", "https://example.com/webhook");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network unavailable")),
      );
      vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(forwardToWebhook(webhookLead)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
