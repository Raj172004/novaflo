import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isAdminAuthenticated: vi.fn(),
  deleteContent: vi.fn(),
  listContent: vi.fn(),
  saveContent: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth", () => ({
  isAdminAuthenticated: mocks.isAdminAuthenticated,
}));

vi.mock("@/lib/content", () => ({
  deleteContent: mocks.deleteContent,
  listContent: mocks.listContent,
  saveContent: mocks.saveContent,
}));

import {
  GET,
  POST,
  PATCH,
  DELETE,
} from "../app/api/admin/content/route";

const validContent = {
  type: "service",
  slug: "social-media-management",
  title: "Social Media Management",
  excerpt: "Grow your brand online.",
  category: "General",
  body: "A complete social media management service.",
  published: true,
};

function makeRequest(method: string, body?: unknown) {
  return new Request("http://localhost/api/admin/content", {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

describe("admin content API security and validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isAdminAuthenticated.mockResolvedValue(true);
    mocks.listContent.mockResolvedValue([]);
    mocks.saveContent.mockResolvedValue("content-1");
    mocks.deleteContent.mockResolvedValue(true);
  });

  it("rejects unauthenticated requests for all methods", async () => {
    mocks.isAdminAuthenticated.mockResolvedValue(false);

    const responses = await Promise.all([
      GET(),
      POST(makeRequest("POST", validContent)),
      PATCH(makeRequest("PATCH", { id: "content-1", content: validContent })),
      DELETE(makeRequest("DELETE", { id: "content-1" })),
    ]);

    expect(responses.map((response) => response.status)).toEqual([
      401, 401, 401, 401,
    ]);
    expect(mocks.listContent).not.toHaveBeenCalled();
    expect(mocks.saveContent).not.toHaveBeenCalled();
    expect(mocks.deleteContent).not.toHaveBeenCalled();
  });

  it("returns content for an authenticated admin", async () => {
    mocks.listContent.mockResolvedValue([
      { id: "content-1", ...validContent },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect((await response.json()).content).toHaveLength(1);
  });

  it("rejects malformed JSON", async () => {
    const request = new Request("http://localhost/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid-json",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.saveContent).not.toHaveBeenCalled();
  });

  it("rejects invalid content fields and slug formats", async () => {
    const invalidInputs = [
      { ...validContent, type: "unknown" },
      { ...validContent, slug: "Invalid Slug" },
      { ...validContent, slug: "a".repeat(121) },
      { ...validContent, title: "   " },
      { ...validContent, title: "x".repeat(201) },
      { ...validContent, excerpt: "x".repeat(1001) },
      { ...validContent, body: "x".repeat(30001) },
      { ...validContent, published: "true" },
    ];

    for (const input of invalidInputs) {
      const response = await POST(makeRequest("POST", input));
      expect(response.status).toBe(400);
    }

    expect(mocks.saveContent).not.toHaveBeenCalled();
  });

  it("rejects duplicate slugs within the same content type", async () => {
    mocks.listContent.mockResolvedValue([
      { id: "existing-1", ...validContent },
    ]);

    const response = await POST(makeRequest("POST", validContent));

    expect(response.status).toBe(409);
    expect(mocks.saveContent).not.toHaveBeenCalled();
  });

  it("allows the same slug for a different content type", async () => {
    mocks.listContent.mockResolvedValue([
      { id: "existing-1", ...validContent },
    ]);

    const response = await POST(
      makeRequest("POST", { ...validContent, type: "insight" }),
    );

    expect(response.status).toBe(201);
    expect(mocks.saveContent).toHaveBeenCalledOnce();
  });

  it("creates valid content", async () => {
    const response = await POST(makeRequest("POST", validContent));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, id: "content-1" });
    expect(mocks.saveContent).toHaveBeenCalledWith(validContent);
  });

  it("rejects invalid update requests", async () => {
    const response = await PATCH(
      makeRequest("PATCH", {
        id: "content-1",
        content: { ...validContent, slug: "../invalid" },
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.saveContent).not.toHaveBeenCalled();
  });

  it("returns 404 when updating missing content", async () => {
    mocks.saveContent.mockRejectedValue(new Error("CONTENT_NOT_FOUND"));

    const response = await PATCH(
      makeRequest("PATCH", { id: "missing-id", content: validContent }),
    );

    expect(response.status).toBe(404);
  });

  it("returns 404 when deleting missing content", async () => {
    mocks.deleteContent.mockResolvedValue(false);

    const response = await DELETE(
      makeRequest("DELETE", { id: "missing-id" }),
    );

    expect(response.status).toBe(404);
  });

  it("returns 503 when content storage fails", async () => {
    mocks.listContent.mockRejectedValue(
      new Error("Simulated database failure"),
    );

    const response = await GET();

    expect(response.status).toBe(503);
  });

  it("returns 503 when deleting content fails", async () => {
    mocks.deleteContent.mockRejectedValue(
      new Error("Simulated database failure"),
    );

    const response = await DELETE(
      makeRequest("DELETE", { id: "content-1" }),
    );

    expect(response.status).toBe(503);
  });
});
