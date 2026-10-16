import "server-only";

import { getPublishedContent } from "@/lib/content";
import { services as staticServices, type Service } from "@/data/services";

export async function getServices(): Promise<Service[]> {
  let published;

  try {
    published = await getPublishedContent("service");
  } catch (error) {
    console.error("Unable to load CMS services; using static services.", error);
    return staticServices;
  }

  const bySlug = new Map(published.map((item) => [item.slug, item]));

  const existing = staticServices.map((service) => {
    const item = bySlug.get(service.slug);
    if (!item) return service;

    return {
      ...service,
      name: item.title,
      short: item.excerpt || service.short,
      description: item.body || service.description,
    };
  });

  const existingSlugs = new Set(staticServices.map((service) => service.slug));

  const additional: Service[] = published
    .filter((item) => !existingSlugs.has(item.slug))
    .map((item) => ({
      slug: item.slug,
      path: `/services/${item.slug}`,
      name: item.title,
      short: item.excerpt || item.title,
      description: item.body || item.excerpt || item.title,
      includes: [],
      outcome: "A service tailored to your business needs.",
      icon: "compass",
    }));

  return [...existing, ...additional];
}
