import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Contact } from "@/components/sections/contact";
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
  const { title, description } = dict.pages.contact;

  return {
    title,
    description,
    alternates: alternatesFor(locale, "/contact"),
    openGraph: {
      type: "website",
      locale: localeTags[locale],
      url: `/${locale}/contact`,
      title: `${title} - ${dict.hero.firstName} ${dict.hero.lastName}`,
      description,
    },
  };
}

/** The home page's contact section, on a URL of its own. */
export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <h1 className="sr-only">{dict.pages.contact.heading}</h1>
      <Contact locale={locale} dict={dict} />
    </>
  );
}
