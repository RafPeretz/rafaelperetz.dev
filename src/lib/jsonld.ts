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
        image: `${url}${siteConfig.portrait}`,
        email: `mailto:${links.email}`,
        address,
        knowsLanguage: ["en", "he", "fr"],
        knowsAbout: [
          "Full-stack development",
          "Web application development",
          "React",
          "Next.js",
          "TypeScript",
          "Python",
          "FastAPI",
          "DevOps",
          "Cloud infrastructure",
          "Kubernetes",
          "CI/CD",
          "AWS",
          "Azure",
          "DevSecOps",
        ],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#service`,
        name: `${name}, ${jobTitle}`,
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

/** Article + breadcrumb for a case study page. The author points at the homepage's Person node. */
export function caseStudyJsonLd(
  locale: Locale,
  study: { slug: string; title: string; summary: string; stack: string[] },
  labels: { headline: string; work: string },
) {
  const { url, name } = siteConfig;
  const pageUrl = localizedUrl(locale, `/work/${study.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: labels.headline,
        description: study.summary,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: locale,
        image: `${localizedUrl(locale, `/work/${study.slug}`)}/opengraph-image`,
        keywords: study.stack.join(", "),
        author: { "@type": "Person", "@id": `${url}/#person`, name, url },
        publisher: { "@type": "Person", "@id": `${url}/#person`, name, url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name, item: localizedUrl(locale) },
          { "@type": "ListItem", position: 2, name: labels.work, item: `${localizedUrl(locale)}#work` },
          { "@type": "ListItem", position: 3, name: study.title, item: pageUrl },
        ],
      },
    ],
  };
}

/** Serialize safely for a <script type="application/ld+json"> (no "</script>" breakouts). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
