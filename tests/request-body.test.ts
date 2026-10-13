import { describe, expect, it, vi } from "vitest";
import { readJsonBody } from "../lib/request-body";

function makeRequest(
  body: string,
  headers: Record<string, string> = {},
) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body,
  });
}

describe("readJsonBody", () => {
  it("parses valid JSON", async () => {
    const result = await readJsonBody(makeRequest('{"name":"Test"}'));
    expect(result).toEqual({ ok: true, value: { name: "Test" } });
  });

  it("rejects malformed JSON", async () => {
    const result = await readJsonBody(makeRequest("{invalid"));
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects invalid UTF-8", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      body: new Uint8Array([0xc3, 0x28]),
    });
    const result = await readJsonBody(request);
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects a declared oversized body", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "content-length": "20000" },
      body: "{}",
    });
    const result = await readJsonBody(request);
    expect(result).toMatchObject({ ok: false, status: 413 });
  });

  it("rejects a body exceeding the size limit", async () => {
    const result = await readJsonBody(
      makeRequest(JSON.stringify({ data: "x".repeat(17000) })),
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
  });
});
