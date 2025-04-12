// app/head.tsx
import GothamBook from '@/assets/fonts/gotham-book.woff2';
import GothamMedium from '@/assets/fonts/gotham-medium.woff2';

const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://alexis-feron.com';

export default function Head() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonical = pathname === '/' ? '' : pathname;

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="manifest" href="/manifest.json" />
      <link
        rel="icon"
        href="https://avatars.githubusercontent.com/u/87498220"
        type="image/png"
      />
      <link type="text/plain" rel="author" />

      <link rel="preload" href={GothamMedium} as="font" crossOrigin="anonymous" />
      <link rel="preload" href={GothamBook} as="font" crossOrigin="anonymous" />

      <link rel="canonical" href={`${BASE_URL}${canonical}`} />
    </>
  );
}
