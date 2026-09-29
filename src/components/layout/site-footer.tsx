import {
  BriefcaseIcon,
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";

import { BrandMark } from "@/components/ui/brand-mark";
import { siteConfig } from "@/site.config";

import { StatusDot } from "./availability-badge";

type FooterLink = { key: "github" | "linkedin" | "upwork" | "malt" | "email"; href: string; icon: Icon };

const LINKS: FooterLink[] = [
  { key: "github", href: siteConfig.links.github, icon: GithubLogoIcon },
  { key: "linkedin", href: siteConfig.links.linkedin, icon: LinkedinLogoIcon },
  { key: "upwork", href: siteConfig.links.upwork, icon: BriefcaseIcon },
  { key: "malt", href: siteConfig.links.malt, icon: StorefrontIcon },
  { key: "email", href: `mailto:${siteConfig.links.email}`, icon: EnvelopeSimpleIcon },
];

/**
 * Real deploy metadata instead of the design's invented uptime figure.
 * Vercel exposes the commit at build time; pages are static, so the date is the build date.
 */
async function DeployStamp() {
  const t = await getTranslations("footer");
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.VERCEL_GIT_REPO_SLUG;
  const date = new Date().toISOString().slice(0, 10);

  const text = sha ? t("deployed", { sha, date }) : t("local", { date });
  const commitUrl = sha && owner && repo ? `https://github.com/${owner}/${repo}/commit/${sha}` : undefined;

  return (
    <p dir="ltr" className="flex items-center gap-2 font-mono-ui text-[11px] leading-none text-fg-faint">
      <StatusDot />
      {commitUrl ? (
        <a href={commitUrl} className="text-fg-faint no-underline hover:text-fg" rel="noopener">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </p>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="container-page flex flex-wrap items-center gap-x-7 gap-y-4.5 pt-18 pb-10">
      <BrandMark tone="muted" />
      <nav aria-label={t("elsewhere")} className="me-auto">
        <ul role="list" className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
          {LINKS.map(({ key, href, icon: IconCmp }) => (
            <li key={key}>
              <a
                href={href}
                {...(key === "email" ? {} : { target: "_blank", rel: "me noopener" })}
                className="flex items-center gap-1.5 text-fg-muted no-underline transition-colors hover:text-fg"
              >
                <IconCmp aria-hidden="true" className="size-3.75" />
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-[13px] text-fg-subtle">{t("copyright", { year: new Date().getFullYear() })}</p>
      <DeployStamp />
    </footer>
  );
}
