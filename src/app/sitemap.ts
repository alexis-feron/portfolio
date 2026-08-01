import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { defaultLocale, locales, localeTags } from "@/i18n/config";

/**
 * Every page exists once per locale. Each entry declares the full set of
 * translations so Google treats them as one document in several languages
 * rather than as near-duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    })),
  ];

  return routes.flatMap(({ path, priority, changeFrequency }) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((locale) => [localeTags[locale], `${site.url}/${locale}${path}`]),
    );
    languages["x-default"] = `${site.url}/${defaultLocale}${path}`;

    return locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
