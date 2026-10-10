export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  body: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const insightCategories = [
  "Social Media Strategy",
  "Instagram",
  "Content",
  "Personal Branding",
  "Local Business Marketing",
  "Lead Generation",
  "Business Growth",
] as const;

/**
 * Insights live here until an admin/CMS layer manages them.
 * Empty by default — Novaflo never publishes placeholder articles.
 * Add real articles below as they are written and approved.
 */
export const insights: Insight[] = [];
