import { CheckIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { type ReactNode } from "react";

import { type CaseStudy } from "#site/content";

function Label({ index, children }: { index: number; children: ReactNode }) {
  return (
    <p className="mb-2 font-mono-ui text-[11px] leading-none text-fg-subtle">
      {String(index).padStart(2, "0")} · {children}
    </p>
  );
}

/**
 * Context → Challenge → What I built → Stack → Outcome.
 * Shared by the homepage modal and the standalone /work/[slug] page.
 */
export async function CaseStudyBody({ study }: { study: CaseStudy }) {
  const t = await getTranslations("caseStudy");

  return (
    <div className="flex flex-col gap-5.5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-5.5">
        <section>
          <Label index={1}>{t("context")}</Label>
          <p className="text-[15px] leading-relaxed">{study.context}</p>
        </section>
        <section>
          <Label index={2}>{t("challenge")}</Label>
          <p className="text-[15px] leading-relaxed">{study.challenge}</p>
        </section>
      </div>

      <section>
        <Label index={3}>{t("built")}</Label>
        <ul role="list" className="mt-2.5 flex flex-col gap-2.5">
          {study.built.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-[1.55]">
              <CheckIcon aria-hidden="true" className="mt-1 size-3.5 flex-none text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Label index={4}>{t("stack")}</Label>
        <ul role="list" dir="ltr" className="mt-2.5 flex flex-wrap gap-1.5 rtl:justify-end">
          {study.stack.map((s) => (
            <li key={s} className="tag tag-neutral font-mono-ui">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-md border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-900)_60%,transparent)] px-5 py-4.5">
        <p className="mb-2 font-mono-ui text-[11px] leading-none text-accent-300">05 · {t("outcome")}</p>
        <p className="text-base leading-[1.55]">{study.outcome}</p>
      </section>

      {study.body ? (
        <div
          className="max-w-[65ch] text-[15px] leading-relaxed text-fg-soft [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_li]:ms-5 [&_li]:list-disc [&_p]:mt-4"
          // Trusted, build-time Markdown from /content.
          dangerouslySetInnerHTML={{ __html: study.body }}
        />
      ) : null}
    </div>
  );
}
