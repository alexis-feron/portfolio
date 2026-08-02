"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";

import type { Project } from "@/content/projects";
import { accentVars, projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";

/**
 * Selected work - the cards stack: each one pins to the top of the viewport
 * and the next slides over it while the previous shrinks away.
 */
export function Work({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="work" className="pt-28 md:pt-40" aria-labelledby="work-title">
      <div className="container-gutter">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-fg" />
          <p className="eyebrow text-muted">{dict.work.eyebrow}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-title" className="display-l">
            {dict.work.title}
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {dict.work.description}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative mt-16">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>
    </section>
  );
}

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  locale: Locale;
  dict: Dictionary;
};

function ProjectCard({
  project,
  index,
  total,
  progress,
  locale,
  dict,
}: ProjectCardProps) {
  const content = project.content[locale];

  // Each card shrinks a little more than the one before it, so the stack
  // reads as depth rather than a pile.
  const targetScale = 1 - (total - index) * 0.04;
  const range: [number, number] = [index / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    // Every wrapper is a full-viewport box, so the *next* one covers the card
    // that is currently pinned long before its own card slides into view - and
    // it used to swallow the clicks meant for the visible card's link. The
    // wrappers are hit-test transparent; only the cards themselves take input,
    // which makes the topmost painted card the one you click.
    <div className="pointer-events-none sticky top-0 flex h-svh items-center justify-center px-(--spacing-gutter)">
      <motion.article
        style={{
          scale,
          top: `${index * 22}px`,
          ...accentVars(project.accent),
        }}
        // Cards must stay fully opaque: they physically stack on top of each
        // other. They also share one fixed height at every breakpoint: left to
        // their natural height they follow the text, and a taller card lower in
        // the stack sticks out above *and* below the one covering it. The
        // artwork takes whatever the text leaves, which is why it has no aspect
        // ratio of its own - stacked on mobile, side by side from `lg`.
        className="project-accent pointer-events-auto relative grid h-[min(40rem,86svh)] w-full max-w-6xl grid-rows-[minmax(6rem,1fr)_auto] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] lg:h-[min(31rem,74svh)] lg:grid-cols-2 lg:grid-rows-none"
      >
        {/* Text */}
        <div className="order-2 flex flex-col justify-between gap-8 p-7 sm:p-10 lg:order-1">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow text-muted">
                {dict.work.kinds[project.kind]}
              </span>
              {/* One accent for every year: the per-project colour is reserved
                  for the artwork, so the metadata line stays consistent. */}
              <span className="eyebrow text-accent">{project.year}</span>
            </div>

            <h3
              className="display-m mt-8"
              style={{ "--title-chars": project.title.length } as CSSProperties}
            >
              {project.title}
            </h3>
            <p className="subtitle mt-4 text-base sm:text-lg">
              {content.tagline}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              {content.excerpt}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line px-3 py-1 text-[11px] tracking-wide text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/work/${project.slug}`}
              className="group/link inline-flex w-fit items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase"
            >
              <span className="relative">
                {dict.work.viewProject}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-fg transition-transform duration-500 ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100" />
              </span>
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full border border-line transition-all duration-500 group-hover/link:border-transparent"
                style={{ backgroundColor: "transparent" }}
              >
                <span className="transition-transform duration-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                  ↗
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Visual */}
        <Link
          href={`/${locale}/work/${project.slug}`}
          className="group/media order-1 relative block overflow-hidden lg:order-2"
          aria-hidden
          tabIndex={-1}
        >
          <span
            className="absolute inset-0 opacity-25 transition-opacity duration-700 group-hover/media:opacity-40"
            style={{
              background: `radial-gradient(120% 100% at 70% 20%, var(--project-accent) 0%, transparent 70%)`,
            }}
          />
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover/media:scale-105"
          />
        </Link>
      </motion.article>
    </div>
  );
}
