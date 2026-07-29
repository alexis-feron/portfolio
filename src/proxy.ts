import { NextResponse, type NextRequest } from "next/server";

import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";

/**
 * Picks a locale from the cookie first (explicit user choice), then from the
 * Accept-Language header, then falls back to the default locale.
 */
function resolveLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { tag } of preferred) {
      if (isLocale(tag)) return tag;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = new URL(
    `/${locale}${pathname === "/" ? "" : pathname}`,
    request.url,
  );
  url.search = request.nextUrl.search;

  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, static assets and anything with a file extension.
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
