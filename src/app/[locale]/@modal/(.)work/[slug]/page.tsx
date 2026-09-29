import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CaseModal } from "@/components/case-study/case-modal";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/server";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}
export const dynamicParams = false;

/** Intercepted /work/[slug]: opened from the homepage as a modal (the design's interaction). */
export default async function CaseStudyModal({ params }: PageProps<"/[locale]/work/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();
  const t = await getTranslations("caseStudy");

  return (
    <CaseModal
      titleId="case-title"
      closeLabel={t("close")}
      header={
        <div>
          <p className="font-mono-ui text-[11px] leading-none font-medium tracking-[0.08em] text-accent-text uppercase">
            {study.role}
          </p>
          <h2 id="case-title" className="mt-2.5 text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.03em]">
            {study.title}
          </h2>
        </div>
      }
    >
      <CaseStudyBody study={study} />
      <Link href="/#contact" className="btn btn-primary min-h-11 self-start px-4.5">
        {t("cta")}
      </Link>
    </CaseModal>
  );
}
