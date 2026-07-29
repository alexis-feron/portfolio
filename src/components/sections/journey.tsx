"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { experiences } from "@/content/experience";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { cn } from "@/lib/utils";

/**
 * Pinned section: vertical scrolling is translated into a horizontal run
 * through the timeline. The travel distance is measured from the real track
 * width so it stays exact at any viewport size.
 */
export function Journey({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative"
      style={{ height: `calc(100svh + ${distance}px)` }}
      aria-labelledby="journey-title"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden pt-24 pb-10">
        <div className="container-gutter shrink-0">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-fg" />
            <p className="eyebrow text-muted">{dict.journey.eyebrow}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <h2 id="journey-title" className="display-m max-w-xl">
              {dict.journey.title}
            </h2>
            <p className="max-w-sm text-sm text-muted">
              {dict.journey.description}
            </p>
          </div>
        </div>

        {/* Cards size themselves to their content and `items-stretch` matches
            them to the tallest one, so nothing is ever cropped. */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max shrink-0 items-stretch gap-6 pr-gutter pl-gutter"
        >
          {experiences.map((experience) => {
            const content = experience.content[locale];
            const isCurrent = experience.end === null;

            return (
              <article
                key={experience.id}
                className={cn(
                  "group relative flex w-[80vw] max-w-[24rem] flex-col justify-between rounded-lg border border-line p-6 transition-colors duration-500 hover:border-fg sm:w-92",
                  isCurrent && "border-highlight/50",
                )}
              >
                <div>
                  <p className="eyebrow text-[10px] text-muted">
                    {dict.journey.kinds[experience.kind]}
                  </p>

                  <h3 className="mt-5 font-sans text-lg leading-snug font-bold normal-case">
                    {content.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {experience.organisation} - {experience.location}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {content.description}
                  </p>
                </div>

                <div className="mt-6">
                  <ul className="flex flex-wrap gap-1.5">
                    {experience.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-surface px-2.5 py-1 text-[11px] tracking-wide text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p
                    className={cn(
                      "mt-4 border-t border-line pt-4 text-xs tracking-[0.14em] uppercase",
                      isCurrent && "text-highlight",
                    )}
                  >
                    {content.period}
                  </p>
                </div>
              </article>
            );
          })}
        </motion.div>

        <div className="container-gutter shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-line">
              <motion.div style={{ width: progress }} className="h-px bg-fg" />
            </div>
            <span className="eyebrow text-muted">
              {dict.journey.scrollHint}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
