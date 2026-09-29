import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page section-pad pb-12">
      <div
        dir="ltr"
        className="max-w-xl rounded-lg border border-divider bg-surface/70 p-5 font-mono-ui text-[12.5px] leading-[1.45]"
      >
        <p className="text-fg-faint">$ curl -I {t("path")}</p>
        <p className="mt-1.75 text-fg-soft">HTTP/2 404</p>
        <p className="mt-1.75 font-medium text-accent-text">✗ {t("status")}</p>
      </div>
      <h1 className="mt-10 max-w-[18ch] text-h2">{t("title")}</h1>
      <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-fg-muted">{t("body")}</p>
      <ButtonLink href="/" variant="primary" size="md" className="mt-8">
        {t("home")}
      </ButtonLink>
    </div>
  );
}
