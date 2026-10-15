import { projects } from "@/content/projects";

/**
 * Every page that exists under a locale, as the path after `/{locale}`.
 *
 * The sitemap, the Markdown representations served to agents and llms.txt all
 * read this list, so a page added here shows up in all three - and a path that
 * isn't here answers 404 in Markdown just as it does in HTML.
 */
export const staticPaths = ["", "/about", "/contact", "/privacy"] as const;

export type StaticPath = (typeof staticPaths)[number];

export function projectPath(slug: string) {
  return `/work/${slug}`;
}

export function sitePaths(): string[] {
  return [
    ...staticPaths,
    ...projects.map((project) => projectPath(project.slug)),
  ];
}
