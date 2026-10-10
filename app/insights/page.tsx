"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { insights, insightCategories } from "@/data/insights";

export default function InsightsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return insights.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        !query.trim() ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

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
          {insights.length === 0 ? (
            <EmptyState
              title="No insights published yet. Check back soon."
              description="Novaflo publishes articles only when they add genuine value — never filler content. The first articles are being written."
              action={{ label: "Explore services meanwhile", href: "/services" }}
            />
          ) : (
            <>
              {/* Filters */}
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search insights…"
                    aria-label="Search insights"
                    className="input-field pl-10 sm:w-72"
                  />
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                  {["All", ...insightCategories].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      aria-pressed={category === cat}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        category === cat
                          ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/insights/${post.slug}`}
                    className="surface-card surface-card-hover flex h-full flex-col p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                      {post.category}
                    </p>
                    <h2 className="mt-2.5 font-display text-lg font-semibold leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-slate-500">
                      {post.date} · {post.readingTime}
                    </p>
                  </Link>
                ))}
              </div>
              {filtered.length === 0 ? (
                <p className="mt-10 text-center text-slate-400">
                  No insights match your search. Try a different term or category.
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
