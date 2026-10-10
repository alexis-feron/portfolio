"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { GlyphText } from "@/components/three/glyph-text";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type NotFoundViewProps = {
  copy: Record<Locale, Dictionary["notFound"]>;
};

/**
 * `not-found.tsx` never receives the route params, but the URL still carries
 * the locale - so both translations ship and the pathname picks one.
 */
export function NotFoundView({ copy }: NotFoundViewProps) {
  const pathname = usePathname() ?? "/";
  const segment = pathname.split("/")[1];
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = copy[locale];
  const home = `/${locale}`;

  const wordRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <section className="grain relative isolate flex min-h-svh flex-col overflow-hidden pt-28 pb-12 select-none sm:pb-16">
      {/* The field spans the whole section, so a blast can throw glyphs far
          past the word - behind the copy, never over it. */}
      <GlyphText
        text="404"
        targetRef={wordRef}
        onReady={handleReady}
        className="absolute inset-0 -z-10 size-full"
      />

      <div className="flex flex-1 items-center justify-center py-10">
        {/* The DOM word sets the size and position the canvas copies, and is
            what shows before - or without - the script. Once the field is up
            it steps aside. */}
        <span
          ref={wordRef}
          aria-hidden
          className={cn(
            // Near full-bleed on a phone - short of it, since the 4s swash past
            // their box - and held back by the height on desktop. It comes
            // before the leading: tailwind-merge drops a line-height that a
            // later font-size would override.
            "text-[length:min(44vw,40svh)] md:text-[length:min(38vw,46svh)]",
            "text-gradient inline-block font-display leading-[0.86] tracking-[0.03em] transition-opacity duration-700 ease-out-expo",
            ready && "opacity-0",
          )}
        >
          404
        </span>
      </div>

      <div className="container-gutter grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
        <div>
          <h1 className="display-l select-text" style={{ ["--title-vw" as string]: "5vw" }}>
            <span className="sr-only">404 - </span>
            <span className="line-mask block">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
              >
                {t.title}
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted select-text sm:text-lg"
          >
            {t.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.85 }}
        >
          <Magnetic>
            <ButtonLink href={home}>
              <span aria-hidden>←</span>
              {t.cta}
            </ButtonLink>
          </Magnetic>
        </motion.div>
      </div>

    </section>
  );
}
