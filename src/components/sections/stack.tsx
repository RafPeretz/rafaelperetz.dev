import { getTranslations } from "next-intl/server";

import { ContentIcon } from "@/components/ui/content-icon";
import { getStack } from "@/lib/content";

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
            className="flex flex-wrap gap-x-6 gap-y-3 border-t border-divider py-5 last:border-b"
          >
            <h3 className="flex-[0_0_180px] font-mono-ui text-xs leading-[2.6] font-medium tracking-[0.06em] text-fg-subtle uppercase">
              {g.label}
            </h3>
            <ul role="list" className="flex flex-[1_1_320px] flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item.name}
                  title={item.hint}
                  className="flex items-center gap-2 rounded-md border border-divider px-3 py-2 text-sm transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-chip"
                >
                  <ContentIcon name={item.icon} className="size-4.25 text-accent" />
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
