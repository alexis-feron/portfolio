"use client";

import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { sectionScrollTopFor } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type NavbarProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const home = `/${locale}`;
  const isHome = pathname === home;

  const links = [
    { id: "about", label: dict.nav.about },
    { id: "journey", label: dict.nav.journey },
    { id: "work", label: dict.nav.work },
    { id: "contact", label: dict.nav.contact },
  ];

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    setHidden(current > previous && current > 260 && !open);
  });

  // Lock the page while the mobile overlay is open.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  // Escape closes the overlay; every link inside it closes on click.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function goToSection(event: React.MouseEvent, id: string) {
    setOpen(false);
    if (!isHome) return; // let the router handle cross-page navigation
    event.preventDefault();
    const top = sectionScrollTopFor(`#${id}`);
    if (top === null) return;
    lenis?.scrollTo(top, { duration: 1.5 });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "container-gutter flex items-center justify-between py-5 transition-colors duration-500",
            scrolled && !open && "bg-bg/70 backdrop-blur-xl",
          )}
        >
          <Link
            href={home}
            onClick={(event) => {
              setOpen(false);
              if (!isHome) return;
              event.preventDefault();
              lenis?.scrollTo(0, { duration: 1.4 });
            }}
            className="font-display text-2xl leading-none tracking-tight"
          >
            {/* An `aria-label` here would replace the visible "AF" instead of
                extending it, which trips label-content-name-mismatch. */}
            AF
            <span className="sr-only"> - {dict.nav.home}</span>
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label={dict.nav.menu}
          >
            {links.map((link, index) => (
              <Link
                key={link.id}
                href={`${home}#${link.id}`}
                scroll={false}
                onClick={(event) => goToSection(event, link.id)}
                className="group relative text-sm tracking-wide text-muted transition-colors duration-400 hover:text-fg"
              >
                {/* Purely ornamental, so it sits back - but on --muted-soft
                    rather than an opacity, which would have taken it under
                    4.5:1 in both themes. */}
                <span
                  aria-hidden
                  className="mr-1.5 text-[10px] align-super text-muted-soft transition-colors duration-400 group-hover:text-fg"
                >
                  {pad(index + 1)}
                </span>
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-0 bg-fg transition-[width] duration-500 ease-out-expo group-hover:w-full"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher
              locale={locale}
              label={dict.actions.switchLanguage}
              className="hidden sm:flex"
            />
            <ThemeToggle label={dict.actions.toggleTheme} />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              className="grid size-10 place-items-center rounded-full border border-line transition-colors duration-500 hover:border-fg md:hidden"
            >
              <span className="relative block h-3 w-4.5">
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-fg transition-all duration-400 ease-out-expo",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-fg transition-all duration-400 ease-out-expo",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 bg-bg md:hidden"
          >
            <div className="container-gutter flex h-full flex-col justify-center gap-5">
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: 0.15 + index * 0.07,
                  }}
                >
                  <Link
                    href={`${home}#${link.id}`}
                    scroll={false}
                    onClick={(event) => goToSection(event, link.id)}
                    className="display-m flex items-baseline gap-4 leading-none"
                  >
                    <span
                      aria-hidden
                      className="font-sans text-xs font-bold tracking-[0.2em] text-muted"
                    >
                      {pad(index + 1)}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <LocaleSwitcher
                  locale={locale}
                  label={dict.actions.switchLanguage}
                  className="w-fit"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
