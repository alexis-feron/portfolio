import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";

/**
 * Every technology the site actually shows, taken from the projects and the
 * journey rather than from a hand-kept list that would drift from them.
 */
export function getSkills(): string[] {
  return [
    ...new Set([
      ...projects.flatMap((project) => project.stack),
      ...experiences.flatMap((experience) => experience.tags),
    ]),
  ];
}
