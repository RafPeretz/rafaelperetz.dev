import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { resolveLocale } from "@/i18n/server";
import { getServices, getTestimonials } from "@/lib/content";
import { homeJsonLd, jsonLdScript } from "@/lib/jsonld";
import { alternates } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { alternates: alternates(locale, "/") };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);

  const testimonials = siteConfig.features.testimonials ? getTestimonials(locale) : [];

  // Numbered sections ("01 — Services" …) are counted from what's actually shown,
  // so hiding testimonials doesn't leave a gap in the sequence.
  const numbered = ["services", "work", "process", "about", "stack", "testimonials", "faq"].filter(
    (s) => s !== "testimonials" || testimonials.length > 0,
  );
  const n = (id: string) => numbered.indexOf(id) + 1;

  const meta = await getTranslations("meta");
  const jsonLd = homeJsonLd(locale, {
    description: meta("description"),
    services: getServices(locale).map((s) => s.title),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <Hero />
      <Experience />
      <Stats />
      <Services locale={locale} index={n("services")} />
      <Work locale={locale} index={n("work")} />
      <Process index={n("process")} />
      <About index={n("about")} />
      <Stack locale={locale} index={n("stack")} />
      {testimonials.length > 0 ? <Testimonials items={testimonials} index={n("testimonials")} /> : null}
      <Faq locale={locale} index={n("faq")} />
      <Contact locale={locale} />
    </>
  );
}
