import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { ProfilePageJsonLd } from "@/components/seo/json-ld";
import { isLocale, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { alternatesFor } from "@/lib/seo";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { title: "404" };

  const dict = await getDictionary(locale);
  const { title, description } = dict.pages.about;

  return {
    title,
    description,
    alternates: alternatesFor(locale, "/about"),
    openGraph: {
      type: "profile",
      locale: localeTags[locale],
      url: `/${locale}/about`,
      title: `${title} - ${dict.hero.firstName} ${dict.hero.lastName}`,
      description,
    },
  };
}

/**
 * The same About and Journey sections as the home page, on a URL of their own:
 * `/about` is where people - and the agents vetting a site - look first.
 */
export default async function AboutPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      {/* The sections open on their own eyebrow and h2, so the page heading
          only needs to exist for the outline, not on screen. */}
      <h1 className="sr-only">{dict.pages.about.heading}</h1>
      <About locale={locale} dict={dict} />
      <Journey locale={locale} dict={dict} />
      <ProfilePageJsonLd locale={locale} dict={dict} />
    </>
  );
}
