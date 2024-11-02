import Head from 'next/head';

const siteUrl = 'https://alexis-feron.com';
const name = 'Alexis Feron';
const twitterHandle = '@alexis_feron_';
const defaultOgImage = `${siteUrl}/social-image.png`;

export const Meta = ({
  title = 'Alexis Feron, portfolio, fullstack web developer',
  description = 'Alexis Feron, développeur web fullstack. Découvrez mon portfolio. Alexis Feron, web developer fullstack. Discover my portfolio.',
  prefix = name,
  ogImage = defaultOgImage,
}) => {
  const titleText = [prefix, title].filter(Boolean).join(' | ');

  return (
    <Head>
      <title key="title">{titleText}</title>
      <meta name="description" content={description} />
      <meta name="author" content={name} />
      <meta name="publisher" content={name} />
      <meta
        name="keywords"
        content="Alexis Feron, portfolio, web developer, fullstack, react, vue, nextjs, nodejs"
      />
      <meta
        name="google-site-verification"
        content="id5BdwKoxPwKEcQ5LHteqFS6Vx0L4cQnkNCszpTTvSo"
      />

      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Banner for the site" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="675" />

      <meta property="og:title" content={titleText} />
      <meta property="og:site_name" content={name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={titleText} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify({
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
          image: ogImage,
        })}
      </script>
    </Head>
  );
};
