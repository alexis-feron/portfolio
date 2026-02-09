'use client';

import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { classes } from 'utils/style';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  level?: number;
  as?: ElementType;
  align?: 'auto' | 'start' | 'center' | 'end';
  weight?: 'auto' | 'regular' | 'medium' | 'bold';
  className?: string;
}

export const Heading = ({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className,
  ...rest
}: HeadingProps) => {
  const clampedLevel = Math.min(Math.max(level, 0), 5);
  const Component = as || (`h${Math.max(clampedLevel, 1)}` as ElementType);

  return (
    <Component
      className={classes(
        'leading-(--lineHeightTitle) text-(--colorTextTitle)',
        clampedLevel === 0 && 'text-[length:var(--text-h0)] tracking-[-0.05em]',
        clampedLevel === 1 && 'text-[length:var(--text-h1)] tracking-[-0.05em]',
        clampedLevel === 2 && 'text-[length:var(--text-h2)] tracking-[-0.04em]',
        clampedLevel === 3 && 'text-[length:var(--text-h3)] tracking-[-0.02em]',
        clampedLevel === 4 && 'text-[length:var(--text-h4)] tracking-[-0.01em]',
        clampedLevel === 5 && 'text-[length:var(--text-h5)]',

        align === 'start' && 'text-start',
        align === 'center' && 'text-center',

        weight === 'regular' && 'font-regular',
        weight === 'medium' && 'font-medium',
        weight === 'bold' && 'font-bold',

        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
