import { PlusIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { getFaqs } from "@/lib/content";

import { SectionHeading } from "./section-heading";

export async function Faq({ locale, index }: { locale: string; index: number }) {
  const t = await getTranslations("faq");
  const faqs = getFaqs(locale);

  return (
    <section id="faq" aria-labelledby="faq-h" className="container-page section-pad">
      <div className="flex flex-wrap gap-x-[clamp(32px,6vw,80px)] gap-y-8">
        <SectionHeading
          id="faq-h"
          index={index}
          kicker={t("kicker")}
          title={t("title")}
          className="flex-[1_1_280px]"
        />
        <div className="flex flex-[2_1_460px] flex-col">
          {faqs.map((f, i) => (
            <details key={f.slug} open={i === 0} className="group border-t border-divider last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-medium">
                {f.question}
                <PlusIcon
                  aria-hidden="true"
                  className="size-4 flex-none text-accent transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              {/* Answers are trusted, build-time Markdown from /content. */}
              <div
                className="mb-5.5 max-w-[60ch] text-[15px] leading-relaxed text-fg-muted [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: f.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
