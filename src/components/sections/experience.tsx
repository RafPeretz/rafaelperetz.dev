import { getTranslations } from "next-intl/server";

// TODO: confirm "Porsche Digital" (see TODO.md). Names are localized where an official form exists.
const COMPANIES = ["unit81", "porsche", "reysecurity", "reichman"] as const;

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section aria-label={t("section")} className="container-page pb-10">
      <div className="flex flex-wrap items-center gap-x-[clamp(24px,4vw,56px)] gap-y-3.5">
        <p className="font-mono-ui text-[11px] leading-none tracking-[0.08em] text-fg-subtle uppercase">
          {t("label")}
        </p>
        <ul role="list" className="contents">
          {COMPANIES.map((key) => (
            <li key={key} className="text-[19px] font-medium tracking-[-0.01em] text-neutral-400">
              {t(`companies.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
