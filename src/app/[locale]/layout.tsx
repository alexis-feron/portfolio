import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeScript } from "@/components/providers/theme-script";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { defaultLocale, isLocale, locales, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { dirtyline, josefin } from "@/lib/fonts";

/** Next's generated route types hand us a plain string - narrow it at runtime. */
type LayoutParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // Matches the page background in each scheme, so the browser chrome on
  // mobile blends into the site instead of framing it.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbed" },
    { media: "(prefers-color-scheme: dark)", color: "#191919" },
  ],
  colorScheme: "light dark",
};

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
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    // Phone-number autolinking rewrites years and stack versions on iOS.
    formatDetection: { telephone: false, address: false, email: false },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(
          locales.map((value) => [localeTags[value], `/${value}`]),
        ),
        // Without this, a visitor whose language matches neither locale gets
        // no signal about which version to serve.
        "x-default": `/${defaultLocale}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: localeTags[locale],
      alternateLocale: locales
        .filter((value) => value !== locale)
        .map((value) => localeTags[value]),
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
    // Set GOOGLE_SITE_VERIFICATION to claim the property in Search Console.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
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
            <PersonJsonLd locale={locale} dict={dict} />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
