import { ChatCircleTextIcon, FileTextIcon, LockKeyOpenIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

const STAGES = ["discovery", "audit", "build", "deploy", "handover"] as const;
const PRINCIPLES = [
  { key: "communication", icon: ChatCircleTextIcon },
  { key: "docs", icon: FileTextIcon },
  { key: "lockin", icon: LockKeyOpenIcon },
] as const;

export async function Process({ index }: { index: number }) {
  const t = await getTranslations("process");

  return (
    <section id="process" aria-labelledby="process-h" className="container-page section-pad">
      <SectionHeading id="process-h" index={index} kicker={t("kicker")} title={t("title")} />

      <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-y-7">
        {STAGES.map((key, i) => {
          const first = i === 0;
          const last = i === STAGES.length - 1;
          return (
            <li key={key} data-reveal className="flex flex-col gap-3 pe-5">
              <div aria-hidden="true" className="flex items-center">
                <span
                  className={cn(
                    "size-2.75 flex-none rounded-full",
                    first ? "bg-accent shadow-glow-sm" : "border border-accent bg-bg",
                  )}
                />
                <span
                  className={cn(
                    "h-px flex-1",
                    first &&
                      "bg-linear-to-r from-accent to-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] rtl:bg-linear-to-l",
                    last &&
                      "bg-linear-to-r from-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] to-transparent rtl:bg-linear-to-l",
                    !first && !last && "bg-[color-mix(in_srgb,var(--color-accent)_40%,transparent)]",
                  )}
                />
              </div>
              <span className="font-mono-ui text-[11px] leading-none text-fg-subtle">
                stage_{String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[19px] leading-tight">{t(`stages.${key}.title`)}</h3>
              <p className="text-sm leading-[1.55] text-fg-muted">{t(`stages.${key}.body`)}</p>
            </li>
          );
        })}
      </ol>

      <ul role="list" className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
        {PRINCIPLES.map(({ key, icon: IconCmp }) => (
          <li key={key} className="flex gap-3.5 rounded-md bg-surface/50 px-5 py-4.5">
            <IconCmp aria-hidden="true" className="size-5.5 flex-none text-accent" />
            <div>
              <p className="font-medium">{t(`principles.${key}.title`)}</p>
              <p className="mt-1 text-sm text-fg-muted">{t(`principles.${key}.body`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
