export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string };

const MAX_JSON_BODY_BYTES = 16 * 1024;

function invalidBody(): JsonBodyResult {
  return {
    ok: false,
    status: 400,
    error: "Invalid JSON request.",
  };
}

export async function readJsonBody(
  request: Request,
): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) ||
      Number(contentLength) > MAX_JSON_BODY_BYTES)
  ) {
    return {
      ok: false,
      status: 413,
      error: "Request body is too large or invalid.",
    };
  }

  if (!request.body) {
    return invalidBody();
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_JSON_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The size limit still applies if cancellation fails.
        }

        return {
          ok: false,
          status: 413,
          error: "Request body is too large.",
        };
      }

      chunks.push(value);
    }
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Unable to read request body.",
    };
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const rawBody = new TextDecoder("utf-8", {
      fatal: true,
    }).decode(bytes);

    return {
      ok: true,
      value: JSON.parse(rawBody) as unknown,
    };
  } catch {
    return invalidBody();
  }
}