import type { Metadata } from "next";

import { defaultLocale, locales, localeTags, type Locale } from "@/i18n/config";

/**
 * Canonical and hreflang set for a page that exists in every locale. Every
 * page has to declare its own: the layout's would otherwise point all of them
 * at the home page.
 */
export function alternatesFor(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        locales.map((value) => [localeTags[value], `/${value}${path}`]),
      ),
      // Without this, a visitor whose language matches neither locale gets
      // no signal about which version to serve.
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}
