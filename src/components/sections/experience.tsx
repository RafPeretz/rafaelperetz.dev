import { GraduationCapIcon, RocketLaunchIcon, ShieldStarIcon } from "@phosphor-icons/react/ssr";
import { type Icon } from "@phosphor-icons/react";
import { getTranslations } from "next-intl/server";

// Names are localized where an official form exists (messages → experience.companies).
const COMPANIES: { key: "unit81" | "asgo" | "reichman"; icon: Icon }[] = [
  { key: "unit81", icon: ShieldStarIcon },
  { key: "asgo", icon: RocketLaunchIcon },
  { key: "reichman", icon: GraduationCapIcon },
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
          {COMPANIES.map(({ key, icon: IconCmp }) => (
            <li
              key={key}
              className="flex items-center gap-2.5 text-[19px] font-medium tracking-[-0.01em] text-neutral-400"
            >
              <IconCmp aria-hidden="true" className="size-5" />
              {t(`companies.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
