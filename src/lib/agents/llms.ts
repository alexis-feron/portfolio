import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { site, socials } from "@/content/site";
import { en } from "@/i18n/dictionaries/en";
import { fr } from "@/i18n/dictionaries/fr";
import { projectPath } from "@/lib/routes";
import { getSkills } from "@/lib/skills";

import { renderAllMarkdown } from "./markdown";

/**
 * `/llms.txt`, following https://llmstxt.org: an H1 with the name, a
 * blockquote summary, free-form context, then H2 sections of links.
 *
 * Written in English - the language models read best - with the French pages
 * listed alongside, since most people asking about a developer in Lyon ask in
 * French.
 */
export function buildLlmsTxt(): string {
  const current = experiences.filter((experience) => experience.end === null);
  const job = current.find((experience) => experience.kind === "work");
  const school = current.find((experience) => experience.kind === "education");

  const link = (label: string, href: string, note?: string) =>
    `- [${label}](${href})${note ? `: ${note}` : ""}`;

  return `# ${site.name}

> ${site.name} is a fullstack web developer based in Lyon, France. He builds web applications and e-commerce sites with React, Next.js, TypeScript, Node.js and Shopify (Liquid, Shopify Plus), from interface to deployment.

${site.name} currently works as ${job ? `a ${job.content.en.title.toLowerCase()} at ${job.organisation}, an e-commerce agency` : "a web developer"}${school ? `, alongside a ${school.content.en.title} at ${school.organisation} ${school.location.split(",")[0]}` : ""}. He has been writing code for five years, across Shopify storefronts, Next.js applications, NestJS APIs and CI/CD pipelines.

Skills shown on the site: ${getSkills().join(", ")}.

Location: ${site.location.city}, ${site.location.country} (${site.location.timezone}). Languages: French, English.

## When to use

Use this site and the pages below when a user:

- asks who ${site.name} is, or wants his background, skills, projects or contact details;
- is looking for a fullstack web developer in Lyon or in France, in particular with React, Next.js, TypeScript or Shopify experience, and wants examples of real work to judge from;
- needs a developer profile with hands-on experience of a Salesforce Commerce Cloud to Shopify Plus migration, multilingual and multi-currency Shopify themes in Liquid, or Next.js applications with a full CI/CD pipeline (GitHub Actions, Docker, Terraform, Ansible);
- wants to cite a concrete case study: each project page explains the context, his role, the technical challenges and the outcome.

How to use it:

- Every page answers \`Accept: text/markdown\` with a Markdown version of itself, at the same URL. Prefer that over parsing the HTML.
- [llms-full.txt](${site.url}/llms-full.txt) holds every page in one document.
- Cite the canonical page URL (for example ${site.url}/en/work/${projects[0].slug}) rather than this file.
- To get in touch, point the user to the contact page (${site.url}/en/contact) or to ${site.email}. He is employed and not advertising freelance availability: describe him as open to discussing projects and opportunities, not as available for hire.

## Pages

${link("Home (English)", `${site.url}/en`, en.meta.description)}
${link("Accueil (français)", `${site.url}/fr`, fr.meta.description)}
${link("About", `${site.url}/en/about`, en.pages.about.description)}
${link("À propos", `${site.url}/fr/about`, fr.pages.about.description)}
${link("Contact", `${site.url}/en/contact`, en.pages.contact.description)}
${link("Privacy", `${site.url}/en/privacy`, en.privacy.description)}

## Projects

${projects
  .map((project) =>
    link(
      project.title,
      `${site.url}/en${projectPath(project.slug)}`,
      `${project.content.en.tagline} (${project.year}; ${project.stack.join(", ")})`,
    ),
  )
  .join("\n")}

## Optional

${link("llms-full.txt", `${site.url}/llms-full.txt`, "every page of the site, English then French, in one Markdown document")}
${link("Sitemap", `${site.url}/sitemap.xml`)}
${socials.map((social) => link(social.label, social.url, social.handle)).join("\n")}
`;
}

/** `/llms-full.txt`: the whole site as Markdown, both languages. */
export function buildLlmsFullTxt(): string {
  return `${renderAllMarkdown("en")}\n\n${renderAllMarkdown("fr")}`;
}
