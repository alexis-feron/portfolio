import type { Metadata } from 'next';
import { gotham } from './fonts';
import './globals.css';
import { Providers } from './providers';

const siteUrl = 'https://alexis-feron.com';
const name = 'Alexis Feron';
const defaultOgImage = `${siteUrl}/social-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Alexis Feron | Portfolio',
    template: '%s | Alexis Feron',
  },
  description:
    'Alexis Feron, développeur web fullstack. Découvrez mon portfolio. Alexis Feron, web developer fullstack. Discover my portfolio.',
  authors: [{ name }],
  keywords:
    'Alexis Feron, portfolio, web developer, fullstack, react, vue, nextjs, nodejs',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://avatars.githubusercontent.com/u/87498220',
  },
  verification: {
    google: 'id5BdwKoxPwKEcQ5LHteqFS6Vx0L4cQnkNCszpTTvSo',
  },
  openGraph: {
    title: `${name} | Portfolio`,
    siteName: name,
    type: 'website',
    url: siteUrl,
    description: 'Alexis Feron, développeur web fullstack. Découvrez mon portfolio.',
    images: [
      {
        url: defaultOgImage,
        alt: 'Banner for the site',
        type: 'image/png',
        width: 1280,
        height: 675,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} | Portfolio`,
    description: 'Alexis Feron, développeur web fullstack. Découvrez mon portfolio.',
    site: '@alexis_feron_',
    creator: '@alexis_feron_',
    images: [defaultOgImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={gotham.variable}>
      <head>
        <meta name="theme-color" content="rgb(25 25 25)" />
        <link rel="author" type="text/plain" />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </head>
      <body data-theme="dark" tabIndex={-1} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const initialTheme = JSON.parse(localStorage.getItem('theme'));
                if (initialTheme) document.body.dataset.theme = initialTheme;
              } catch(e) {}
            `,
          }}
        />
        <Providers>{children}</Providers>
        <div id="portal-root" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Alexis Feron',
              url: siteUrl,
              sameAs: [
                'https://twitter.com/alexis_feron_',
                'https://www.linkedin.com/in/alexis-feron/',
                'https://www.instagram.com/alexis_feron_/',
                'https://www.github.com/alexis-feron',
              ],
              jobTitle: 'Full-Stack Web Developer',
              description: 'Développeur web full-stack expert en Next.js, React et Vue.',
              image: defaultOgImage,
            }),
          }}
        />
      </body>
    </html>
  );
}
