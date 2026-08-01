import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} - ${site.role}`;

/** Without this the card is rendered on demand instead of baked at build. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Social card, generated at build time for each locale.
 *
 * Deliberately typeset in the default face rather than Dirtyline: the display
 * font is uppercase-only, and a card that has to carry a sentence of body copy
 * would fall back mid-word. The brand comes through in the palette instead.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? locale : defaultLocale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#191919",
          color: "#fdfbed",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Brand wash, echoing the gradient used on the site's headings. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 80% at 88% 12%, rgba(234,156,67,0.30) 0%, rgba(25,25,25,0) 70%), radial-gradient(70% 90% at 8% 96%, rgba(26,50,99,0.55) 0%, rgba(25,25,25,0) 72%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#90a5cf",
            }}
          >
            {dict.hero.greeting}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {dict.hero.firstName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
              textTransform: "uppercase",
              color: "#ea9c43",
            }}
          >
            {dict.hero.lastName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 120,
              height: 4,
              background: "#ea9c43",
              marginBottom: 28,
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{dict.hero.role}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
              fontSize: 26,
              color: "rgba(253,251,237,0.7)",
            }}
          >
            <span>{dict.hero.location}</span>
            <span>{site.url.replace("https://", "")}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
