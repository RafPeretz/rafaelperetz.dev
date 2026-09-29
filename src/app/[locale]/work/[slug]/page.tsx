import { ArrowLeftIcon, ArrowRightIcon, CalendarBlankIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BookCallButton } from "@/components/book-call-button";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { getCaseStudies, getCaseStudy, getCaseStudySlugs } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) return {};
  const t = await getTranslations({ locale, namespace: "caseStudy" });
  return { title: t("metaTitle", { title: study.title }), description: study.summary };
}

/** Standalone, indexable case study page (direct visits, shares, crawlers, no-JS). */
export default async function CaseStudyPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();

  const t = await getTranslations("caseStudy");
  const all = getCaseStudies(locale);
  const next = all[(all.findIndex((c) => c.slug === slug) + 1) % all.length];

  return (
    <article className="container-page pt-[clamp(40px,7vw,88px)]">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono-ui text-xs text-fg-subtle no-underline hover:text-fg"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
          {t("back")}
        </Link>

        <header className="mt-8">
          <p className="font-mono-ui text-[11px] leading-none font-medium tracking-[0.08em] text-accent-text uppercase">
            {study.role}
          </p>
          <h1 className="mt-3 text-h2">{study.title}</h1>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-fg-soft">{study.summary}</p>
        </header>

        <div className="mt-10 rounded-lg border border-divider bg-surface/55 p-[clamp(22px,4vw,40px)]">
          <CaseStudyBody study={study} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <BookCallButton size="md">
            <CalendarBlankIcon aria-hidden="true" className="size-4.25" />
            {t("cta")}
          </BookCallButton>
          {next && next.slug !== slug ? (
            <Link href={`/work/${next.slug}`} className="inline-flex items-center gap-2 text-sm no-underline">
              <span className="text-fg-subtle">{t("next")}:</span> {next.title}
              <ArrowRightIcon aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
