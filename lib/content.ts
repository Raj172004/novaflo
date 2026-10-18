
import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export type ContentType = "service" | "insight";

export interface SiteContent {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  published: boolean;
  updatedAt: string;
  createdAt: string;
}

const collection = () => adminDb.collection("siteContent");

function normalizeDocument(
  id: string,
  data: FirebaseFirestore.DocumentData,
): SiteContent {
  const dateValue = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (
      value &&
      typeof value === "object" &&
      "toDate" in value &&
      typeof value.toDate === "function"
    ) {
      return value.toDate().toISOString();
    }
    return "";
  };

  return {
    id,
    type: data.type,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? "",
    category: typeof data.category === "string" && data.category.trim() ? data.category.trim() : "General",
    body: data.body ?? "",
    published: data.published === true,
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

export async function listContent(): Promise<SiteContent[]> {
  const snapshot = await collection().get();

  return snapshot.docs
    .map((doc) => normalizeDocument(doc.id, doc.data()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPublishedContent(
  type: ContentType,
): Promise<SiteContent[]> {
  const snapshot = await collection()
    .where("type", "==", type)
    .where("published", "==", true)
    .get();

  return snapshot.docs.map((doc) => normalizeDocument(doc.id, doc.data()));
}

export async function saveContent(
  input: Omit<SiteContent, "id" | "createdAt" | "updatedAt">,
  id?: string,
): Promise<string> {
  const now = FieldValue.serverTimestamp();
  const data = {
    type: input.type,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category?.trim() || "General",
    body: input.body,
    published: input.published,
    updatedAt: now,
  };

  if (id) {
    const ref = collection().doc(id);
    const existing = await ref.get();

    if (!existing.exists) {
      throw new Error("CONTENT_NOT_FOUND");
    }

    await ref.set(data, { merge: true });
    return id;
  }

  const ref = collection().doc();
  await ref.set({
    ...data,
    createdAt: now,
  });

  return ref.id;
}

export async function deleteContent(id: string): Promise<boolean> {
  const ref = collection().doc(id);
  const existing = await ref.get();

  if (!existing.exists) return false;

  await ref.delete();
  return true;
}
