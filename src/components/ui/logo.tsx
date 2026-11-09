import { CloudArrowUpIcon, CloudIcon } from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";
import { type CSSProperties } from "react";

import { type BrandLogoName } from "@/content-icons";
import { cn } from "@/lib/utils";

// Brand colours (from simple-icons). The paths live in public/logos.svg (scripts/build-logos.mjs) and
// are referenced with <use>, so they're downloaded once instead of inlined into every page.
// Azure and AWS were removed from simple-icons at the trademark owners' request:
// a Phosphor cloud in the brand colour stands in for them.
type Logo = { hex: string; glyph?: Icon };

const LOGOS: Record<BrandLogoName, Logo> = {
  kubernetes: { hex: "326CE5" },
  docker: { hex: "2496ED" },
  azure: { hex: "0078D4", glyph: CloudIcon },
  aws: { hex: "FF9900", glyph: CloudArrowUpIcon },
  githubactions: { hex: "2088FF" },
  python: { hex: "3776AB" },
  fastapi: { hex: "009688" },
  react: { hex: "61DAFB" },
  nextdotjs: { hex: "000000" },
  typescript: { hex: "3178C6" },
  nodedotjs: { hex: "5FA04E" },
  postgresql: { hex: "4169E1" },
  supabase: { hex: "3FCF8E" },
  railway: { hex: "0B0D0E" },
  vercel: { hex: "000000" },
};

// ── Contrast: keep each brand colour, nudged until it reaches 3:1 (non-text) against the page.
type RGB = [number, number, number];
const rgb = (hex: string): RGB => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const lum = (c: RGB) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as RGB;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: RGB, b: RGB) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c: RGB) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

function readable(hex: string, ground: RGB, toward: RGB): string {
  let c = rgb(hex);
  // Monochrome brands (Next.js, Vercel, Railway: black marks) use the text colour of the theme.
  if (Math.max(...c) - Math.min(...c) < 24) return toHex(toward);
  for (let t = 0; ratio(c, ground) < 3 && t < 20; t++)
    c = c.map((v, i) => v + (toward[i]! - v) * 0.15) as RGB;
  return toHex(c);
}
const DARK_BG: RGB = [0x16, 0x18, 0x26];
const LIGHT_BG: RGB = [0xf3, 0xf5, 0xfe];

/** Technology logo in its brand colour (Server Component; adds no client JS). */
export function Logo({ name, className }: { name: BrandLogoName; className?: string }) {
  const logo = LOGOS[name];
  const style = {
    "--brand-dark": readable(logo.hex, DARK_BG, [0xe9, 0xe9, 0xed]),
    "--brand-light": readable(logo.hex, LIGHT_BG, [0x29, 0x2b, 0x31]),
  } as CSSProperties;

  if (logo.glyph) {
    const Glyph = logo.glyph;
    return (
      <Glyph aria-hidden="true" weight="duotone" className={cn("brand-logo", className)} style={style} />
    );
  }
  return (
    <svg aria-hidden="true" className={cn("brand-logo fill-current", className)} style={style}>
      <use href={`/logos.svg#${name}`} />
    </svg>
  );
}
