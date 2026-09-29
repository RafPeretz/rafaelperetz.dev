import { defineCollection, defineConfig, s } from "velite";

import { CONTENT_ICONS } from "./src/content-icons";

/**
 * Content collections. Files are organised as `content/<collection>/<slug>/<locale>.md`
 * (or `content/stack/<locale>.yml`). `slug` and `locale` are derived from the path.
 * Output is typed and written to .velite/, imported as `#site/content`.
 */

const LOCALES = ["en", "fr", "he"] as const;
const locale = s.enum(LOCALES);
const icon = s.enum(CONTENT_ICONS);

/** "work/reysecurity/en" → { slug: "reysecurity", locale: "en" } */
function fromPath(path: string) {
  const parts = path.split("/");
  return { slug: parts.at(-2) ?? "", locale: locale.parse(parts.at(-1)) };
}

const work = defineCollection({
  name: "CaseStudy",
  pattern: "work/*/*.md",
  schema: s
    .object({
      path: s.path(),
      title: s.string(),
      /** Kicker above the title, e.g. "Co-founder · Infrastructure lead". */
      role: s.string(),
      /** One-paragraph card summary. */
      summary: s.string(),
      order: s.number(),
      /** Key/value rows in the card's mono box (e.g. stack, focus). */
      card: s.array(s.object({ key: s.string(), value: s.string() })).min(1),
      context: s.string(),
      challenge: s.string(),
      built: s.array(s.string()).min(1),
      stack: s.array(s.string()).min(1),
      outcome: s.string(),
      /** Optional long-form write-up below the structured sections. */
      body: s.markdown().optional(),
    })
    .transform(({ path, ...data }) => ({ ...data, ...fromPath(path) })),
});

const services = defineCollection({
  name: "Service",
  pattern: "services/*/*.md",
  schema: s
    .object({
      path: s.path(),
      kind: s.enum(["package", "retainer"]),
      title: s.string(),
      summary: s.string(),
      icon,
      duration: s.string().optional(),
      features: s.array(s.string()).default([]),
      /** Display price, e.g. "$2,500" or "$1,200/mo". */
      price: s.string(),
      order: s.number(),
    })
    .transform(({ path, ...data }) => ({ ...data, ...fromPath(path) })),
});

const faq = defineCollection({
  name: "Faq",
  pattern: "faq/*/*.md",
  schema: s
    .object({
      path: s.path(),
      question: s.string(),
      order: s.number(),
      answer: s.markdown(),
    })
    .transform(({ path, ...data }) => ({ ...data, ...fromPath(path) })),
});

const testimonials = defineCollection({
  name: "Testimonial",
  pattern: "testimonials/*/*.md",
  schema: s
    .object({
      path: s.path(),
      quote: s.string(),
      name: s.string(),
      role: s.string(),
      company: s.string(),
      order: s.number(),
    })
    .transform(({ path, ...data }) => ({ ...data, ...fromPath(path) })),
});

const stack = defineCollection({
  name: "Stack",
  pattern: "stack/*.yml",
  schema: s
    .object({
      path: s.path(),
      groups: s
        .array(
          s.object({
            label: s.string(),
            items: s.array(s.object({ name: s.string(), icon, hint: s.string() })).min(1),
          }),
        )
        .min(1),
    })
    .transform(({ path, groups }) => ({ groups, locale: locale.parse(path.split("/").at(-1)) })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { work, services, faq, testimonials, stack },
  markdown: { gfm: true },
});
