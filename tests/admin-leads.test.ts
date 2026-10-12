
import { beforeEach, describe, expect, it, vi } from "vitest";

const { isAdminAuthenticated, readLeads, updateLeadStatus } = vi.hoisted(() => ({
  isAdminAuthenticated: vi.fn(),
  readLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth", () => ({
  isAdminAuthenticated,
}));

vi.mock("@/lib/leads", () => ({
  readLeads,
  updateLeadStatus,
}));

vi.mock("@/lib/config", () => ({
  leadStatuses: ["new", "contacted", "qualified", "proposal", "won", "lost"],
}));

import { GET, PATCH } from "../app/api/admin/leads/route";

describe("admin leads API authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated lead reads", async () => {
    isAdminAuthenticated.mockResolvedValue(false);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(readLeads).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated status updates", async () => {
    isAdminAuthenticated.mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "lead-1", status: "contacted" }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(401);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });

  it("returns leads for an authenticated admin", async () => {
    isAdminAuthenticated.mockResolvedValue(true);
    readLeads.mockResolvedValue([
      { id: "lead-1", createdAt: "2026-10-12T10:00:00.000Z" },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect((await response.json()).leads).toHaveLength(1);
  });

  it("returns 503 when loading leads fails", async () => {
    isAdminAuthenticated.mockResolvedValue(true);
    readLeads.mockRejectedValue(new Error("Simulated database failure"));

    const response = await GET();

    expect(response.status).toBe(503);
  });

  it("rejects invalid JSON", async () => {
    isAdminAuthenticated.mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{invalid-json",
    });

    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });

  it("rejects an empty lead ID", async () => {
    isAdminAuthenticated.mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "   ", status: "contacted" }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });

  it("rejects invalid status values", async () => {
    isAdminAuthenticated.mockResolvedValue(true);

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "lead-1", status: "admin" }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(400);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });

  it("returns 404 when the lead does not exist", async () => {
    isAdminAuthenticated.mockResolvedValue(true);
    updateLeadStatus.mockResolvedValue(false);

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "missing-lead", status: "contacted" }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(404);
  });

  it("returns 503 when a status update fails", async () => {
    isAdminAuthenticated.mockResolvedValue(true);
    updateLeadStatus.mockRejectedValue(new Error("Simulated database failure"));

    const request = new Request("http://localhost/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "lead-1", status: "contacted" }),
    });

    const response = await PATCH(request);

    expect(response.status).toBe(503);
  });
});
