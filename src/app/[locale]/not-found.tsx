import { ButtonLink } from "@/components/ui/button";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * `not-found.tsx` cannot read route params, so it falls back to the default
 * locale. The navbar language switch stays available above it.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);

  return (
    <section className="container-gutter flex min-h-[70svh] flex-col justify-center py-32">
      <p className="display-xl text-gradient">404</p>
      <h1 className="display-m mt-6">{dict.notFound.title}</h1>
      <p className="mt-6 max-w-md text-muted">{dict.notFound.description}</p>
      <div className="mt-10">
        <ButtonLink href={`/${defaultLocale}`}>{dict.notFound.cta}</ButtonLink>
      </div>
    </section>
  );
}
