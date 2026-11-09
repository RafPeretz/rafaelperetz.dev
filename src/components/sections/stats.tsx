import { ShieldCheckIcon, StackIcon, TimerIcon } from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

const STATS: { key: "years" | "fullstack" | "security"; icon: Icon; tone: string }[] = [
  { key: "years", icon: TimerIcon, tone: "tone-sky" },
  { key: "fullstack", icon: StackIcon, tone: "tone-violet" },
  { key: "security", icon: ShieldCheckIcon, tone: "tone-teal" },
];

export async function Stats() {
  const t = await getTranslations("stats");

  return (
    <section
      aria-label={t("label")}
      className="bg-section bg-[radial-gradient(900px_420px_at_85%_-40%,color-mix(in_srgb,var(--color-section-glow)_70%,transparent),transparent_64%),radial-gradient(700px_380px_at_8%_140%,color-mix(in_srgb,var(--color-sky)_16%,transparent),transparent_70%)] rtl:bg-[radial-gradient(900px_420px_at_15%_-40%,color-mix(in_srgb,var(--color-section-glow)_70%,transparent),transparent_64%),radial-gradient(700px_380px_at_92%_140%,color-mix(in_srgb,var(--color-sky)_16%,transparent),transparent_70%)]"
    >
      <dl className="container-page grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-12 gap-y-9 py-14">
        {STATS.map(({ key, icon: IconCmp, tone }) => (
          <div key={key} data-reveal className={cn(tone, "flex flex-col")}>
            {/* dt first in the DOM (valid <dl>); `order` puts the value visually above the label. */}
            <dt className="order-2 mt-3.5 font-mono-ui text-xs leading-normal tracking-[0.04em] text-fg-muted uppercase">
              {t(`${key}.label`)}
            </dt>
            <dd className="order-1 text-stat font-medium">
              <span
                aria-hidden="true"
                className="mb-4 grid size-9 place-items-center rounded-md bg-tone/16 text-tone"
              >
                <IconCmp weight="duotone" className="size-5" />
              </span>
              <span className="text-gradient">
                {key === "years"
                  ? t.rich("years.value", { count: (chunks) => <span data-count="3">{chunks}</span> })
                  : t(`${key}.value`)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
