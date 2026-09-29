import { setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Phase 2 replaces this with the homepage sections.
  return (
    <div className="container-page min-h-[60vh] section-pad">
      <p className="font-mono-ui text-xs tracking-[0.08em] text-accent-text uppercase">phase 1 · shell</p>
      <h1 className="mt-4 max-w-[16ch] text-display">Layout, tokens, nav, footer and theme.</h1>
      {["services", "work", "about", "stack", "contact"].map((id) => (
        <section key={id} id={id} className="mt-24 border-t border-divider pt-6">
          <p className="font-mono-ui text-xs text-fg-subtle">#{id}</p>
        </section>
      ))}
    </div>
  );
}
