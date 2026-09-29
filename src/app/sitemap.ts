import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getCaseStudySlugs } from "@/lib/content";
import { alternates, localizedUrl } from "@/lib/seo";

/** Every page in every locale, each with hreflang alternates. Generated at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    ...getCaseStudySlugs().map((slug) => ({ path: `/work/${slug}`, priority: 0.7 })),
  ];

  return pages.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: alternates(locale, path).languages as Record<string, string> },
    })),
  );
}
