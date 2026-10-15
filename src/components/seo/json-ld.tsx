import { experiences } from "@/content/experience";
import { site, socials } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { localeTags } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { getSkills } from "@/lib/skills";

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
  const skills = getSkills();
  const city = { "@type": "City", name: site.location.city };

  // The journey already says where Alexis works and studies - state it in the
  // vocabulary search engines and assistants match people on.
  const current = experiences.filter((experience) => experience.end === null);
  const organisation = (type: string, name: string) => ({ "@type": type, name });
  const worksFor = current
    .filter((experience) => experience.kind === "work")
    .map((experience) => organisation("Organization", experience.organisation));
  const affiliation = current
    .filter((experience) => experience.kind === "education")
    .map((experience) =>
      organisation("EducationalOrganization", experience.organisation),
    );
  const alumniOf = experiences
    .filter((experience) => experience.kind === "education" && experience.end)
    .map((experience) =>
      organisation("CollegeOrUniversity", experience.organisation),
    );

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
          knowsLanguage: ["fr", "en"],
          worksFor,
          affiliation,
          alumniOf,
          hasOccupation: {
            "@type": "Occupation",
            name: dict.hero.role,
            occupationLocation: city,
            skills: skills.join(", "),
          },
          homeLocation: city,
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

/**
 * Marks the about page as the profile of the person described site-wide, the
 * shape Google documents for "about me" pages.
 */
export function ProfilePageJsonLd({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const page = `${site.url}/${locale}/about`;

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${page}#profile`,
        url: page,
        name: dict.pages.about.heading,
        description: dict.pages.about.description,
        inLanguage: localeTags[locale],
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": SITE_ID },
      }}
    />
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
  url?: string;
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
