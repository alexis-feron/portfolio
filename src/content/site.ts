/**
 * Global site configuration.
 * Single source of truth - no external CMS, everything lives in the repo.
 */
export const site = {
  name: "Alexis Feron",
  url: "https://alexis-feron.com",
  role: "Fullstack Web Developer",
  // TODO(alexis): replace with the address you actually want published.
  email: "contact@alexis-feron.com",
  location: {
    city: "Lyon",
    country: "France",
    timezone: "Europe/Paris",
  },
  /** Formspree endpoint reused from the previous portfolio. */
  contactFormAction: "https://formspree.io/f/moqoegjz",
  /**
   * Cloudflare Turnstile, also carried over from the previous portfolio.
   * Turnstile keys are bound to a hostname list - set
   * NEXT_PUBLIC_TURNSTILE_SITE_KEY if this site ever moves to another domain.
   */
  turnstileSiteKey:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAACFRs-sb0x1qu5N9",
  portrait: "/images/profile.jpg",
} as const;

export type SocialLink = {
  label: string;
  handle: string;
  url: string;
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    handle: "@alexis-feron",
    url: "https://github.com/alexis-feron",
  },
  {
    label: "X",
    handle: "@alexis_feron_",
    url: "https://x.com/alexis_feron_",
  },
  {
    label: "Instagram",
    handle: "@alexis_feron_",
    url: "https://www.instagram.com/alexis_feron_",
  },
  {
    label: "LinkedIn",
    handle: "Alexis Feron",
    url: "https://www.linkedin.com/in/alexis-feron",
  },
];
