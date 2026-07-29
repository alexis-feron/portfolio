"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { sectionScrollTop } from "@/lib/scroll";

/** How long we keep re-resolving an anchor while the page settles. */
const ANCHOR_SETTLE_MS = 700;

/**
 * Lenis owns the scroll position, so Next's own restoration never applies.
 * This component is the single place that decides where a new route starts:
 *
 * - no hash → jump to the top;
 * - a hash  → keep re-resolving the anchor while the layout is still moving.
 *   The pinned journey section measures its own height on mount and fonts swap
 *   in late, both of which shift everything below them.
 *
 * `lenis.resize()` on every attempt is what makes this work: Lenis caches the
 * scrollable limit, and right after a route change that cache still describes
 * the *previous* page - it would silently clamp the target to the old height.
 *
 * Cross-page links carrying a hash pass `scroll={false}` so Next doesn't race
 * this with its own (too early) scroll.
 */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;

    if (!hash) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }

    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;

    let frame = 0;
    let lastTop = -1;
    let stopped = false;
    const start = performance.now();

    // Any real user input wins over the correction loop.
    const stop = () => {
      stopped = true;
    };

    const step = () => {
      if (stopped) return;

      lenis.resize();
      const top = sectionScrollTop(target);

      if (Math.abs(top - lastTop) > 1) {
        lastTop = top;
        lenis.scrollTo(top, { immediate: true, force: true });
      }

      if (performance.now() - start < ANCHOR_SETTLE_MS) {
        frame = requestAnimationFrame(step);
      }
    };

    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    frame = requestAnimationFrame(step);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
  }, [pathname, lenis]);

  return null;
}

/**
 * Lenis drives the page scroll - every scroll-linked animation on the site
 * reads from it, which is what makes the parallax feel cohesive.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
