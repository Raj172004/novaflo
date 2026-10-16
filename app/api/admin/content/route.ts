
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteContent,
  listContent,
  saveContent,
  type ContentType,
} from "@/lib/content";
import { readJsonBody } from "../../../../lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContentInput = {
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
};

const validType = (value: unknown): value is ContentType =>
  value === "service" || value === "insight";

function validInput(value: unknown): value is ContentInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    validType(item.type) &&
    typeof item.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) &&
    item.slug.length <= 120 &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    item.title.length <= 200 &&
    typeof item.excerpt === "string" &&
    item.excerpt.length <= 1000 &&
    typeof item.body === "string" &&
    item.body.length <= 30000 &&
    typeof item.published === "boolean"
  );
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ content: await listContent() });
  } catch (error) {
    console.error("Admin content list failed:", error);
    return NextResponse.json(
      { error: "Unable to load content." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await readJsonBody(request);

  if (!parsed.ok || !validInput(parsed.value)) {
    return NextResponse.json(
      { error: "Invalid content. Check all fields and the slug format." },
      { status: 400 },
    );
  }

  const input: ContentInput = parsed.value;

  try {
    const content = await listContent();
    const duplicate = content.some(
      (item) => item.type === input.type && item.slug === input.slug,
    );

    if (duplicate) {
      return NextResponse.json(
        { error: "That slug already exists for this content type." },
        { status: 409 },
      );
    }

    const id = await saveContent(input);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Admin content create failed:", error);
    return NextResponse.json(
      { error: "Unable to save content." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await readJsonBody(request);

  if (
    !parsed.ok ||
    !parsed.value ||
    typeof parsed.value !== "object" ||
    Array.isArray(parsed.value)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = parsed.value as Record<string, unknown>;
  const id = payload.id;

  if (
    typeof id !== "string" ||
    !id.trim() ||
    !validInput(payload.content)
  ) {
    return NextResponse.json(
      { error: "A valid content ID and content object are required." },
      { status: 400 },
    );
  }

  const input: ContentInput = payload.content;

  try {
    const content = await listContent();
    const duplicate = content.some(
      (item) =>
        item.id !== id &&
        item.type === input.type &&
        item.slug === input.slug,
    );

    if (duplicate) {
      return NextResponse.json(
        { error: "That slug already exists for this content type." },
        { status: 409 },
      );
    }

    await saveContent(input, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "CONTENT_NOT_FOUND") {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    console.error("Admin content update failed:", error);
    return NextResponse.json(
      { error: "Unable to update content." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await readJsonBody(request);

  if (
    !parsed.ok ||
    !parsed.value ||
    typeof parsed.value !== "object" ||
    Array.isArray(parsed.value)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = (parsed.value as Record<string, unknown>).id;

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json(
      { error: "A valid content ID is required." },
      { status: 400 },
    );
  }

  try {
    const deleted = await deleteContent(id);

    if (!deleted) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin content delete failed:", error);
    return NextResponse.json(
      { error: "Unable to delete content." },
      { status: 503 },
    );
  }
}
