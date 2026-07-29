"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

import { site, socials } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { localeTags } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";

function BackToTop({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-400 hover:text-fg",
        className,
      )}
    >
      <span className="inline-block transition-transform duration-400 group-hover:-translate-y-1">
        ↑
      </span>
      {label}
    </button>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const lenis = useLenis();
  // Rendered client-side only: the server has no idea what time it is for the
  // visitor, and pre-rendering a stale clock would mismatch on hydration.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const frame = requestAnimationFrame(tick);
    const interval = setInterval(tick, 30_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);

  const time = now
    ? new Intl.DateTimeFormat(localeTags[locale], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: site.location.timezone,
      }).format(now)
    : "";

  const backToTop = () => lenis?.scrollTo(0, { duration: 1.6 });

  return (
    <footer className="container-gutter pb-8">
      {/* On mobile the action sits on its own band between the contact section
          and the footer, where it is reachable; on desktop it lives in the
          footer's right-hand column. */}
      <BackToTop
        label={dict.actions.backToTop}
        onClick={backToTop}
        className="w-full justify-center border-y border-line py-5 md:hidden"
      />

      <div className="pt-12 md:border-t md:border-line md:pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-4xl leading-none uppercase">
              {site.name}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-400 hover:text-fg"
                  >
                    {social.label}
                    <span className="inline-block transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6">
            <BackToTop
              label={dict.actions.backToTop}
              onClick={backToTop}
              className="hidden md:inline-flex"
            />
            <p className="text-sm text-muted">
              <span className="eyebrow mr-2">{dict.footer.localTime}</span>
              <span suppressHydrationWarning>{time || "-"}</span>
            </p>
          </div>
        </div>

        <p className="mt-14 border-t border-line pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} {site.name} - {dict.footer.rights} -{" "}
          {dict.footer.builtWith}
        </p>
      </div>
    </footer>
  );
}
