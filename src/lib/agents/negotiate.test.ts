import { describe, expect, it } from "vitest";

import { negotiate } from "./negotiate";

describe("negotiate", () => {
  it("defaults to HTML without a header", () => {
    expect(negotiate(null)).toBe("html");
    expect(negotiate("")).toBe("html");
    expect(negotiate("*/*")).toBe("html");
  });

  it("keeps serving HTML to browsers", () => {
    expect(
      negotiate(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      ),
    ).toBe("html");
    expect(negotiate("text/html")).toBe("html");
  });

  it("serves Markdown to clients that ask for it", () => {
    expect(negotiate("text/markdown")).toBe("markdown");
    expect(negotiate("text/markdown, text/html;q=0.9, */*;q=0.8")).toBe(
      "markdown",
    );
    expect(negotiate("text/markdown;q=0.5")).toBe("markdown");
    expect(negotiate("TEXT/MARKDOWN; charset=utf-8")).toBe("markdown");
  });

  it("honours q-values", () => {
    expect(negotiate("text/markdown;q=0.5, text/html")).toBe("html");
    expect(negotiate("text/html;q=0.4, text/markdown;q=0.8")).toBe("markdown");
    expect(negotiate("text/markdown;q=0, */*")).toBe("html");
    expect(negotiate("text/html;q=0, text/markdown;q=0.1")).toBe("markdown");
  });

  it("breaks an explicit tie towards Markdown, since browsers never name it", () => {
    expect(negotiate("text/html, text/markdown")).toBe("markdown");
  });

  it("does not infer Markdown from a wildcard", () => {
    expect(negotiate("text/*")).toBe("html");
  });

  it("returns null when neither representation is acceptable", () => {
    expect(negotiate("application/json")).toBeNull();
    expect(negotiate("image/png, application/pdf")).toBeNull();
    expect(negotiate("text/html;q=0, text/markdown;q=0")).toBeNull();
  });

  it("ignores malformed entries and weights", () => {
    expect(negotiate("garbage")).toBe("html");
    expect(negotiate("text/markdown;q=abc")).toBe("markdown");
  });
});
