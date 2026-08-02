import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ProjectCover } from "@/components/sections/project-cover";
import { ProjectJsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealMask } from "@/components/ui/reveal";
import { SplitText } from "@/components/ui/split-text";
import {
  accentVars,
  getNextProject,
  getProject,
  projects,
  projectUrl,
} from "@/content/projects";
import { defaultLocale, isLocale, locales, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pad } from "@/lib/utils";

type PageParams = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project || !isLocale(locale)) return {};

  const content = project.content[locale];
  const path = `/work/${project.slug}`;

  return {
    title: project.title,
    description: content.excerpt,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...Object.fromEntries(
          locales.map((value) => [localeTags[value], `/${value}${path}`]),
        ),
        "x-default": `/${defaultLocale}${path}`,
      },
    },
    openGraph: {
      type: "article",
      locale: localeTags[locale],
      url: `/${locale}${path}`,
      title: project.title,
      description: content.excerpt,
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: content.excerpt,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: PageParams) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProject(slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const content = project.content[locale];
  const url = projectUrl(project.url, locale);
  const next = getNextProject(slug);

  return (
    <article
      className="project-accent pt-32 pb-0"
      style={accentVars(project.accent)}
    >
      <ProjectJsonLd
        locale={locale}
        dict={dict}
        slug={project.slug}
        title={project.title}
        description={content.excerpt}
        cover={project.cover}
        year={project.year}
        stack={project.stack}
        url={url}
      />

      {/* Header */}
      <header className="container-gutter">
        <Link
          href={`/${locale}#work`}
          scroll={false}
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-400 hover:text-fg"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-400 group-hover:-translate-x-1"
          >
            ←
          </span>
          {dict.project.back}
        </Link>

        <h1
          className="display-xl mt-10"
          style={{ "--title-chars": project.title.length } as CSSProperties}
        >
          <RevealMask>{project.title}</RevealMask>
        </h1>

        <SplitText
          as="p"
          text={content.tagline}
          className="mt-6 max-w-3xl text-xl leading-snug sm:text-2xl"
          stagger={0.03}
        />

        <dl className="mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label={dict.project.role} value={content.role} />
          <Meta label={dict.project.year} value={project.year} />
          <div>
            <dt className="eyebrow text-muted">{dict.project.stack}</dt>
            <dd className="mt-3">
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
            </dd>
          </div>
          <div className="flex items-start">
            <ButtonLink href={url} external variant="outline">
              {dict.project.visit}
              <span aria-hidden>↗</span>
            </ButtonLink>
          </div>
        </dl>
      </header>

      {/* Cover */}
      <div className="container-gutter mt-16">
        <ProjectCover
          src={project.cover}
          alt={project.coverAlt}
          accent={project.accent}
        />
      </div>

      {/* Body */}
      <div className="container-gutter mt-24 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <h2 className="display-m sticky top-28">{dict.project.overview}</h2>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <h3 className="eyebrow text-muted">{dict.project.context}</h3>
            <p className="mt-4 text-lg leading-relaxed">{content.context}</p>
          </Reveal>

          <div className="mt-20">
            <Reveal>
              <h3 className="eyebrow text-muted">{dict.project.challenges}</h3>
            </Reveal>

            <ol className="mt-8 flex flex-col">
              {content.challenges.map((challenge, index) => (
                <Reveal key={challenge.title} delay={index * 0.05}>
                  <li className="grid gap-4 border-t border-line py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                    <span
                      className="font-display text-3xl"
                      style={{ color: "var(--project-accent)" }}
                    >
                      {pad(index + 1)}
                    </span>
                    <div>
                      <h4 className="subtitle text-lg normal-case">
                        {challenge.title}
                      </h4>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                        {challenge.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="mt-16 border-t border-line pt-8">
            <h3 className="eyebrow text-muted">{dict.project.outcome}</h3>
            <p className="mt-4 text-lg leading-relaxed">{content.outcome}</p>
          </Reveal>

          <Reveal className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={url} external>
              {dict.project.visit}
              <span aria-hidden>↗</span>
            </ButtonLink>
            {project.repo && (
              <ButtonLink href={project.repo} external variant="outline">
                {dict.project.source}
              </ButtonLink>
            )}
          </Reveal>
        </div>
      </div>

      {/* Next project */}
      <section className="mt-32 border-t border-line">
        <Link
          href={`/${locale}/work/${next.slug}`}
          className="group container-gutter block py-20 transition-colors duration-700"
        >
          <p className="eyebrow text-muted">{dict.project.next}</p>
          {/* No `flex-wrap`: once the title wrapped, the arrow dropped onto a
              line of its own where `justify-between` left it hard against the
              left edge. Kept on the same row it stays at the right margin, and
              `items-end` puts it beside the last line rather than the first -
              baseline alignment always resolves against a block's first line. */}
          <div className="mt-6 flex items-end justify-between gap-6 sm:items-baseline">
            <h2
              className="display-l transition-transform duration-700 ease-out-expo group-hover:translate-x-4"
              style={
                {
                  "--title-chars": next.title.length,
                  // Stays under the page's own h1, whatever the two lengths.
                  "--title-vw": "6.5vw",
                } as CSSProperties
              }
            >
              {next.title}
            </h2>
            <span
              aria-hidden
              className="shrink-0 text-4xl transition-transform duration-700 ease-out-expo group-hover:translate-x-4"
            >
              →
            </span>
          </div>
        </Link>
      </section>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-3 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}
