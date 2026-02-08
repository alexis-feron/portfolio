import { IconType } from 'components/ui/Icon/Icon';

export const navLinks = [
  {
    label: 'Details',
    pathname: '/#details',
  },
  {
    label: 'Projects',
    pathname: '/#project-1',
  },
  {
    label: 'Contact',
    pathname: '/#contact',
  },
  {
    label: 'Resume',
    pathname: '/resume',
  },
];

export const socialLinks: { label: string; url: string; icon: IconType }[] = [
  {
    label: 'Github',
    url: 'https://github.com/alexis-feron',
    icon: 'github',
  },
  {
    label: 'X',
    url: 'https://x.com/alexis_feron_',
    icon: 'x', // Ensure 'x' is in IconType in Icon.tsx
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/alexis_feron_',
    icon: 'instagram',
  },
];
