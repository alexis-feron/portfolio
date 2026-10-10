import type { Metadata } from "next";

import { NotFoundView } from "@/components/sections/not-found-view";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "404",
};

/**
 * `not-found.tsx` cannot read route params, so both translations are loaded
 * and the view picks one from the URL. The navbar above it already speaks the
 * right language - the layout does get the params.
 */
export default async function NotFound() {
  const [fr, en] = await Promise.all([getDictionary("fr"), getDictionary("en")]);

  return <NotFoundView copy={{ fr: fr.notFound, en: en.notFound }} />;
}
