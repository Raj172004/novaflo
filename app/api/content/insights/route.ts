
import { NextResponse } from "next/server";
import { getPublishedContent } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getPublishedContent("insight");

    return NextResponse.json(
      {
        insights: content.map((item) => ({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          category: item.category || "General",
          body: item.body,
          date: item.createdAt || item.updatedAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Public insights request failed:", error);

    return NextResponse.json(
      { error: "Unable to load insights." },
      { status: 503 },
    );
  }
}
