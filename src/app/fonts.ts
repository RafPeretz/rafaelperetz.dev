import { Inter, JetBrains_Mono, Noto_Sans_Hebrew } from "next/font/google";

// Self-hosted at build time by next/font; size-adjusted fallbacks prevent layout shift.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  // Not needed for the first paint of the headline; skip the preload to keep the critical path lean.
  preload: false,
});

// Inter has no Hebrew glyphs. Applied on /he only; the font stacks fall through to it per glyph.
// Not preloaded, so EN/FR pages never download it.
export const notoHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-hebrew",
  display: "swap",
  preload: false,
});
