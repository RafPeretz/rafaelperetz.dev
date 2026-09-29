import { QuotesIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { type Testimonial } from "#site/content";

import { SectionHeading } from "./section-heading";

/** Rendered only when testimonials exist (see page.tsx); carousel controls arrive in Phase 3. */
export async function Testimonials({ items, index }: { items: Testimonial[]; index: number }) {
  const t = await getTranslations("testimonials");

  return (
    <section aria-labelledby="testi-h" className="container-page section-pad">
      <SectionHeading id="testi-h" index={index} kicker={t("kicker")} title={t("title")} />
      <ul
        role="list"
        aria-label={t("region")}
        className="mt-9 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-1"
      >
        {items.map((item) => (
          <li
            key={item.slug}
            className="flex flex-[0_0_min(460px,86%)] snap-start flex-col rounded-lg border border-divider p-7"
          >
            <figure className="m-0 flex h-full flex-col gap-6">
              <QuotesIcon aria-hidden="true" className="size-7 text-accent" />
              <blockquote className="flex-1 text-[19px] leading-normal">{item.quote}</blockquote>
              <figcaption className="text-sm">
                {item.name}
                <br />
                <span className="text-fg-subtle">
                  {item.role}, {item.company}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
