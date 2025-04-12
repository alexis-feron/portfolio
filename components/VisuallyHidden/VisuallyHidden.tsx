'use client';

import { classes } from '@/lib/style';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import styles from './VisuallyHidden.module.css';

type VisuallyHiddenProps = {
  children?: ReactNode;
  className?: string;
  showOnFocus?: boolean;
  visible?: boolean;
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  (
    { className, showOnFocus, as: Component = 'span', children, visible, ...rest },
    ref
  ) => {
    return (
      <Component
        className={classes(styles.hidden, className)}
        data-hidden={!visible && !showOnFocus}
        data-show-on-focus={showOnFocus}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
