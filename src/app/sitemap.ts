import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { defaultLocale, locales, localeTags } from "@/i18n/config";
import { sitePaths } from "@/lib/routes";

function rank(path: string) {
  if (path === "") return { priority: 1, changeFrequency: "monthly" as const };
  if (path.startsWith("/work/")) {
    return { priority: 0.8, changeFrequency: "yearly" as const };
  }
  if (path === "/privacy") {
    return { priority: 0.3, changeFrequency: "yearly" as const };
  }
  return { priority: 0.7, changeFrequency: "monthly" as const };
}

/**
 * Every page exists once per locale. Each entry declares the full set of
 * translations so Google treats them as one document in several languages
 * rather than as near-duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitePaths().flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((locale) => [localeTags[locale], `${site.url}/${locale}${path}`]),
    );
    languages["x-default"] = `${site.url}/${defaultLocale}${path}`;

    return locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified,
      ...rank(path),
      alternates: { languages },
    }));
  });
}
