"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealMask } from "@/components/ui/reveal";
import { SplitText } from "@/components/ui/split-text";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Slow counter-scroll on the portrait.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.12, 1, 1.06],
  );

  return (
    <section
      ref={ref}
      id="about"
      className="container-gutter py-28 md:py-40"
      aria-labelledby="about-title"
    >
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-fg" />
        <p className="eyebrow text-muted">{dict.about.eyebrow}</p>
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Portrait */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-surface"
            >
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
                <Image
                  src={site.portrait}
                  alt={dict.about.portraitAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {dict.about.stats.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 0.08}>
                  <p className="font-display text-3xl sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted">
                    {stat.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <h2 id="about-title" className="display-l">
            <RevealMask>{dict.about.title}</RevealMask>
          </h2>

          <SplitText
            as="p"
            text={dict.about.intro}
            className="mt-8 max-w-2xl text-xl leading-snug sm:text-2xl"
            stagger={0.03}
          />

          <div className="mt-10 max-w-xl space-y-5 text-base leading-relaxed text-muted">
            {dict.about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <ButtonLink href={`/${locale}#contact`}>
              {dict.about.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
