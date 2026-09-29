import { QuotesIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { type Testimonial } from "#site/content";

import { CarouselControls } from "./carousel-controls";
import { SectionHeading } from "./section-heading";

const LIST_ID = "testimonials-list";

/** Rendered only when testimonials exist (see page.tsx). */
export async function Testimonials({ items, index }: { items: Testimonial[]; index: number }) {
  const t = await getTranslations("testimonials");

  return (
    <section aria-labelledby="testi-h" className="container-page section-pad">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading id="testi-h" index={index} kicker={t("kicker")} title={t("title")} />
        {items.length > 1 ? <CarouselControls listId={LIST_ID} prev={t("prev")} next={t("next")} /> : null}
      </div>
      {/* Focusable so keyboard users can scroll it with the arrow keys. */}
      <ul
        id={LIST_ID}
        role="list"
        tabIndex={0}
        aria-label={t("region")}
        className="mt-9 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto rounded-lg pb-1"
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
