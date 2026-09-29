import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getCaseStudies } from "@/lib/content";

import { SectionHeading } from "./section-heading";

export async function Work({ locale, index }: { locale: string; index: number }) {
  const t = await getTranslations("work");
  const cases = getCaseStudies(locale);

  return (
    <section id="work" aria-labelledby="work-h" className="container-page section-pad">
      <SectionHeading id="work-h" index={index} kicker={t("kicker")} title={t("title")} />

      <ul role="list" className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-4">
        {cases.map((c) => (
          <li key={c.slug} data-reveal className="flex">
            <Link
              href={`/work/${c.slug}`}
              className="flex min-h-90 w-full flex-col gap-4.5 rounded-lg border border-divider p-7 text-fg no-underline transition-colors duration-250 [--glow-size:480px] [--glow-strength:14%] glow-card hover:border-[color-mix(in_srgb,var(--color-accent)_50%,transparent)] hover:text-fg"
            >
              <span className="font-mono-ui text-[11px] leading-none font-medium tracking-[0.08em] text-accent-text uppercase">
                {c.role}
              </span>
              <span className="text-case font-medium">{c.title}</span>
              <span className="max-w-[46ch] text-[15px] leading-[1.55] text-fg-soft">{c.summary}</span>
              <span className="flex-1" />
              <span
                dir="ltr"
                className="grid grid-cols-[auto_1fr] gap-x-4.5 gap-y-1.5 rounded-md bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] px-4 py-3.5 text-left font-mono-ui text-xs leading-[1.4]"
              >
                {c.card.map((row) => (
                  <span key={row.key} className="contents">
                    <span className="text-fg-faint">{row.key}</span>
                    <span>{row.value}</span>
                  </span>
                ))}
              </span>
              <span className="flex items-center gap-2 text-sm text-accent-text">
                {t("readCase")}
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
              </span>
            </Link>
          </li>
        ))}
        <li data-reveal className="flex">
          <Link
            href="/#contact"
            prefetch={false}
            className="flex min-h-90 w-full flex-col justify-end gap-3.5 rounded-lg border border-dashed border-[color-mix(in_srgb,var(--color-fg)_24%,transparent)] bg-[repeating-linear-gradient(135deg,transparent_0_14px,color-mix(in_srgb,var(--color-fg)_3%,transparent)_14px_15px)] p-7 text-fg no-underline transition-colors duration-250 hover:border-accent hover:text-fg"
          >
            <span className="font-mono-ui text-[11px] leading-none font-medium tracking-[0.08em] text-fg-subtle uppercase">
              {t("slot.kicker")}
            </span>
            <span className="text-case font-medium">{t("slot.title")}</span>
            <span className="flex items-center gap-2 text-sm text-accent-text">
              {t("slot.cta")}
              <ArrowRightIcon aria-hidden="true" className="size-3.5 rtl:-scale-x-100" />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
