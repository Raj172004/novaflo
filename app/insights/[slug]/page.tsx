
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";
import { getPublishedContent } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function findPublishedInsight(slug: string) {
  const insights = await getPublishedContent("insight");
  return insights.find((item) => item.slug === slug) ?? null;
}

function getParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getPublishedDate(createdAt: string, updatedAt: string) {
  const value = createdAt || updatedAt;
  if (!value) return new Date().toISOString();

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await findPublishedInsight(slug);
    if (!post) return {};

    return pageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/insights/${post.slug}`,
    });
  } catch {
    return {};
  }
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;

  try {
    post = await findPublishedInsight(slug);
  } catch {
    throw new Error("Unable to load this insight. Please try again later.");
  }

  if (!post) notFound();

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ];

  const paragraphs = getParagraphs(post.body);
  const publishedDate = getPublishedDate(post.createdAt, post.updatedAt);
  const author = "NovaFlo Editorial";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd(breadcrumb),
            articleJsonLd({
              title: post.title,
              description: post.excerpt,
              path: `/insights/${post.slug}`,
              datePublished: publishedDate,
              author,
            }),
          ]),
        }}
      />

      <article className="container-tight max-w-3xl py-14">
        <Breadcrumb items={breadcrumb} />

        <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
          Insight
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            {post.excerpt}
          </p>
        )}

        <p className="mt-3 text-sm text-slate-500">
          By {author} ·{" "}
          {new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(new Date(publishedDate))}{" "}
          · {getReadingTime(post.body)}
        </p>

        <div className="mt-8 space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="whitespace-pre-wrap text-[16px] leading-relaxed text-slate-300"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <a
            href="/insights"
            className="text-sm font-medium text-accent-cyan hover:underline"
          >
            ← Back to all insights
          </a>
        </div>
      </article>
    </>
  );
}
