import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { siteConfig, type Availability } from "@/site.config";

const DOT: Record<Availability, string> = {
  available: "bg-accent animate-pulse-dot",
  limited: "bg-neutral-400",
  booked: "bg-neutral-600",
};

export function StatusDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-1.75 shrink-0 rounded-full", DOT[siteConfig.availability], className)}
    />
  );
}

/** "● Available for new projects" — driven by siteConfig.availability. */
export async function AvailabilityBadge({ variant = "pill" }: { variant?: "pill" | "inline" }) {
  const t = await getTranslations("availability");
  const label = t(siteConfig.availability);

  if (variant === "inline") {
    return (
      <p className="flex items-center gap-2 font-mono-ui text-xs leading-none text-fg-soft">
        <StatusDot />
        <span>{label}</span>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 rounded-full border border-divider px-2.5 py-1.25 font-mono-ui text-[11.5px] leading-none whitespace-nowrap text-fg-soft">
      <StatusDot />
      <span>{label}</span>
    </p>
  );
}
