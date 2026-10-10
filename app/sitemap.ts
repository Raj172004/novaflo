import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { sitePages } from "@/data/pages";
import { services } from "@/data/services";
import { insights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = sitePages.map((page) => ({
    url: `${siteConfig.url}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.path === "/" ? 1 : 0.7,
  }));

  const servicePages = services.map((service) => ({
    url: `${siteConfig.url}${service.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const insightPages = insights.map((post) => ({
    url: `${siteConfig.url}/insights/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...insightPages];
}
