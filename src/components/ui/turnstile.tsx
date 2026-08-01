"use client";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/providers/theme-provider";

type TurnstileOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  language?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: TurnstileOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * The script is fetched at most once per document, and only once a caller
 * actually needs it - see the observer below.
 */
let loader: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Turnstile script failed to load")),
      { once: true },
    );

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return loader;
}

export type TurnstileProps = {
  siteKey: string;
  /** Fires with a fresh token every time the challenge is solved. */
  onVerify: (token: string) => void;
  /** The token expired or timed out; Turnstile will offer a fresh challenge. */
  onExpire?: () => void;
  /**
   * The challenge cannot be completed here at all - the script was blocked, or
   * Cloudflare rejected the key for this hostname. A contact form that can
   * never be submitted is worse than one guarded by the honeypot alone, so the
   * caller is told to stop requiring a token.
   */
  onUnavailable?: () => void;
  /**
   * Forces the widget to load now. The proximity check below is an
   * optimisation, not a guarantee - `IntersectionObserver` can be throttled or
   * never delivered, and a captcha that fails to appear would leave the form
   * permanently unsubmittable. Callers pass `true` as soon as the visitor
   * touches the form.
   */
  active?: boolean;
  language?: string;
  className?: string;
};

/**
 * Cloudflare Turnstile, rendered explicitly so it can follow the site theme.
 *
 * Loading is deferred until the widget is close to the viewport: the contact
 * form sits at the very bottom of the page and a third-party script has no
 * business competing with the first paint of everything above it.
 */
export function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  onUnavailable,
  active = false,
  language,
  className,
}: TurnstileProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const { theme } = useTheme();

  const needed = active || nearby;

  // Callbacks are read through a ref so a re-render never forces the widget to
  // be torn down and re-rendered (which would drop a solved token).
  const handlers = useRef({ onVerify, onExpire, onUnavailable });
  useEffect(() => {
    handlers.current = { onVerify, onExpire, onUnavailable };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host || needed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [needed]);

  useEffect(() => {
    if (!needed) return;

    let widgetId: string | null = null;
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;

        widgetId = window.turnstile.render(hostRef.current, {
          sitekey: siteKey,
          theme,
          // The fixed 300x65 widget is the one this site key has always been
          // served with; no reason to trade that for a responsive variant.
          size: "normal",
          language,
          callback: (token) => handlers.current.onVerify(token),
          "expired-callback": () => handlers.current.onExpire?.(),
          "timeout-callback": () => handlers.current.onExpire?.(),
          "error-callback": () => {
            handlers.current.onExpire?.();
            handlers.current.onUnavailable?.();
          },
        });
      })
      .catch(() => {
        if (!cancelled) handlers.current.onUnavailable?.();
      });

    return () => {
      cancelled = true;
      if (widgetId !== null) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          /* the widget may already be gone - nothing to clean up */
        }
        // A rebuilt widget starts unsolved, so any token the form is holding
        // no longer matches what Cloudflare would verify.
        handlers.current.onExpire?.();
      }
    };
    // `theme` is a dependency on purpose: Turnstile bakes its palette in at
    // render time, so switching theme has to rebuild the widget.
  }, [needed, siteKey, theme, language]);

  return <div ref={hostRef} className={className} />;
}
