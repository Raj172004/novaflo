
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { insightCategories } from "@/data/insights";

type PublishedInsight = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
};

function formatDate(value: string) {
  if (!value) return "Recently published";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently published";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<PublishedInsight[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInsights() {
      try {
        const response = await fetch("/api/content/insights", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load insights.");

        const data = (await response.json()) as {
          insights: PublishedInsight[];
        };

        setInsights(data.insights);
        setLoadError(false);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadInsights();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return insights.filter((post) => {
      const matchesQuery =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.body.toLowerCase().includes(normalizedQuery);

      return matchesQuery;
    });
  }, [insights, query]);

  return (
    <>
      <div className="border-b border-white/[0.05] bg-navy-950/30">
        <div className="container-tight pb-16 pt-14">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
            ]}
          />
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4">
              <span className="eyebrow">Insights</span>
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Notes on strategy, content and growth.
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Practical thinking on social media for local and growing businesses.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-tight">
          {loading ? (
            <p className="py-10 text-center text-slate-400" role="status">
              Loading published insights...
            </p>
          ) : loadError ? (
            <div className="surface-card p-6 text-center">
              <p className="text-slate-300">
                Insights are temporarily unavailable.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm"
              >
                Try again
              </button>
            </div>
          ) : insights.length === 0 ? (
            <EmptyState
              title="No insights published yet. Check back soon."
              description="Novaflo publishes articles only when they add genuine value — never filler content."
              action={{
                label: "Explore services meanwhile",
                href: "/services",
              }}
            />
          ) : (
            <>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search insights..."
                    aria-label="Search insights"
                    className="input-field pl-10 sm:w-72"
                  />
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter by category"
                >
                  {["All", ...insightCategories].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      aria-pressed={category === item}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        category === item
                          ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/insights/${post.slug}`}
                    className="surface-card surface-card-hover flex h-full flex-col p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                      Insight
                    </p>
                    <h2 className="mt-2.5 font-display text-lg font-semibold leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-slate-500">
                      {formatDate(post.date)} · {readingTime(post.body)}
                    </p>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="mt-10 text-center text-slate-400">
                  No insights match your search. Try a different term.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
