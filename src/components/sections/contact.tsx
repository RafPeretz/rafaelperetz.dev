import { CalendarBlankIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

import { BookCallButton } from "@/components/book-call-button";
import { ContactForm, type ContactFormLabels } from "@/components/contact/contact-form";
import { BUDGETS, PROJECT_TYPES } from "@/lib/contact-fields";
import { siteConfig } from "@/site.config";

export async function Contact({ locale }: { locale: string }) {
  const t = await getTranslations("contact");
  const f = await getTranslations("contact.form");

  // The form is a client component; it receives its strings as props (no messages ship to the browser).
  const labels: ContactFormLabels = {
    name: f("name"),
    company: f("company"),
    email: f("email"),
    projectType: f("projectType"),
    budget: f("budget"),
    message: f("message"),
    select: f("select"),
    optional: f("optional"),
    submit: f("submit"),
    sending: f("sending"),
    honeypot: f("honeypot"),
    invalid: f("invalid"),
    successTitle: f("successTitle"),
    successBody: f("successBody"),
    sendAnother: f("sendAnother"),
    // {email} is substituted client-side.
    error: f.raw("error") as string,
    rateLimited: f.raw("rateLimited") as string,
    errors: {
      required: f("errors.required"),
      invalid: f("errors.invalid"),
      tooShort: f("errors.tooShort"),
      tooLong: f("errors.tooLong"),
    },
    projectTypes: Object.fromEntries(
      PROJECT_TYPES.map((k) => [k, f(`projectTypes.${k}`)]),
    ) as ContactFormLabels["projectTypes"],
    budgets: Object.fromEntries(BUDGETS.map((k) => [k, f(`budgets.${k}`)])) as ContactFormLabels["budgets"],
  };

  return (
    <section id="contact" aria-labelledby="contact-h" className="container-page section-pad">
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[clamp(32px,5vw,64px)] overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-surface/45 bg-[radial-gradient(900px_500px_at_0%_0%,color-mix(in_srgb,var(--color-accent-900)_90%,transparent),transparent_70%)] p-[clamp(28px,5vw,64px)] rtl:bg-[radial-gradient(900px_500px_at_100%_0%,color-mix(in_srgb,var(--color-accent-900)_90%,transparent),transparent_70%)]">
        <div className="flex flex-col items-start gap-6">
          <h2 id="contact-h" className="text-display-cta">
            {t("title")}
          </h2>
          <p className="max-w-[44ch] text-base leading-relaxed text-fg-soft">{t("lede")}</p>
          <BookCallButton data-magnetic size="lg">
            <CalendarBlankIcon aria-hidden="true" className="size-4.5" />
            {t("book")}
          </BookCallButton>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="flex items-center gap-2 font-mono-ui text-sm leading-none no-underline"
          >
            <EnvelopeSimpleIcon aria-hidden="true" className="size-4" />
            {siteConfig.links.email}
          </a>
        </div>

        <ContactForm labels={labels} locale={locale} email={siteConfig.links.email} />
      </div>
    </section>
  );
}
