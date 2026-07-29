import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeScript } from "@/components/providers/theme-script";
import { site } from "@/content/site";
import { isLocale, locales, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { dirtyline, josefin } from "@/lib/fonts";

/** Next's generated route types hand us a plain string - narrow it at runtime. */
type LayoutParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.title,
      template: `%s - ${site.name}`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords.split(", "),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((value) => [localeTags[value], `/${value}`]),
      ),
    },
    openGraph: {
      type: "website",
      locale: localeTags[locale],
      url: `${site.url}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      creator: "@alexis_feron_",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutParams & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={`${josefin.variable} ${dirtyline.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-fg focus:px-5 focus:py-2 focus:text-bg"
            >
              {dict.nav.home}
            </a>
            <Navbar locale={locale} dict={dict} />
            <main id="main">{children}</main>
            <Footer locale={locale} dict={dict} />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
