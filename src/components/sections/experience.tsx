import { GraduationCapIcon, RocketLaunchIcon, ShieldStarIcon } from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

// Names are localized where an official form exists (messages → experience.companies).
const COMPANIES: { key: "unit81" | "asgo" | "reichman"; icon: Icon; tone: string }[] = [
  { key: "unit81", icon: ShieldStarIcon, tone: "tone-teal" },
  { key: "asgo", icon: RocketLaunchIcon, tone: "tone-violet" },
  { key: "reichman", icon: GraduationCapIcon, tone: "tone-sky" },
];

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section aria-label={t("section")} className="container-page pb-10">
      <div className="flex flex-wrap items-center gap-x-[clamp(24px,4vw,56px)] gap-y-3.5">
        <p className="font-mono-ui text-[11px] leading-none tracking-[0.08em] text-fg-subtle uppercase">
          {t("label")}
        </p>
        <ul role="list" className="contents">
          {COMPANIES.map(({ key, icon: IconCmp, tone }) => (
            <li
              key={key}
              className={cn(
                tone,
                "flex items-center gap-2.5 text-[19px] font-medium tracking-[-0.01em] text-neutral-400",
              )}
            >
              <span className="grid size-8 place-items-center rounded-md bg-tone/14 text-tone">
                <IconCmp aria-hidden="true" weight="duotone" className="size-4.5" />
              </span>
              {t(`companies.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
