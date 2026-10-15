import { NextResponse, type NextRequest } from "next/server";

import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { renderMarkdown } from "@/lib/agents/markdown";
import { MEDIA_TYPES, negotiate } from "@/lib/agents/negotiate";

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

/**
 * The same URL answers in HTML or in Markdown depending on `Accept`, so every
 * page response has to say so - otherwise a cache could hand the Markdown to
 * a browser. Paths without a locale also depend on the language headers.
 */
const VARY_PAGE = "Accept";
const VARY_UNLOCALISED = "Accept, Accept-Language, Cookie";

/**
 * Requests the Next router makes for itself (RSC payloads, prefetches) carry
 * their own `Accept` and must reach the app untouched.
 */
function isRouterRequest(request: NextRequest) {
  return (
    request.headers.has("rsc") || request.headers.has("next-router-prefetch")
  );
}

function markdownResponse(request: NextRequest, vary: string) {
  const page = renderMarkdown(request.nextUrl.pathname, resolveLocale(request));

  return new NextResponse(page.body, {
    status: page.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: vary,
      Link: `<${page.canonical}>; rel="canonical"`,
    },
  });
}

function notAcceptable(vary: string) {
  return new NextResponse(
    `406 Not Acceptable. This page is available as ${MEDIA_TYPES.html} or ${MEDIA_TYPES.markdown}.\n`,
    {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8", Vary: vary },
    },
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  const vary = hasLocale ? VARY_PAGE : VARY_UNLOCALISED;

  const negotiable =
    (request.method === "GET" || request.method === "HEAD") &&
    !isRouterRequest(request);

  if (negotiable) {
    const representation = negotiate(request.headers.get("accept"));
    if (representation === null) return notAcceptable(vary);
    // Answered here rather than redirected first: an agent gets the page it
    // asked for in one round trip, whether or not it follows redirects.
    if (representation === "markdown") return markdownResponse(request, vary);
  }

  if (hasLocale) {
    const response = NextResponse.next();
    // `next start` serves prerendered pages with its own Vary and drops this
    // one. Harmless if it is lost: the proxy runs before any cached page, so
    // a browser is never handed the Markdown.
    response.headers.set("Vary", vary);
    return response;
  }

  const locale = resolveLocale(request);
  const url = new URL(
    `/${locale}${pathname === "/" ? "" : pathname}`,
    request.url,
  );
  url.search = request.nextUrl.search;

  const response = NextResponse.redirect(url);
  response.headers.set("Vary", vary);
  return response;
}

export const config = {
  // Skip Next internals, static assets and anything with a file extension.
  // `_vercel` carries the Analytics and Speed Insights beacons: redirected to
  // a locale, they would land on a 404 and the data would never arrive.
  matcher: ["/((?!_next|_vercel|api|.*\\.).*)"],
};
