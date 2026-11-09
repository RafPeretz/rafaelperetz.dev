import { CloudArrowUpIcon, CloudIcon } from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";

import { type BrandLogoName } from "@/content-icons";
import { cn } from "@/lib/utils";

// Azure and AWS were removed from simple-icons at the trademark owners' request: Phosphor glyphs stand in.
const GLYPHS: Partial<Record<BrandLogoName, Icon>> = { azure: CloudIcon, aws: CloudArrowUpIcon };

/**
 * Technology logo, drawn in the current text colour (the site keeps a single accent).
 * The paths live in the cached sprite public/logos.svg (scripts/build-logos.mjs) and are referenced
 * with <use>, so they're downloaded once instead of inlined into every page (HTML + RSC payload).
 */
export function Logo({ name, className }: { name: BrandLogoName; className?: string }) {
  const Glyph = GLYPHS[name];
  if (Glyph) return <Glyph aria-hidden="true" className={className} />;
  return (
    <svg aria-hidden="true" className={cn("fill-current", className)}>
      <use href={`/logos.svg#${name}`} />
    </svg>
  );
}
