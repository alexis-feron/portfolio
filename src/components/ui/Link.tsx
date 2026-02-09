'use client';

import NextLink from 'next/link';
import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';
import { classes } from 'utils/style';

const VALID_EXT = ['txt', 'png', 'jpg'];

function isAnchor(href: string) {
  if (!href) return false;
  const isValidExtension = VALID_EXT.includes(href.split('.').pop() || '');
  return href.includes('://') || href.startsWith('#') || isValidExtension;
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  scroll?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, secondary, ...rest }, ref) => {
    if (!href) {
      console.warn('⛔️ <Link /> utilisé sans href. Composant ignoré.');
      return null;
    }

    const baseClasses = classes(
      'cursor-pointer inline text-[rgb(var(--rgbPrimary))] pb-[2px]',
      'bg-[linear-gradient(rgb(var(--rgbPrimary)),rgb(var(--rgbPrimary)))] bg-no-repeat bg-[100%_100%] bg-[length:0_2px]',
      'bg-[linear-gradient(rgb(var(--rgbPrimary)/0.3),rgb(var(--rgbPrimary)/0.3)),linear-gradient(rgb(var(--rgbPrimary)/0.3),rgb(var(--rgbPrimary)/0.3))]',
      // The secondary background image is complex to layer with tailwind utilities purely without custom CSS or arbitrary values mimicking the original multiple backgrounds.
      // Re-implementing existing behavior with arbitrary values for gradients.
      // Original had 2 background layers.

      'bg-[image:var(--filledLineGradient),var(--unfilledLineGradient)]',
      'bg-[position:100%_100%,0_100%]',
      'bg-[size:0_2px,100%_2px]',
      'bg-no-repeat',

      'hover:bg-[size:100%_2px,100%_2px] hover:bg-[position:0_100%,0_100%]',
      'focus:bg-[size:100%_2px,100%_2px] focus:bg-[position:0_100%,0_100%]',

      'motion-reduce:transition-[background-size] motion-reduce:duration-m motion-reduce:ease-fast-out-slow-in',

      secondary && 'text-(--colorTextBody) [--linkColor:var(--rgbText)]', // Override variable if secondary

      // Define local variables for the gradients to simplify the bg-image arbitrary value
      '[--lineStrokeWidth:2px]',
      !secondary && '[--linkColor:var(--rgbPrimary)]',
      secondary && '[--linkColor:var(--color-text)]',
      '[--lineOpacity:0.3]',
      '[--filledLineGradient:linear-gradient(rgb(var(--linkColor)),rgb(var(--linkColor)))]',
      '[--unfilledLineGradient:linear-gradient(rgb(var(--linkColor)/var(--lineOpacity)),rgb(var(--linkColor)/var(--lineOpacity)))]',

      'text-[rgb(var(--linkColor))]',

      className
    );

    const content = children;

    if (isAnchor(href)) {
      const isExternal = href.includes('://');
      const rel = isExternal ? 'noreferrer noopener' : undefined;
      const target = isExternal ? '_blank' : undefined;

      return (
        <a
          href={href}
          ref={ref}
          className={baseClasses}
          rel={rel}
          target={target}
          title={typeof children === 'string' ? children : undefined}
          {...rest}
        >
          {content}
        </a>
      );
    }

    return (
      <NextLink
        href={href}
        scroll={false}
        className={baseClasses}
        ref={ref}
        title={typeof children === 'string' ? children : undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(rest as any)}
      >
        {content}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';
