import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
        Looks like this page took a wrong turn.
      </h1>
      <p className="mt-3 max-w-md text-[15px] text-slate-400">
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Back Home
        </ButtonLink>
        <ButtonLink href="/services" variant="secondary" size="lg">
          Explore Services
        </ButtonLink>
        <ButtonLink href="/growth-call" variant="secondary" size="lg">
          Book a Growth Call
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Or{" "}
        <Link href="/contact" className="text-accent-cyan hover:underline">
          tell us what you were looking for
        </Link>
        .
      </p>
    </div>
  );
}
