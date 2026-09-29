import { CheckIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { ContentIcon } from "@/components/ui/content-icon";
import { ButtonLink } from "@/components/ui/button";
import { getServices } from "@/lib/content";

import { SectionHeading } from "./section-heading";

export async function Services({ locale, index }: { locale: string; index: number }) {
  const t = await getTranslations("services");
  const services = getServices(locale);
  const packages = services.filter((s) => s.kind === "package");
  const retainer = services.find((s) => s.kind === "retainer");

  return (
    <section id="services" aria-labelledby="services-h" className="container-page section-pad">
      <SectionHeading
        id="services-h"
        index={index}
        kicker={t("kicker")}
        title={t("title")}
        lede={t("lede")}
      />

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,310px),1fr))] gap-4">
        {packages.map((s) => (
          <article
            key={s.slug}
            className="flex flex-col gap-4 rounded-lg border border-divider p-6.5 transition-colors duration-250 glow-card hover:border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)]"
          >
            <div className="flex items-center justify-between">
              <ContentIcon name={s.icon} className="size-6.5 text-accent" />
              {s.duration ? (
                <span className="font-mono-ui text-[11px] leading-none text-fg-subtle">{s.duration}</span>
              ) : null}
            </div>
            <h3 className="text-[22px] leading-tight tracking-[-0.015em]">{s.title}</h3>
            <p className="text-[14.5px] leading-[1.55] text-fg-muted">{s.summary}</p>
            <ul role="list" className="flex flex-1 flex-col gap-2.25 text-sm">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <CheckIcon aria-hidden="true" className="mt-0.75 size-3.5 flex-none text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="flex items-baseline justify-between border-t border-divider pt-4">
              <span className="font-mono-ui text-xs leading-none text-fg-subtle">{t("startingAt")}</span>
              <span className="text-xl font-medium">{s.price}</span>
            </p>
          </article>
        ))}
      </div>

      {retainer ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-4 rounded-lg border border-dashed border-[color-mix(in_srgb,var(--color-fg)_22%,transparent)] px-6.5 py-5.5 transition-colors duration-250 [--glow-fill:transparent] [--glow-strength:11%] glow-card hover:border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)]">
          <ContentIcon name={retainer.icon} className="size-6.5 text-accent" />
          <div className="flex-[1_1_320px]">
            <h3 className="text-lg">{retainer.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{retainer.summary}</p>
          </div>
          <span className="font-mono-ui text-xs leading-none text-fg-subtle">{retainer.price}</span>
          <ButtonLink href="/#contact">{t("retainerCta")}</ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
