import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/site.config";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_FR", he: "he_IL" };

/** Absolute URL of `path` (e.g. "/work/x") in `locale`, following the as-needed prefix rule. */
export function localizedUrl(locale: Locale, path = "/"): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = path === "/" ? "" : path;
  return `${siteConfig.url}${prefix}${suffix}` || `${siteConfig.url}/`;
}

/** Canonical + hreflang alternates (all locales + x-default) for a path. */
export function alternates(locale: Locale, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
      "x-default": localizedUrl(routing.defaultLocale, path),
    },
  };
}

/** Open Graph fields shared by every page (images come from opengraph-image.tsx files). */
export function openGraph(
  locale: Locale,
  path: string,
  fields: { title: string; description: string; type?: "website" | "article" },
): NonNullable<Metadata["openGraph"]> {
  return {
    type: fields.type ?? "website",
    siteName: siteConfig.name,
    title: fields.title,
    description: fields.description,
    url: localizedUrl(locale, path),
    locale: OG_LOCALE[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}

/** Only the production deployment is indexable; previews and branches are noindex. */
export const indexable = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
