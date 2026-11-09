import { ChatCircleTextIcon, FileTextIcon, LockKeyOpenIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { type CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

const STAGES = ["discovery", "audit", "build", "deploy", "handover"] as const;
// One hue per stage; each connector fades from its stage's hue into the next one's.
const HUES = ["accent", "sky", "teal", "amber", "rose"] as const;
const PRINCIPLES = [
  { key: "communication", icon: ChatCircleTextIcon, tone: "tone-violet" },
  { key: "docs", icon: FileTextIcon, tone: "tone-sky" },
  { key: "lockin", icon: LockKeyOpenIcon, tone: "tone-teal" },
] as const;

export async function Process({ index }: { index: number }) {
  const t = await getTranslations("process");

  return (
    <section id="process" aria-labelledby="process-h" className="container-page section-pad">
      <SectionHeading id="process-h" index={index} kicker={t("kicker")} title={t("title")} />

      <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-y-7">
        {STAGES.map((key, i) => {
          const last = i === STAGES.length - 1;
          const hue = `var(--color-${HUES[i]})`;
          const next = last ? "transparent" : `var(--color-${HUES[i + 1]})`;
          return (
            <li
              key={key}
              data-reveal
              className="flex flex-col gap-3 pe-5"
              style={{ "--tone": hue, "--next": next } as CSSProperties}
            >
              <div aria-hidden="true" className="flex items-center">
                <span className="size-2.75 flex-none rounded-full bg-tone shadow-[0_0_12px_var(--tone)]" />
                <span className="h-px flex-1 bg-linear-to-r from-tone/70 to-[color-mix(in_srgb,var(--next)_55%,transparent)] rtl:bg-linear-to-l" />
              </div>
              <span className="font-mono-ui text-[11px] leading-none text-tone">
                stage_{String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[19px] leading-tight">{t(`stages.${key}.title`)}</h3>
              <p className="text-sm leading-[1.55] text-fg-muted">{t(`stages.${key}.body`)}</p>
            </li>
          );
        })}
      </ol>

      <ul role="list" className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
        {PRINCIPLES.map(({ key, icon: IconCmp, tone }) => (
          <li key={key} className={cn(tone, "flex gap-3.5 rounded-md bg-surface/50 px-5 py-4.5")}>
            <span className="grid size-9 flex-none place-items-center rounded-md bg-tone/14 text-tone">
              <IconCmp aria-hidden="true" weight="duotone" className="size-5" />
            </span>
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
