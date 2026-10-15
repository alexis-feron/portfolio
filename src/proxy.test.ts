import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

const ORIGIN = "https://alexis-feron.com";

function request(
  path: string,
  headers: Record<string, string> = {},
  method = "GET",
) {
  return new NextRequest(new URL(path, ORIGIN), { headers, method });
}

const MARKDOWN = { accept: "text/markdown" };
const BROWSER = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

describe("proxy - Markdown negotiation", () => {
  it("answers a localised page in Markdown with the right headers", async () => {
    const response = proxy(request("/fr", MARKDOWN));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("link")).toBe(`<${ORIGIN}/fr>; rel="canonical"`);
    expect(await response.text()).toMatch(/^# Alexis Feron/);
  });

  it("answers the bare home page in Markdown without a redirect", async () => {
    const response = proxy(
      request("/", { ...MARKDOWN, "accept-language": "en-US,en;q=0.9" }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("vary")).toContain("Accept");
    expect(await response.text()).toContain("Fullstack Web Developer");
  });

  it("answers an unknown path with a Markdown 404", async () => {
    const response = proxy(request("/__ora-404-probe-xsv89388", MARKDOWN));
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toContain("Accept");
    const body = await response.text();
    expect(body.length).toBeGreaterThan(20);
    expect(body).toContain("/llms.txt");
  });

  it("answers a localised unknown path with a Markdown 404", () => {
    expect(proxy(request("/en/nope", MARKDOWN)).status).toBe(404);
  });

  it("returns 406 when neither HTML nor Markdown is acceptable", () => {
    const response = proxy(request("/fr", { accept: "application/json" }));
    expect(response.status).toBe(406);
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("leaves non-GET requests to the app", () => {
    const response = proxy(request("/fr", MARKDOWN, "POST"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("leaves the router's own requests alone", () => {
    const response = proxy(request("/fr", { ...MARKDOWN, rsc: "1" }));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});

describe("proxy - HTML", () => {
  it("passes localised pages through, varying on Accept", () => {
    const response = proxy(request("/fr/about", BROWSER));
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("redirects a bare path to the visitor's locale", () => {
    const response = proxy(
      request("/about?x=1", { ...BROWSER, "accept-language": "en-GB,en" }),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${ORIGIN}/en/about?x=1`);
    expect(response.headers.get("vary")).toBe("Accept, Accept-Language, Cookie");
  });

  it("prefers the locale cookie over Accept-Language", () => {
    const response = proxy(
      request("/", { cookie: "locale=fr", "accept-language": "en" }),
    );
    expect(response.headers.get("location")).toBe(`${ORIGIN}/fr`);
  });

  it("falls back to the default locale", () => {
    const response = proxy(request("/", { "accept-language": "de" }));
    expect(response.headers.get("location")).toBe(`${ORIGIN}/fr`);
  });
});
