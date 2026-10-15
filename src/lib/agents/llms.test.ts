import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { site } from "@/content/site";

import { buildLlmsFullTxt, buildLlmsTxt } from "./llms";

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt();
  const lines = text.split("\n");

  it("follows the llms.txt layout: H1, blockquote summary, H2 sections", () => {
    expect(lines[0]).toBe(`# ${site.name}`);
    expect(lines[1]).toBe("");
    expect(lines[2].startsWith("> ")).toBe(true);
    // Exactly one H1.
    expect(lines.filter((line) => /^# /.test(line))).toHaveLength(1);
    expect(text).toMatch(/^## Pages$/m);
    expect(text).toMatch(/^## Optional$/m);
  });

  it("tells agents when to use the site and how", () => {
    const section = text.split("## When to use")[1]?.split("\n## ")[0] ?? "";
    expect(section).toContain("fullstack web developer in Lyon");
    expect(section).toContain("Accept: text/markdown");
    expect(section).toContain(site.email);
    expect(section).toMatch(/not advertising freelance availability/);
  });

  it("links every project and the main pages with absolute URLs", () => {
    for (const project of projects) {
      expect(text).toContain(`(${site.url}/en/work/${project.slug})`);
    }
    for (const path of ["/en", "/fr", "/en/about", "/en/contact", "/en/privacy"]) {
      expect(text).toContain(`(${site.url}${path})`);
    }
    const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
    for (const link of links) expect(link).toMatch(/^https:\/\//);
  });
});

describe("buildLlmsFullTxt", () => {
  it("holds the whole site in both languages", () => {
    const text = buildLlmsFullTxt();
    expect(text).toContain("# Privacy");
    expect(text).toContain("# Confidentialité");
  });
});
