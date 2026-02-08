'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { classes } from 'utils/style';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  children?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component 
        className={classes(
            'px-[calc(var(--spacing-4xl)*2)] pr-5xl focus:outline-none',
            'min-[2080px]:pl-5xl',
            'max-[1040px]:pl-[calc(var(--spacing-4xl)+var(--spacing-3xl))]',
            'max-[696px]:px-l',
            'max-[696px]:px-outer', // Overrides previous if specificity holds or just additional
            'max-h-[696px]:px-outer',
            'max-[820px]:max-h-[420px]:px-4xl',
            className
        )} 
        ref={ref} 
        {...rest}
    >
      {children}
    </Component>
  )
);

Section.displayName = 'Section';
