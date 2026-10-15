import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { en } from "@/i18n/dictionaries/en";

import { PersonJsonLd, ProfilePageJsonLd } from "./json-ld";

function payloads(markup: string) {
  return [
    ...markup.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
}

describe("PersonJsonLd", () => {
  const [person, website] = payloads(
    renderToStaticMarkup(<PersonJsonLd locale="en" dict={en} />),
  );

  it("identifies the person the way people search for him", () => {
    expect(person["@type"]).toBe("Person");
    expect(person.hasOccupation.occupationLocation.name).toBe("Lyon");
    expect(person.knowsAbout).toEqual(
      expect.arrayContaining(["Next.js", "React", "Shopify", "TypeScript"]),
    );
  });

  it("states where he works and studies, from the journey", () => {
    expect(person.worksFor).toEqual([
      { "@type": "Organization", name: "Ultrō" },
    ]);
    expect(person.affiliation[0].name).toBe("Ynov");
    expect(person.alumniOf[0].name).toBe("IUT Clermont Auvergne");
  });

  it("ties the website to the person", () => {
    expect(website.author["@id"]).toBe(person["@id"]);
  });
});

describe("ProfilePageJsonLd", () => {
  it("points the about page at the person", () => {
    const [profile] = payloads(
      renderToStaticMarkup(<ProfilePageJsonLd locale="en" dict={en} />),
    );
    expect(profile["@type"]).toBe("ProfilePage");
    expect(profile.url).toBe("https://alexis-feron.com/en/about");
    expect(profile.mainEntity["@id"]).toBe("https://alexis-feron.com/#person");
  });
});
