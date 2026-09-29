import { getTranslations } from "next-intl/server";

// Company names are proper nouns and stay untranslated. TODO: confirm "Porsche Digital" (see TODO.md).
const COMPANIES = ["Unit 81", "Porsche Digital", "ReySecurity", "Reichman University"];

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section aria-label={t("section")} className="container-page pb-10">
      <div className="flex flex-wrap items-center gap-x-[clamp(24px,4vw,56px)] gap-y-3.5">
        <p className="font-mono-ui text-[11px] leading-none tracking-[0.08em] text-fg-subtle uppercase">
          {t("label")}
        </p>
        <ul role="list" className="contents">
          {COMPANIES.map((name) => (
            <li key={name} className="text-[19px] font-medium tracking-[-0.01em] text-neutral-400">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
