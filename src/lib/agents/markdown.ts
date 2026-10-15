import { experiences } from "@/content/experience";
import { getProject, getNextProject, projects, projectUrl } from "@/content/projects";
import { site, socials } from "@/content/site";
import { isLocale, locales, localeNames, type Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { fr, type Dictionary } from "@/i18n/dictionaries/fr";
import { projectPath } from "@/lib/routes";
import { getSkills } from "@/lib/skills";

/**
 * The Markdown representation of every page, served to agents that send
 * `Accept: text/markdown`. Built from the same content and dictionaries as the
 * HTML, so the two never disagree - only the presentation differs.
 */

/** Synchronous on purpose: the proxy renders these without awaiting imports. */
const dictionaries: Record<Locale, Dictionary> = { fr, en };

/**
 * Wording that only exists in the Markdown output - the HTML conveys these
 * through layout and icons, so they have no place in the UI dictionaries.
 */
const labels: Record<
  Locale,
  {
    skills: string;
    location: string;
    email: string;
    form: string;
    socials: string;
    otherLanguage: string;
    sitemap: string;
    missingPath: string;
    nextProject: string;
    pages: string;
  }
> = {
  fr: {
    skills: "Compétences",
    location: "Localisation",
    email: "Email",
    form: "Formulaire de contact",
    socials: "Réseaux",
    otherLanguage: "Version anglaise",
    sitemap: "Plan du site",
    missingPath: "Aucune page ne correspond à",
    nextProject: "Projet suivant",
    pages: "Pages du site",
  },
  en: {
    skills: "Skills",
    location: "Location",
    email: "Email",
    form: "Contact form",
    socials: "Socials",
    otherLanguage: "French version",
    sitemap: "Sitemap",
    missingPath: "No page matches",
    nextProject: "Next project",
    pages: "Site pages",
  },
};

export type MarkdownPage = {
  status: 200 | 404;
  body: string;
  /** Absolute URL of the HTML page this Markdown represents. */
  canonical: string;
};

function url(locale: Locale, path = "") {
  return `${site.url}/${locale}${path}`;
}

function otherLocale(locale: Locale): Locale {
  return locales.find((value) => value !== locale) ?? locale;
}

function join(blocks: (string | false | undefined)[]) {
  return `${blocks.filter(Boolean).join("\n\n").trim()}\n`;
}

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

/** Shared tail: how to reach Alexis, and where else to read. */
function footer(locale: Locale, path: string) {
  const dict = dictionaries[locale];
  const t = labels[locale];
  const other = otherLocale(locale);

  return join([
    "---",
    list([
      `${t.email}: <${site.email}>`,
      `${t.form}: <${url(locale, "/contact")}>`,
      `${t.socials}: ${socials.map((social) => `[${social.label}](${social.url})`).join(", ")}`,
      `${t.otherLanguage} (${localeNames[other]}): <${url(other, path)}>`,
      `${t.sitemap}: <${site.url}/sitemap.xml> · llms.txt: <${site.url}/llms.txt>`,
      `${dict.footer.privacy}: <${url(locale, "/privacy")}>`,
    ]),
  ]);
}

function aboutBlock(dict: Dictionary) {
  return join([
    dict.about.intro,
    ...dict.about.paragraphs,
    list(dict.about.stats.map((stat) => `${stat.value} ${stat.label.toLowerCase()}`)),
  ]);
}

function journeyBlock(locale: Locale, dict: Dictionary, level: string) {
  return join(
    experiences.map((experience) => {
      const content = experience.content[locale];
      return join([
        `${level} ${content.title} - ${experience.organisation}`,
        `${dict.journey.kinds[experience.kind]} · ${content.period} · ${experience.location}`,
        content.description,
        `${dict.project.stack}: ${experience.tags.join(", ")}`,
      ]);
    }),
  );
}

function workBlock(locale: Locale, dict: Dictionary, level: string) {
  return join(
    projects.map((project) => {
      const content = project.content[locale];
      const live = project.url && projectUrl(project.url, locale);
      return join([
        `${level} [${project.title}](${url(locale, projectPath(project.slug))})`,
        `${dict.work.kinds[project.kind]} · ${project.year}`,
        `${content.tagline} ${content.excerpt}`,
        list(
          [
            `${dict.project.stack}: ${project.stack.join(", ")}`,
            live && `${dict.project.visit}: <${live}>`,
            project.repo && `${dict.project.source}: <${project.repo}>`,
          ].filter((item): item is string => !!item),
        ),
      ]);
    }),
  );
}

function contactBlock(locale: Locale, dict: Dictionary) {
  const t = labels[locale];
  return join([
    dict.contact.description,
    list([
      `${t.email}: <${site.email}>`,
      `${t.form}: <${url(locale, "/contact")}>`,
      `${t.location}: ${dict.hero.location} (${site.location.timezone})`,
      ...socials.map((social) => `${social.label}: [${social.handle}](${social.url})`),
    ]),
  ]);
}

function home(locale: Locale): string {
  const dict = dictionaries[locale];
  const t = labels[locale];

  return join([
    `# ${site.name} - ${dict.hero.role}`,
    `> ${dict.meta.description}`,
    dict.hero.tagline,
    `${t.location}: ${dict.hero.location}`,
    `## ${dict.nav.about}`,
    aboutBlock(dict),
    `${t.skills}: ${getSkills().join(", ")}`,
    `## ${dict.journey.title}`,
    journeyBlock(locale, dict, "###"),
    `## ${dict.work.eyebrow}`,
    dict.work.description,
    workBlock(locale, dict, "###"),
    `## ${dict.nav.contact}`,
    contactBlock(locale, dict),
    footer(locale, ""),
  ]);
}

function about(locale: Locale): string {
  const dict = dictionaries[locale];
  const t = labels[locale];

  return join([
    `# ${dict.pages.about.heading}`,
    `> ${dict.pages.about.description}`,
    aboutBlock(dict),
    `## ${t.skills}`,
    getSkills().join(", "),
    `## ${dict.journey.title}`,
    journeyBlock(locale, dict, "###"),
    footer(locale, "/about"),
  ]);
}

function contact(locale: Locale): string {
  const dict = dictionaries[locale];
  return join([
    `# ${dict.pages.contact.heading}`,
    `> ${dict.pages.contact.description}`,
    contactBlock(locale, dict),
    footer(locale, "/contact"),
  ]);
}

function privacy(locale: Locale): string {
  const dict = dictionaries[locale];
  return join([
    `# ${dict.privacy.title}`,
    `> ${dict.privacy.description}`,
    `_${dict.privacy.updated}_`,
    dict.privacy.intro,
    ...dict.privacy.sections.map((section) =>
      join([`## ${section.title}`, ...section.paragraphs]),
    ),
    footer(locale, "/privacy"),
  ]);
}

function project(locale: Locale, slug: string): string | null {
  const entry = getProject(slug);
  if (!entry) return null;

  const dict = dictionaries[locale];
  const t = labels[locale];
  const content = entry.content[locale];
  const live = entry.url && projectUrl(entry.url, locale);
  const next = getNextProject(slug);

  return join([
    `# ${entry.title}`,
    `> ${content.tagline}`,
    list(
      [
        `${dict.work.kinds[entry.kind]} · ${entry.year}`,
        `${dict.project.role}: ${content.role}`,
        `${dict.project.stack}: ${entry.stack.join(", ")}`,
        live ? `${dict.project.visit}: <${live}>` : dict.project.comingSoon,
        entry.repo && `${dict.project.source}: <${entry.repo}>`,
      ].filter((item): item is string => !!item),
    ),
    `## ${dict.project.context}`,
    content.context,
    `## ${dict.project.challenges}`,
    ...content.challenges.map((challenge, index) =>
      join([`### ${index + 1}. ${challenge.title}`, challenge.body]),
    ),
    `## ${dict.project.outcome}`,
    content.outcome,
    `${t.nextProject}: [${next.title}](${url(locale, projectPath(next.slug))})`,
    footer(locale, projectPath(slug)),
  ]);
}

/**
 * The agent-facing 404: still a 404 status, but with a body an agent can act
 * on - what went wrong and where to go instead.
 */
function notFound(locale: Locale, pathname: string): string {
  const dict = dictionaries[locale];
  const t = labels[locale];
  // Shown inside a code span: strip what would close it, and cap the length so
  // a hostile URL can't flood the body.
  const shown = pathname.replace(/`/g, "").slice(0, 200);

  return join([
    `# 404 - ${dict.notFound.title}`,
    dict.notFound.description,
    `${t.missingPath} \`${shown}\` (${site.url}).`,
    `## ${t.pages}`,
    list([
      `[${dict.notFound.cta}](${url(locale)})`,
      `[${dict.pages.about.title}](${url(locale, "/about")})`,
      `[${dict.pages.contact.title}](${url(locale, "/contact")})`,
      ...projects.map(
        (entry) => `[${entry.title}](${url(locale, projectPath(entry.slug))})`,
      ),
      `[${t.sitemap}](${site.url}/sitemap.xml)`,
      `[llms.txt](${site.url}/llms.txt)`,
    ]),
  ]);
}

