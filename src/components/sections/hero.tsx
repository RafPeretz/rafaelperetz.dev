import {
  ArrowDownIcon,
  CalendarBlankIcon,
  GlobeHemisphereWestIcon,
  MapPinIcon,
  TranslateIcon,
} from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { type CSSProperties } from "react";

import { DEPLOYED_AT, ms, UNDERLINE_DURATION } from "@/components/hero/pipeline-timeline";
import { PipelineWindow } from "@/components/hero/pipeline-window";
import { BookCallButton } from "@/components/book-call-button";
import { ButtonLink } from "@/components/ui/button-link";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section aria-labelledby="hero-h" data-pipeline-root className="relative overflow-hidden">
      {/* Colour wash behind the pipeline window (sky + teal), mirrored in RTL. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_360px_at_78%_58%,color-mix(in_srgb,var(--color-sky)_14%,transparent),transparent_70%),radial-gradient(420px_300px_at_92%_88%,color-mix(in_srgb,var(--color-teal)_10%,transparent),transparent_70%)] rtl:bg-[radial-gradient(520px_360px_at_22%_58%,color-mix(in_srgb,var(--color-sky)_14%,transparent),transparent_70%),radial-gradient(420px_300px_at_8%_88%,color-mix(in_srgb,var(--color-teal)_10%,transparent),transparent_70%)]"
      />
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
                  <span className="text-gradient">{chunks}</span>
                  <span
                    aria-hidden="true"
                    className="pl-grow absolute start-0 -bottom-[0.04em] h-0.5 w-full bg-linear-to-r from-accent via-sky to-teal shadow-[0_0_16px_var(--color-sky)] ltr:origin-left rtl:origin-right rtl:bg-linear-to-l"
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
            <span className="flex items-center gap-1.5">
              <MapPinIcon aria-hidden="true" weight="fill" className="size-3.5 text-sky" />
              {t("meta.location")}
            </span>
            <span className="flex items-center gap-1.5">
              <TranslateIcon aria-hidden="true" weight="bold" className="size-3.5 text-accent" />
              {t("meta.languages")}
            </span>
            <span className="flex items-center gap-1.5">
              <GlobeHemisphereWestIcon aria-hidden="true" weight="fill" className="size-3.5 text-teal" />
              {t("meta.remote")}
            </span>
          </p>
        </div>
        <PipelineWindow />
      </div>
    </section>
  );
}
