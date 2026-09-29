import { CalendarBlankIcon, EnvelopeSimpleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { ButtonAnchor } from "@/components/ui/button";
import { calUrl, siteConfig } from "@/site.config";

const PROJECT_TYPES = ["cicd", "cloud", "mvp", "retainer", "unsure"] as const;
const BUDGETS = ["lt5k", "k5to15", "k15to40", "gt40k", "discuss"] as const;

export async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" aria-labelledby="contact-h" className="container-page section-pad">
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[clamp(32px,5vw,64px)] overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-surface/45 bg-[radial-gradient(900px_500px_at_0%_0%,color-mix(in_srgb,var(--color-accent-900)_90%,transparent),transparent_70%)] p-[clamp(28px,5vw,64px)] rtl:bg-[radial-gradient(900px_500px_at_100%_0%,color-mix(in_srgb,var(--color-accent-900)_90%,transparent),transparent_70%)]">
        <div className="flex flex-col items-start gap-6">
          <h2 id="contact-h" className="text-display-cta">
            {t("title")}
          </h2>
          <p className="max-w-[44ch] text-base leading-relaxed text-fg-soft">{t("lede")}</p>
          <ButtonAnchor variant="primary" size="lg" href={calUrl} target="_blank" rel="noopener">
            <CalendarBlankIcon aria-hidden="true" className="size-4.5" />
            {t("book")}
          </ButtonAnchor>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="flex items-center gap-2 font-mono-ui text-sm leading-none no-underline"
          >
            <EnvelopeSimpleIcon aria-hidden="true" className="size-4" />
            {siteConfig.links.email}
          </a>
        </div>

        {/* Static markup — wired to a Server Action with validation in Phase 5. */}
        <form className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] content-start gap-3.5">
          <div className="field">
            <label htmlFor="f-name">{t("form.name")}</label>
            <input id="f-name" name="name" className="input" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="f-company">{t("form.company")}</label>
            <input id="f-company" name="company" className="input" autoComplete="organization" />
          </div>
          <div className="field col-span-full">
            <label htmlFor="f-email">{t("form.email")}</label>
            <input id="f-email" name="email" type="email" className="input" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="f-type">{t("form.projectType")}</label>
            <select id="f-type" name="projectType" className="input" defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {PROJECT_TYPES.map((k) => (
                <option key={k} value={k}>
                  {t(`form.projectTypes.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-budget">{t("form.budget")}</label>
            <select id="f-budget" name="budget" className="input" defaultValue="">
              <option value="" disabled>
                {t("form.select")}
              </option>
              {BUDGETS.map((k) => (
                <option key={k} value={k}>
                  {t(`form.budgets.${k}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="field col-span-full">
            <label htmlFor="f-msg">{t("form.message")}</label>
            <textarea id="f-msg" name="message" className="input" rows={4} required />
          </div>
          <button type="submit" className="btn btn-primary col-span-full min-h-11.5 text-[15px]">
            {t("form.submit")}
            <PaperPlaneTiltIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </section>
  );
}