/**
 * Resolves a pathname to its Markdown page. A path without a locale prefix is
 * read in `fallback`, the locale the visitor would have been redirected to.
 */
export function renderMarkdown(pathname: string, fallback: Locale): MarkdownPage {
  const segments = pathname.split("/").filter(Boolean);
  const locale = isLocale(segments[0]) ? segments[0] : fallback;
  const rest = isLocale(segments[0]) ? segments.slice(1) : segments;
  const path = rest.length ? `/${rest.join("/")}` : "";

  const ok = (body: string): MarkdownPage => ({
    status: 200,
    body,
    canonical: url(locale, path),
  });

  if (rest.length === 0) return ok(home(locale));
  if (path === "/about") return ok(about(locale));
  if (path === "/contact") return ok(contact(locale));
  if (path === "/privacy") return ok(privacy(locale));
  if (rest.length === 2 && rest[0] === "work") {
    const body = project(locale, rest[1]);
    if (body) return ok(body);
  }

  return { status: 404, body: notFound(locale, pathname), canonical: url(locale) };
}

/** Every page of the site in one document, for `/llms-full.txt`. */
export function renderAllMarkdown(locale: Locale): string {
  return join([
    home(locale),
    about(locale),
    ...projects.map((entry) => project(locale, entry.slug) ?? ""),
    contact(locale),
    privacy(locale),
  ]);
}
