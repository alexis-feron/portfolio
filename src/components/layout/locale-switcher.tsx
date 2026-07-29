"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Swaps the leading locale segment while keeping the rest of the path. */
function withLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/") || `/${locale}`;
}

/** Remember the choice so the proxy honours it on the next visit. */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

/**
 * Switching language is a client-side navigation: the RSC payload for the new
 * locale streams in and the page swaps without a reload.
 *
 * The selected pill is a single element shared across the buttons via
 * `layoutId`, so it slides between them. It follows an optimistic value rather
 * than the committed route, otherwise it would sit still until the server
 * responded and the motion would read as lag.
 *
 * Real `<a href>` elements underneath keep the control crawlable and
 * middle-click/ctrl-click friendly.
 */
export function LocaleSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selected, setSelected] = useOptimistic(locale);

  function select(event: React.MouseEvent, next: Locale) {
    // Let the browser handle modified clicks (new tab, download…).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;

    event.preventDefault();
    if (next === locale) return;

    rememberLocale(next);
    startTransition(() => {
      setSelected(next);
      router.push(withLocale(pathname, next));
    });
  }

  return (
    <div
      className={cn(
        "relative flex h-10 items-center rounded-full border border-line p-1 text-[11px] font-bold tracking-[0.14em] uppercase",
        className,
      )}
      role="group"
      aria-label={label}
    >
      {locales.map((value) => {
        const isSelected = value === selected;

        return (
          <a
            key={value}
            href={withLocale(pathname, value)}
            hrefLang={value}
            onClick={(event) => select(event, value)}
            aria-current={value === locale ? "true" : undefined}
            className={cn(
              "relative grid h-full place-items-center rounded-full px-2.5 transition-colors duration-300",
              isSelected ? "text-bg" : "text-muted hover:text-fg",
            )}
          >
            {isSelected && (
              <motion.span
                layoutId="locale-pill"
                aria-hidden
                className="absolute inset-0 rounded-full bg-fg"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 34,
                  mass: 0.7,
                }}
              />
            )}
            {/*
              Centring uses the line box, but Josefin Sans reserves ~3px of
              descent that capitals never occupy, so the label reads high; and
              letter-spacing adds a trailing gap after the last letter, so it
              reads left. Both are compensated here.
            */}
            <span className="relative z-10 inline-block translate-y-[1.5px] mr-[-0.14em]">
              {value}
            </span>
          </a>
        );
      })}
    </div>
  );
}
