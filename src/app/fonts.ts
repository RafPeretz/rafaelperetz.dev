import { Inter, JetBrains_Mono } from "next/font/google";

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
});
