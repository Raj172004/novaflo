export interface ProcessStep {
  id: string;
  step: string;
  name: string;
  title: string;
  description: string;
  points: string[];
}

export const processSteps: ProcessStep[] = [
  {
    id: "understand",
    step: "01",
    name: "Understand",
    title: "We start with your business, not your feed.",
    description:
      "Before anything is planned or posted, Novaflo learns how your business wins customers.",
    points: [
      "Your business and key services",
      "Your customers and how they decide",
      "Your offer",
      "Your existing social media",
      "Your current challenges",
    ],
  },
  {
    id: "plan",
    step: "02",
    name: "Plan",
    title: "A calendar you approve before the month begins.",
    description:
      "Strategy becomes a concrete monthly plan — topics, formats and the action every piece should prompt.",
    points: ["Audit findings", "Content strategy", "Monthly calendar", "Hook planning", "CTA planning"],
  },
  {
    id: "create",
    step: "03",
    name: "Create",
    title: "Premium content, built around purpose.",
    description:
      "Scripts are written, filming is directed, and editing is handled professionally — every piece has a job to do.",
    points: ["Scripts", "Reels", "Carousels", "Supporting posts"],
  },
  {
    id: "publish",
    step: "04",
    name: "Publish",
    title: "Approved, scheduled, consistent.",
    description:
      "You approve the content, then it is published through a planned monthly schedule — no last-minute scrambling.",
    points: ["Client approval", "Planned schedule", "Consistent publishing"],
  },
  {
    id: "improve",
    step: "05",
    name: "Improve",
    title: "Every month informs the next.",
    description:
      "Performance, engagement, enquiries and content patterns are reviewed — then the next month's strategy improves.",
    points: ["Performance review", "Engagement review", "Enquiry tracking", "Content patterns", "Next-month strategy"],
  },
];

export interface RoadmapMonth {
  month: string;
  label: string;
  title: string;
  items: string[];
}

export const roadmap: RoadmapMonth[] = [
  {
    month: "Month 1",
    label: "Foundation",
    title: "Build the base properly.",
    items: [
      "Full audit of business, audience and presence",
      "Profile improvement",
      "Content foundation & pillars",
      "Baseline metrics recorded",
    ],
  },
  {
    month: "Month 2",
    label: "Test",
    title: "Test deliberately, learn quickly.",
    items: [
      "Test topics",
      "Test hooks",
      "Test CTAs",
      "Test enquiry pathways",
    ],
  },
  {
    month: "Month 3",
    label: "Improve",
    title: "Double down on what works.",
    items: [
      "Improve strongest content themes",
      "Review available business impact",
      "Refine the next 90 days",
    ],
  },
];

export const trustFlow = [
  "Business",
  "Audience",
  "Strategy",
  "Content",
  "Trust",
  "Enquiry",
  "Learning",
];

export const contentPurposes = [
  { title: "Build trust", description: "Familiarity grows when presence is consistent and genuine." },
  { title: "Answer questions", description: "Content that resolves what customers already wonder about." },
  { title: "Show proof", description: "Real work, real process, real standards — shown, not claimed." },
  { title: "Explain offers", description: "Services explained clearly enough to act on." },
  { title: "Educate", description: "Useful knowledge that positions the business as the expert." },
  { title: "Encourage enquiries", description: "A clear next step, every time it makes sense." },
];
