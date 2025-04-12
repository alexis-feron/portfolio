'use client';

import { Icon } from '@/components/Icon';
import { Loader } from '@/components/Loader';
import { Transition } from '@/components/Transition';
import { classes } from '@/lib/style';
import RouterLink from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';
import styles from './Button.module.css';

function isExternalLink(href?: string) {
  return href?.includes('://');
}

// Définition des props
type ButtonProps = {
  href?: string;
  className?: string;
  as?: ElementType;
  secondary?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: string;
  iconEnd?: string;
  iconHoverShift?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  rel?: string;
  target?: string;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
>;

// Composant principal
export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  ({ href, ...rest }, ref) => {
    if (isExternalLink(href) || !href) {
      return <ButtonContent href={href} ref={ref} {...rest} />;
    }

    return (
      <RouterLink href={href} scroll={false} legacyBehavior>
        <ButtonContent ref={ref} {...rest} />
      </RouterLink>
    );
  }
);

Button.displayName = 'Button';

// Contenu interne du bouton
const ButtonContent = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = 'loading',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      onClick,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href);
    const defaultComponent = href ? 'a' : 'button';
    const Component = as || defaultComponent;

    return (
      <Component
        className={classes(styles.button, className)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        data-icon={icon}
        href={href}
        rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
        target={target ?? (isExternal ? '_blank' : undefined)}
        disabled={disabled}
        onClick={onClick}
        ref={ref as any}
        {...rest}
      >
        {!!icon && (
          <Icon
            className={styles.icon}
            data-start={!iconOnly}
            data-shift={iconHoverShift}
            icon={icon}
          />
        )}
        {!!children && <span className={styles.text}>{children}</span>}
        {!!iconEnd && (
          <Icon
            className={styles.icon}
            data-end={!iconOnly}
            data-shift={iconHoverShift}
            icon={iconEnd}
          />
        )}
        <Transition unmount in={loading}>
          {visible => (
            <Loader
              className={styles.loader}
              size={32}
              text={loadingText}
              data-visible={visible}
              style=""
            />
          )}
        </Transition>
      </Component>
    );
  }
);

ButtonContent.displayName = 'ButtonContent';
