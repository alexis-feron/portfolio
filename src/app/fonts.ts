import localFont from 'next/font/local';

export const gotham = localFont({
  src: [
    {
      path: '../assets/fonts/gotham-book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/gotham-book-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/gotham-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/gotham-medium-italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/gotham-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/gotham-bold-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
});
