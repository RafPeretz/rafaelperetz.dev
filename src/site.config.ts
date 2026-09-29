/**
 * Central site configuration — the one file to edit for identity, links and switches.
 * Anything marked TODO is a placeholder tracked in TODO.md.
 */

export type Availability = "available" | "limited" | "booked";

/**
 * Canonical origin. Resolution order:
 * 1. NEXT_PUBLIC_SITE_URL — set this once the custom domain is live (https://rafaelperetz.dev)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — the project's production *.vercel.app domain (set by Vercel)
 * 3. localhost for local development
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const siteConfig = {
  name: "Rafael Peretz",
  shortName: "Rafa",
  initials: "RP",
  jobTitle: "Freelance DevOps & Cloud Engineer",
  /** Target domain (not purchased yet). Used for display and the future email address. */
  domain: "rafaelperetz.dev",
  url: resolveSiteUrl(),
  location: { city: "Tel Aviv", country: "IL", timezone: "Asia/Jerusalem" },

  /** Drives the nav/footer status pill. Localized labels live in messages/*.json → availability.* */
  availability: "available" as Availability,

  /** Portrait in /public, e.g. "/images/portrait.jpg" (4:5, ≥ 880×1100). null renders a placeholder. */
  portrait: null as string | null, // TODO: add portrait photo

  links: {
    email: "hello@rafaelperetz.dev", // TODO: mailbox not live until the domain is bought — see TODO.md
    github: "https://github.com/", // TODO: GitHub profile URL
    linkedin: "https://www.linkedin.com/", // TODO: LinkedIn profile URL
    upwork: "https://www.upwork.com/", // TODO: Upwork profile URL
    malt: "https://www.malt.com/", // TODO: Malt profile URL
    /** Cal.com event link, e.g. "rafaelperetz/20min" → https://cal.com/rafaelperetz/20min */
    cal: "rafaelperetz/20min", // TODO: real Cal.com event slug
  },

  features: {
    /** Vercel Web Analytics + Speed Insights. */
    analytics: true,
    /** Testimonials section renders only when enabled AND content exists. */
    testimonials: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const calUrl = `https://cal.com/${siteConfig.links.cal}`;
