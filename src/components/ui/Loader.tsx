'use client';

import { Text } from 'components/ui/Text';
import { VisuallyHidden } from 'components/ui/VisuallyHidden';
import { useReducedMotion } from 'framer-motion';
import { useHasMounted } from 'hooks';
import { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { classes, cssProps } from 'utils/style';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
  size?: number;
  text?: string;
}

export const Loader = ({
  className,
  style,
  size = 32,
  text = 'Loading...',
  ...rest
}: LoaderProps) => {
  const reduceMotion = useReducedMotion();
  const hasMounted = useHasMounted();

  const renderScreenReaderTextPortal = () => {
    if (!hasMounted) return;

    const portalRoot = document.getElementById('portal-root');
    if (!portalRoot) return null;

    return createPortal(
      <VisuallyHidden className="loader-announcement" aria-live="assertive">
        {text}
      </VisuallyHidden>,
      portalRoot
    );
  };

  if (reduceMotion) {
    return (
      <Text className={classes('text-inherit', className)} weight="medium" {...rest}>
        {text}
        {renderScreenReaderTextPortal()}
      </Text>
    );
  }

  const gapSize = Math.round((size / 3) * 0.2);
  const spanSize = Math.round(size / 3 - gapSize * 2 - 1);

  return (
    <div
      className={classes('flex justify-center', className)}
      style={cssProps({ width: size, height: size }, style)}
      {...rest}
    >
      <div
        className="grid grid-cols-[repeat(3,var(--spanSize))] gap-(--gapSize) items-center justify-center -skew-x-22"
        style={cssProps({ '--spanSize': `${spanSize}px`, '--gapSize': `${gapSize}px` })}
      >
        <div className="h-[60%] bg-current animate-[loaderSpan_1s_var(--ease-fast-out-slow-in)_infinite] scale-y-0 origin-top-left" />
        <div className="h-[60%] bg-current animate-[loaderSpan_1s_var(--ease-fast-out-slow-in)_infinite] scale-y-0 origin-top-left [animation-delay:0.1s]" />
        <div className="h-[60%] bg-current animate-[loaderSpan_1s_var(--ease-fast-out-slow-in)_infinite] scale-y-0 origin-top-left [animation-delay:0.2s]" />
      </div>
      {renderScreenReaderTextPortal()}
    </div>
  );
};
