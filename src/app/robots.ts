import type { MetadataRoute } from "next";

import { indexable } from "@/lib/seo";
import { siteConfig } from "@/site.config";

/** Production is crawlable; preview/branch deployments are not. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
