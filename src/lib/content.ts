import "server-only";

import {
  faq as allFaq,
  services as allServices,
  stack as allStack,
  testimonials as allTestimonials,
  work as allWork,
  type CaseStudy,
  type Faq,
  type Service,
  type Stack,
  type Testimonial,
} from "#site/content";

import { routing } from "@/i18n/routing";

type Localized = { slug: string; locale: string };

/**
 * One entry per slug in the requested locale, falling back to the default locale
 * when a translation file doesn't exist yet. Sorted by `order`.
 */
function localized<T extends Localized & { order: number }>(items: readonly T[], locale: string): T[] {
  const bySlug = new Map<string, T>();
  for (const item of items) {
    if (item.locale === routing.defaultLocale && !bySlug.has(item.slug)) bySlug.set(item.slug, item);
  }
  for (const item of items) {
    if (item.locale === locale) bySlug.set(item.slug, item);
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order);
}

export const getCaseStudies = (locale: string): CaseStudy[] => localized(allWork, locale);
export const getCaseStudy = (locale: string, slug: string): CaseStudy | undefined =>
  getCaseStudies(locale).find((c) => c.slug === slug);
export const getCaseStudySlugs = (): string[] => [...new Set(allWork.map((c) => c.slug))];

export const getServices = (locale: string): Service[] => localized(allServices, locale);
export const getFaqs = (locale: string): Faq[] => localized(allFaq, locale);
export const getTestimonials = (locale: string): Testimonial[] => localized(allTestimonials, locale);

export const getStack = (locale: string): Stack["groups"] => {
  const entry =
    allStack.find((s) => s.locale === locale) ?? allStack.find((s) => s.locale === routing.defaultLocale);
  if (!entry) throw new Error("Missing content/stack/en.yml");
  return entry.groups;
};
