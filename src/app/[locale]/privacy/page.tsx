import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { Reveal, RevealMask } from "@/components/ui/reveal";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { alternatesFor } from "@/lib/seo";
import { pad } from "@/lib/utils";

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { title: "404" };

  const dict = await getDictionary(locale);

  return {
    title: dict.privacy.title,
    description: dict.privacy.description,
    alternates: alternatesFor(locale, "/privacy"),
  };
}

/** Laid out like a project page: big title, then numbered sections. */
export default async function PrivacyPage({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { privacy } = dict;

  return (
    <article className="container-gutter pt-32 pb-28 md:pb-40">
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-fg" />
        <p className="eyebrow text-muted">{privacy.eyebrow}</p>
      </div>

      <h1
        className="display-xl mt-10"
        style={{ "--title-chars": privacy.title.length } as CSSProperties}
      >
        <RevealMask>{privacy.title}</RevealMask>
      </h1>

      <div className="mt-24 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-muted lg:sticky lg:top-28">
            {privacy.updated}
          </p>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <p className="text-lg leading-relaxed">{privacy.intro}</p>
          </Reveal>

          <ol className="mt-16 flex flex-col">
            {privacy.sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.05}>
                <li className="grid gap-4 border-t border-line py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="font-display text-3xl text-muted">
                    {pad(index + 1)}
                  </span>
                  <div>
                    <h2 className="subtitle text-lg normal-case">
                      {section.title}
                    </h2>
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-3 max-w-2xl leading-relaxed text-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
