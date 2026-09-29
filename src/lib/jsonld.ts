import { type Locale } from "@/i18n/routing";
import { siteConfig } from "@/site.config";

import { localizedUrl } from "./seo";

/** Profile links still set to a bare domain (placeholders) are left out of sameAs. */
const isProfile = (url: string) => {
  try {
    return new URL(url).pathname.replace(/\/$/, "").length > 0;
  } catch {
    return false;
  }
};

/** Person + ProfessionalService graph for the homepage (schema.org). */
export function homeJsonLd(
  locale: Locale,
  { description, services }: { description: string; services: string[] },
) {
  const { url, name, jobTitle, links, location } = siteConfig;
  const sameAs = [links.github, links.linkedin, links.upwork, links.malt].filter(isProfile);
  const address = {
    "@type": "PostalAddress",
    addressLocality: location.city,
    addressCountry: location.country,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name,
        jobTitle,
        url: localizedUrl(locale),
        email: `mailto:${links.email}`,
        address,
        knowsLanguage: ["en", "he", "fr"],
        knowsAbout: ["DevOps", "Cloud infrastructure", "Kubernetes", "CI/CD", "AWS", "Azure", "DevSecOps"],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#service`,
        name: `${name} — ${jobTitle}`,
        description,
        url: localizedUrl(locale),
        image: `${localizedUrl(locale)}/opengraph-image`,
        email: links.email,
        address,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hebrew", "French"],
        founder: { "@id": `${url}/#person` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        },
      },
    ],
  };
}

/** Serialize safely for a <script type="application/ld+json"> (no "</script>" breakouts). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
