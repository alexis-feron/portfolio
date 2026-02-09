'use client';

import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { classes } from 'utils/style';

interface TextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  size?: 's' | 'm' | 'l' | 'xl' | string;
  as?: ElementType;
  align?: 'auto' | 'start' | 'center' | 'end';
  weight?: 'auto' | 'regular' | 'medium' | 'bold';
  secondary?: boolean;
  className?: string;
}

export const Text = ({
  children,
  size = 'm',
  as: Component = 'span',
  align = 'auto',
  weight = 'auto',
  secondary,
  className,
  ...rest
}: TextProps) => {
  return (
    <Component
      className={classes(
        'leading-(--lineHeightBody) text-(--colorTextBody)',
        size === 's' && 'text-body-s',
        size === 'm' && 'text-body-m',
        size === 'l' && 'text-body-l',
        size === 'xl' && 'text-body-xl',
        align === 'start' && 'text-start',
        align === 'center' && 'text-center',
        // align === 'auto' is default behavior
        weight === 'regular' && 'font-regular',
        weight === 'medium' && 'font-medium',
        weight === 'bold' && 'font-bold',
        secondary && 'text-(--colorTextLight)',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
