'use client';

import { classes } from 'utils/style';

interface VisuallyHiddenProps {
  className?: string;
  showOnFocus?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
  visible?: boolean;
  [key: string]: unknown;
}

export const VisuallyHidden = ({
  className,
  showOnFocus,
  as: Component = 'span',
  children,
  visible,
  ...rest
}: VisuallyHiddenProps) => {
  return (
    <Component
      className={classes(
        'absolute border-0 [clip:rect(0_0_0_0)] h-px w-px -m-px p-0 overflow-hidden whitespace-nowrap break-normal',
        visible && 'static transform-none clip-auto h-auto w-auto m-0 overflow-visible', // Undo hidden styles if visible (though logic seems to rely on not rendering or conditional classes)
        // Original CSS logic: &[data-hidden='true'] or &[data-show-on-focus='true']:not(:focus)
        // Implementing logic in JS:
        (!visible && !showOnFocus) && '', // Always hidden
        (showOnFocus) && 'focus:static focus:[clip:auto] focus:h-auto focus:w-auto focus:m-0 focus:overflow-visible',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
