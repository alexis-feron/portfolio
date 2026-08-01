"use client";

import { useLenis } from "lenis/react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";

import type { Dictionary } from "@/i18n/dictionaries/fr";
import { sectionScrollTopFor } from "@/lib/scroll";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.CharGridScene),
  { ssr: false },
);

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The name drifts up and fades as the next section climbs over it.
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      id="hero"
      className="grain relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 pb-8"
    >
      {/* 3D backdrop */}
      <motion.div
        style={{ y: sceneY, scale: sceneScale }}
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        {/* On mobile the orb sits behind the type, so it drops back to a soft
            ambient wash; on desktop it moves aside and gets full presence. */}
        <div className="absolute inset-0 opacity-35 md:left-[40%] md:opacity-100">
          <HeroScene />
        </div>
        {/* Fade the orb into the page instead of cutting it off. */}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/15 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-bg via-transparent to-transparent md:via-bg/10" />
      </motion.div>

      <div className="container-gutter">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="eyebrow text-muted"
        >
          {dict.hero.greeting}
        </motion.p>
      </div>

      <motion.div
        style={{ y: nameY, opacity: nameOpacity }}
        className="container-gutter"
      >
        {/* The name is a graphic element first: the arrow cursor reads better
            over it than an I-beam, but it stays selectable copy. */}
        <h1 className="display-xl cursor-default select-text">
          <span className="line-mask block">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
            >
              {dict.hero.firstName}
            </motion.span>
          </span>
          <span className="line-mask text-gradient block">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.28 }}
            >
              {dict.hero.lastName}
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="mt-8 flex max-w-2xl flex-col gap-3"
        >
          <p className="subtitle text-lg tracking-wide sm:text-xl">
            {dict.hero.role}
          </p>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {dict.hero.tagline}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        className="container-gutter"
      >
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-5 text-sm text-muted">
          <span className="hidden sm:block">{dict.hero.location}</span>

          <button
            type="button"
            onClick={() => {
              const top = sectionScrollTopFor("#about");
              if (top !== null) lenis?.scrollTo(top, { duration: 1.6 });
            }}
            className="group flex items-center gap-2 tracking-[0.2em] uppercase transition-colors duration-500 ease-out-expo hover:text-fg"
          >
            {dict.hero.scrollHint}
            {/* The arrow bobs on its own; hovering freezes that and settles it
                one notch lower, so the whole label reads as one small nudge. */}
            <span
              aria-hidden
              className="inline-block animate-bounce transition-transform duration-500 ease-out-expo group-hover:translate-y-1 group-hover:[animation-play-state:paused]"
            >
              ↓
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
