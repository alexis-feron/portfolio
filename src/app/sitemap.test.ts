import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { site } from "@/content/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists every page in both locales", () => {
    for (const locale of ["fr", "en"]) {
      for (const path of ["", "/about", "/contact", "/privacy"]) {
        expect(urls).toContain(`${site.url}/${locale}${path}`);
      }
      for (const project of projects) {
        expect(urls).toContain(`${site.url}/${locale}/work/${project.slug}`);
      }
    }
  });

  it("declares the translations of each page", () => {
    const about = sitemap().find((entry) => entry.url === `${site.url}/en/about`);
    expect(about?.alternates?.languages).toEqual({
      "fr-FR": `${site.url}/fr/about`,
      "en-US": `${site.url}/en/about`,
      "x-default": `${site.url}/fr/about`,
    });
  });
});
