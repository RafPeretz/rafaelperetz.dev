import { ArrowDownIcon, CalendarBlankIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { type CSSProperties } from "react";

import { DEPLOYED_AT, ms, UNDERLINE_DURATION } from "@/components/hero/pipeline-timeline";
import { PipelineWindow } from "@/components/hero/pipeline-window";
import { BookCallButton } from "@/components/book-call-button";
import { ButtonLink } from "@/components/ui/button";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section aria-labelledby="hero-h" data-pipeline-root className="relative overflow-hidden">
      {/* Masked 56px grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(color-mix(in_srgb,var(--color-fg)_5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-fg)_5%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_30%,black,transparent_75%)] [background-size:56px_56px] rtl:[mask-image:radial-gradient(ellipse_80%_70%_at_30%_30%,black,transparent_75%)]"
      />
      <div className="relative container-page grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,6vw,72px)] pt-[clamp(56px,10vw,128px)] pb-[clamp(64px,9vw,112px)]">
        <div>
          <h1 id="hero-h" className="text-display">
            {t.rich("title", {
              em: (chunks) => (
                <span className="relative whitespace-nowrap">
                  {chunks}
                  <span
                    aria-hidden="true"
                    className="pl-grow absolute start-0 -bottom-[0.04em] h-0.5 w-full bg-accent shadow-glow ltr:origin-left rtl:origin-right"
                    style={
                      { "--pl-from": ms(DEPLOYED_AT), "--pl-for": ms(UNDERLINE_DURATION) } as CSSProperties
                    }
                  />
                </span>
              ),
            })}
          </h1>
          <p className="mt-7 max-w-[52ch] text-[17px] leading-relaxed text-fg-soft">{t("lede")}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <BookCallButton data-magnetic variant="primary" size="md">
              <CalendarBlankIcon aria-hidden="true" className="size-4.25" />
              {t("ctaBook")}
            </BookCallButton>
            <ButtonLink data-magnetic variant="secondary" size="md" href="/#work" prefetch={false}>
              {t("ctaWork")}
              <ArrowDownIcon aria-hidden="true" className="size-3.75" />
            </ButtonLink>
          </div>
          <p className="mt-7 flex flex-wrap gap-x-4 gap-y-1.5 font-mono-ui text-xs leading-snug text-fg-subtle">
            <span>{t("meta.location")}</span>
            <span>{t("meta.languages")}</span>
            <span>{t("meta.remote")}</span>
          </p>
        </div>
        <PipelineWindow />
      </div>
    </section>
  );
}
