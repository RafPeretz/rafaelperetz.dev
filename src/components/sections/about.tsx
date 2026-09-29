import { ClockIcon, MapPinIcon, TranslateIcon, UserIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/site.config";

import { Kicker } from "./section-heading";

export async function About({ index }: { index: number }) {
  const t = await getTranslations("about");

  return (
    <section id="about" aria-labelledby="about-h" className="container-page section-pad">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(32px,6vw,80px)]">
        <figure className="lighten relative m-0 aspect-[4/5] max-w-[440px] overflow-hidden rounded-lg border border-divider">
          {siteConfig.portrait ? (
            <Image
              src={siteConfig.portrait}
              alt={t("portraitAlt")}
              fill
              sizes="(min-width: 800px) 440px, 100vw"
              className="object-cover"
            />
          ) : (
            // TODO: replace with the portrait (siteConfig.portrait)
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface/60 bg-[radial-gradient(circle_at_50%_35%,var(--color-accent-900),transparent_70%)]">
              <UserIcon aria-hidden="true" className="size-16 text-fg-faint" />
              <span className="font-mono-ui text-[11px] text-fg-faint">{t("portraitPlaceholder")}</span>
            </div>
          )}
        </figure>

        <div>
          <Kicker index={index}>{t("kicker")}</Kicker>
          <h2 id="about-h" className="mt-4.5 max-w-[18ch] text-h2">
            {t("title")}
          </h2>
          <div className="mt-6 flex max-w-[56ch] flex-col gap-3.5 text-base leading-[1.65] text-fg-soft">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p className="text-fg">{t("p3")}</p>
          </div>
          <ul role="list" className="mt-7 flex flex-wrap gap-2">
            <li className="tag tag-accent px-3 py-1.5">
              <TranslateIcon aria-hidden="true" />
              {t("tags.languages")}
            </li>
            <li className="tag tag-neutral px-3 py-1.5">
              <MapPinIcon aria-hidden="true" />
              {t("tags.location")}
            </li>
            <li className="tag tag-neutral px-3 py-1.5">
              <ClockIcon aria-hidden="true" />
              {t("tags.hours")}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
