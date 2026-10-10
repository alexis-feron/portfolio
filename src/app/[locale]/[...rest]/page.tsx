import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * The client router applies this page's metadata over the one `not-found.tsx`
 * rendered on the server, so it has to carry the same title - otherwise the
 * tab flips back to the layout default once the page hydrates.
 */
export const metadata: Metadata = {
  title: "404",
};

/**
 * Any path under a locale that no route claims lands here, so it renders the
 * locale's own `not-found.tsx` inside the site layout - navbar, footer, theme -
 * instead of Next's bare default 404.
 */
export default function CatchAll() {
  notFound();
}
