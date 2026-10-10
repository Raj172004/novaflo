export interface Service {
  slug: string; // "" for the /services hub listing card? use path
  path: string;
  name: string;
  short: string;
  description: string;
  includes: string[];
  outcome: string;
  icon: string; // lucide icon key mapped in components
}

export const services: Service[] = [
  {
    slug: "social-media-strategy",
    path: "/services/social-media-strategy",
    name: "Social Media Strategy & Audit",
    short: "Understand the business, customer, competitors and offer before anything is created.",
    description:
      "Every engagement begins with a structured audit of your business, audience and current presence — so content is planned around real customer decisions, not guesswork.",
    includes: [
      "Instagram profile review",
      "Competitor review",
      "Audience planning",
      "Content pillars",
      "Offer review",
      "CTA review",
      "Baseline metric review",
    ],
    outcome: "A clear content direction grounded in how your customers actually choose businesses like yours.",
    icon: "compass",
  },
  {
    slug: "instagram-management",
    path: "/services/instagram-management",
    name: "Instagram Management",
    short: "A planned monthly calendar, published consistently, with a monthly review.",
    description:
      "Your Instagram is managed end to end: a monthly calendar you approve in advance, captions written in your brand voice, scheduling, publishing and a clear monthly review.",
    includes: [
      "Monthly content calendar",
      "Caption writing",
      "Scheduling",
      "Publishing",
      "Comment & enquiry guidance",
      "Monthly review",
    ],
    outcome: "A consistent, professional presence — without the daily pressure of deciding what to post.",
    icon: "calendar",
  },
  {
    slug: "content-production",
    path: "/services/content-production",
    name: "Premium Content Production",
    short: "Reels, carousels and posts designed around business goals — not trends for their own sake.",
    description:
      "Concepts, scripts, filming direction and professional editing for content that reflects the real quality of your business: educational, proof-driven and trust-building.",
    includes: [
      "Reel concepts",
      "Scripts",
      "Founder & team video direction",
      "Professional editing",
      "Carousels",
      "Static posts",
      "Educational content",
      "Proof content",
      "Service content",
      "Trust-building content",
    ],
    outcome: "Content that looks like the business you have actually built — and gives viewers a reason to enquire.",
    icon: "clapperboard",
  },
  {
    slug: "founder-personal-branding",
    path: "/services/founder-personal-branding",
    name: "Founder & Personal Brand Content",
    short: "Build familiarity and authority where appropriate. Entirely optional.",
    description:
      "People trust people before they trust a logo. Where it fits the business, founder-led content helps customers connect with the person behind the service — without becoming an influencer.",
    includes: [
      "Founder story",
      "Industry experience",
      "Opinions",
      "Myth-busting",
      "Educational Reels",
      "Customer questions",
      "Behind-the-scenes",
      "Business values",
      "Team stories",
    ],
    outcome: "Familiarity and trust that a faceless feed cannot build. Personal branding is optional — clients never need to become influencers.",
    icon: "user-round",
  },
  {
    slug: "enquiry-flow",
    path: "/services/enquiry-flow",
    name: "Enquiry Flow",
    short: "Clearer pathways from content to customer enquiry.",
    description:
      "Content should lead somewhere. We design and refine the path from a Reel or post to a DM, WhatsApp message or booking — and track where enquiries come from.",
    includes: [
      "Clear CTAs",
      "Instagram DM prompts",
      "WhatsApp pathways",
      "Booking pathways",
      "Lead source tracking",
      "Customer enquiry handoff",
    ],
    outcome: "Fewer dead ends. Viewers know exactly what to do next — and you know which content brought them.",
    icon: "messages-square",
  },
  {
    slug: "reporting",
    path: "/services/reporting",
    name: "Dashboard & Reporting",
    short: "Understand what happened, what it means, and what changes next.",
    description:
      "A simple monthly report that explains the meaning behind the numbers: what was published, how it performed, which enquiries appeared, and what the next month's plan changes.",
    includes: [
      "Content published",
      "Reach",
      "Profile visits",
      "Meaningful interactions",
      "DMs",
      "WhatsApp clicks",
      "Enquiries",
      "Bookings where available",
      "What worked",
      "What did not",
      "Next month's actions",
    ],
    outcome: "Reporting you can actually use to make decisions — written in plain language.",
    icon: "line-chart",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
