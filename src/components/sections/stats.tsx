import { getTranslations } from "next-intl/server";

const STATS = ["years", "clouds", "security"] as const;

export async function Stats() {
  const t = await getTranslations("stats");

  return (
    <section
      aria-label={t("label")}
      className="bg-section bg-[radial-gradient(900px_420px_at_85%_-40%,color-mix(in_srgb,var(--color-section-glow)_70%,transparent),transparent_64%)] rtl:bg-[radial-gradient(900px_420px_at_15%_-40%,color-mix(in_srgb,var(--color-section-glow)_70%,transparent),transparent_64%)]"
    >
      <dl className="container-page grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-12 gap-y-9 py-14">
        {STATS.map((key) => (
          <div key={key} className="flex flex-col-reverse">
            <dt className="mt-3.5 font-mono-ui text-xs leading-normal tracking-[0.04em] text-fg-muted uppercase">
              {t(`${key}.label`)}
            </dt>
            <dd className="text-stat font-medium">
              {key === "years"
                ? t.rich("years.value", { count: (chunks) => <span>{chunks}</span> })
                : t(`${key}.value`)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
