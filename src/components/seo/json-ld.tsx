import { projects } from "@/content/projects";
import { site, socials } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { localeTags } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";

/**
 * Structured data is the one part of on-page SEO that search engines read
 * literally rather than infer, so it is worth stating plainly: who this is,
 * what the site is, and how the project pages relate to it.
 *
 * Rendered from the server tree only - the payload is static per locale.
 */
function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from local content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const PERSON_ID = `${site.url}/#person`;
const SITE_ID = `${site.url}/#website`;

export function PersonJsonLd({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const home = `${site.url}/${locale}`;

  // Everything the site actually demonstrates, taken from the work itself.
  const skills = [...new Set(projects.flatMap((project) => project.stack))];

  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": PERSON_ID,
          name: site.name,
          givenName: dict.hero.firstName,
          familyName: dict.hero.lastName,
          url: home,
          mainEntityOfPage: home,
          image: `${site.url}${site.portrait}`,
          jobTitle: dict.hero.role,
          description: dict.meta.description,
          email: `mailto:${site.email}`,
          knowsAbout: skills,
          address: {
            "@type": "PostalAddress",
            addressLocality: site.location.city,
            addressCountry: "FR",
          },
          sameAs: socials.map((social) => social.url),
        }}
      />
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": SITE_ID,
          url: home,
          name: `${site.name} - ${dict.hero.role}`,
          description: dict.meta.description,
          inLanguage: localeTags[locale],
          author: { "@id": PERSON_ID },
          publisher: { "@id": PERSON_ID },
        }}
      />
    </>
  );
}

export function ProjectJsonLd({
  locale,
  dict,
  slug,
  title,
  description,
  cover,
  year,
  stack,
  url,
}: {
  locale: Locale;
  dict: Dictionary;
  slug: string;
  title: string;
  description: string;
  cover: string;
  year: string;
  stack: string[];
  url: string;
}) {
  const home = `${site.url}/${locale}`;
  const page = `${home}/work/${slug}`;

  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${page}#project`,
          name: title,
          headline: title,
          description,
          url: page,
          sameAs: url,
          image: `${site.url}${cover}`,
          dateCreated: year,
          inLanguage: localeTags[locale],
          keywords: stack.join(", "),
          author: { "@id": PERSON_ID },
          creator: { "@id": PERSON_ID },
          isPartOf: { "@id": SITE_ID },
        }}
      />
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: dict.nav.home,
              item: home,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: dict.nav.work,
              item: `${home}#work`,
            },
            { "@type": "ListItem", position: 3, name: title, item: page },
          ],
        }}
      />
    </>
  );
}
