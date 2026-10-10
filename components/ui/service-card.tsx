import { Compass, Calendar, Clapperboard, UserRound, MessagesSquare, LineChart } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/data/services";

const icons: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  compass: Compass,
  calendar: Calendar,
  clapperboard: Clapperboard,
  "user-round": UserRound,
  "messages-square": MessagesSquare,
  "line-chart": LineChart,
};

export function ServiceCard({ service, href }: { service: Service; href?: string }) {
  const Icon = icons[service.icon] ?? Compass;
  const link = href ?? service.path;
  return (
    <Link
      href={link}
      className="surface-card surface-card-hover group flex h-full flex-col p-6"
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-cyan">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="font-display text-lg font-semibold text-white">{service.name}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-400">{service.short}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan opacity-80 transition-opacity group-hover:opacity-100">
        Learn more
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8h9m0 0L8.75 4.25M12.5 8l-3.75 3.75"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
