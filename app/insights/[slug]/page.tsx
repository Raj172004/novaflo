import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/section-header";
import { insights } from "@/data/insights";

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/insights/${post.slug}`,
  });
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) notFound();

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd(breadcrumb),
            articleJsonLd({
              title: post.title,
              description: post.seoDescription ?? post.excerpt,
              path: `/insights/${post.slug}`,
              datePublished: post.date,
              author: post.author,
            }),
          ]),
        }}
      />
      <article className="container-tight max-w-3xl py-14">
        <Breadcrumb items={breadcrumb} />
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
          {post.category}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          By {post.author} · {post.date} · {post.readingTime}
        </p>
        <div className="mt-8 space-y-5">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-[16px] leading-relaxed text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </>
  );
}
