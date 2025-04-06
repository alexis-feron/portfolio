import NextLink from 'next/link';
import { forwardRef } from 'react';
import { classes } from 'utils/style';
import styles from './Link.module.css';

const VALID_EXT = ['txt', 'png', 'jpg'];

function isAnchor(href) {
  if (!href) return false;
  const isValidExtension = VALID_EXT.includes(href.split('.').pop());
  return href.includes('://') || href.startsWith('#') || isValidExtension;
}

export const Link = forwardRef(
  ({ href, children, className, secondary, ...rest }, ref) => {
    if (!href) {
      console.warn('⛔️ <Link /> utilisé sans href. Composant ignoré.');
      return null;
    }

    if (isAnchor(href)) {
      const isExternal = href.includes('://');
      const rel = isExternal ? 'noreferrer noopener' : undefined;
      const target = isExternal ? '_blank' : undefined;

      return (
        <a
          href={href}
          ref={ref}
          className={classes(styles.link, className)}
          data-secondary={secondary}
          rel={rel}
          target={target}
          title={typeof children === 'string' ? children : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        href={href}
        scroll={false}
        className={classes(styles.link, className)}
        data-secondary={secondary}
        ref={ref}
        title={typeof children === 'string' ? children : undefined}
        {...rest}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';
