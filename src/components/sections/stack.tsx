import { getTranslations } from "next-intl/server";

import { ContentIcon } from "@/components/ui/content-icon";
import { Logo } from "@/components/ui/logo";
import { getStack } from "@/lib/content";
import { cn } from "@/lib/utils";

import { SectionHeading } from "./section-heading";

export async function Stack({ locale, index }: { locale: string; index: number }) {
  const t = await getTranslations("stack");
  const groups = getStack(locale);

  return (
    <section id="stack" aria-labelledby="stack-h" className="container-page section-pad">
      <SectionHeading id="stack-h" index={index} kicker={t("kicker")} title={t("title")} />

      <div className="mt-10 flex flex-col">
        {groups.map((g) => (
          <div
            key={g.label}
            data-reveal
            className={cn(
              `tone-${g.tone}`,
              "flex flex-wrap gap-x-6 gap-y-3 border-t border-divider py-5 last:border-b",
            )}
          >
            <h3 className="flex flex-[0_0_180px] items-center gap-2.5 font-mono-ui text-xs leading-[2.6] font-medium tracking-[0.06em] text-tone uppercase">
              <span
                aria-hidden="true"
                className="size-1.75 rounded-full bg-tone shadow-[0_0_10px_var(--tone)]"
              />
              {g.label}
            </h3>
            <ul role="list" className="flex flex-[1_1_320px] flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  title={item.hint}
                  className="flex items-center gap-2 rounded-md border border-divider bg-surface/40 px-3 py-2 text-sm transition-[border-color,box-shadow] duration-200 hover:border-tone hover:shadow-[0_0_18px_color-mix(in_srgb,var(--tone)_30%,transparent)]"
                >
                  {item.logo ? (
                    <Logo name={item.logo} className="size-4.25" />
                  ) : item.icon ? (
                    <ContentIcon name={item.icon} weight="duotone" className="size-4.25 text-tone" />
                  ) : null}
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
