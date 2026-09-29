import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "he"],
  defaultLocale: "en",
  // "/" serves English; other locales are prefixed ("/fr", "/he").
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

const RTL_LOCALES: ReadonlySet<string> = new Set(["he"]);

export function getDirection(locale: string): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
