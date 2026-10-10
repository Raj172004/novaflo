export interface Industry {
  name: string;
  description: string;
  icon: string;
}

export const industries: Industry[] = [
  {
    name: "Clinics & Wellness",
    description:
      "Patients choose practitioners they trust. Educational and reassurance-led content builds that trust before the first visit.",
    icon: "heart-pulse",
  },
  {
    name: "Fitness Studios & Gyms",
    description:
      "Membership decisions are emotional and local. Proof-driven content shows the energy and standards of your space.",
    icon: "dumbbell",
  },
  {
    name: "Salons & Beauty",
    description:
      "Visual quality matters. Your feed should match the finish a client can expect in your chair.",
    icon: "scissors",
  },
  {
    name: "Real Estate Consultants",
    description:
      "Buyers and sellers follow people they consider credible. Founder-led content builds that credibility.",
    icon: "building-2",
  },
  {
    name: "Coaches",
    description:
      "Your expertise is the product. Educational content demonstrates it at scale.",
    icon: "graduation-cap",
  },
  {
    name: "Professional Service Providers",
    description:
      "CA, legal, consulting and technical services grow through clarity and authority — not posting for its own sake.",
    icon: "briefcase",
  },
  {
    name: "Interior & Home Services",
    description:
      "Transformations, process and standards shown consistently turn viewers into enquiries.",
    icon: "home",
  },
  {
    name: "Local Premium Product Businesses",
    description:
      "Premium products deserve premium presentation. Content quality signals product quality.",
    icon: "gem",
  },
];
