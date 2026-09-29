import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/** The "RP" monogram tile. */
export function BrandMark({ tone = "accent", className }: { tone?: "accent" | "muted"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-7.5 shrink-0 place-items-center rounded-md border font-mono-ui text-xs leading-none font-medium tracking-[-0.02em]",
        tone === "accent" ? "border-accent text-accent-text" : "border-divider text-fg",
        className,
      )}
    >
      {siteConfig.initials}
    </span>
  );
}
