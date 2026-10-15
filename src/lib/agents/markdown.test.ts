import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { locales } from "@/i18n/config";
import { sitePaths } from "@/lib/routes";

import { renderAllMarkdown, renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it.each(locales)("renders every page of the sitemap in %s", (locale) => {
    for (const path of sitePaths()) {
      const page = renderMarkdown(`/${locale}${path}`, "fr");
      expect(page.status, path).toBe(200);
      expect(page.body.startsWith("# "), path).toBe(true);
      expect(page.canonical).toBe(`${site.url}/${locale}${path}`);
    }
  });

  it("describes the person, the stack and the location on the home page", () => {
    const { body } = renderMarkdown("/en", "fr");
    expect(body).toContain("# Alexis Feron - Fullstack Web Developer");
    expect(body).toContain("Lyon");
    expect(body).toContain("Next.js");
    expect(body).toContain("Shopify");
    for (const project of projects) expect(body).toContain(project.title);
  });

  it("reads a path without a locale in the fallback locale", () => {
    const page = renderMarkdown("/", "en");
    expect(page.status).toBe(200);
    expect(page.canonical).toBe(`${site.url}/en`);

    expect(renderMarkdown("/about", "fr").canonical).toBe(
      `${site.url}/fr/about`,
    );
  });

  it("ignores a trailing slash", () => {
    expect(renderMarkdown("/fr/about/", "fr").status).toBe(200);
  });

  it("renders a project's full case study", () => {
    const project = projects[0];
    const { body } = renderMarkdown(`/fr/work/${project.slug}`, "fr");
    expect(body).toContain(`# ${project.title}`);
    expect(body).toContain(project.content.fr.context);
    for (const challenge of project.content.fr.challenges) {
      expect(body).toContain(challenge.title);
    }
  });

  it("gives the trust pages enough substance to be read on their own", () => {
    for (const locale of locales) {
      for (const path of ["/about", "/contact", "/privacy"]) {
        const { body } = renderMarkdown(`/${locale}${path}`, locale);
        expect(body.length, `${locale}${path}`).toBeGreaterThan(500);
      }
    }
  });

  it("answers unknown paths with an actionable 404", () => {
    const page = renderMarkdown("/__ora-404-probe-xsv89388", "en");
    expect(page.status).toBe(404);
    expect(page.body).toContain("# 404");
    expect(page.body).toContain("`/__ora-404-probe-xsv89388`");
    expect(page.body).toContain(`${site.url}/llms.txt`);
    expect(page.body).toContain(`${site.url}/sitemap.xml`);

    expect(renderMarkdown("/fr/work/nope", "fr").status).toBe(404);
    expect(renderMarkdown("/fr/work", "fr").status).toBe(404);
  });

  it("keeps a hostile path from breaking out of its code span", () => {
    const { body } = renderMarkdown(`/x\`[evil](http://x)\`${"a".repeat(500)}`, "en");
    expect(body).not.toContain("`[evil]");
    expect(body).not.toContain("a".repeat(201));
  });
});

describe("renderAllMarkdown", () => {
  it("contains every page", () => {
    const body = renderAllMarkdown("en");
    for (const project of projects) expect(body).toContain(`# ${project.title}`);
    expect(body).toContain("# Privacy");
  });
});
