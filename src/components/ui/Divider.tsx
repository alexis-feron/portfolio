import { CSSProperties } from 'react';
import { classes, cssProps, numToMs } from 'utils/style';

interface DividerProps {
  lineWidth?: string;
  lineHeight?: string;
  notchWidth?: string;
  notchHeight?: string;
  collapseDelay?: number;
  collapsed?: boolean;
  className?: string;
  style?: CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Divider = ({
  lineWidth = '100%',
  lineHeight = '2px',
  notchWidth = '90px',
  notchHeight = '10px',
  collapseDelay = 0,
  collapsed = false,
  className,
  style,
  ...rest
}: DividerProps) => (
  <div
    className={classes('relative', className)}
    style={cssProps(
      {
        width: lineWidth,
        height: lineHeight,
      },
      style
    )}
    {...rest}
  >
    <div
      className={classes(
        'w-full h-full opacity-100 origin-left scale-x-100',
        'bg-primary',
        'transition-opacity duration-l ease-fast-out-slow-in delay-(--collapseDelay)',
        'motion-reduce:transition-[transform,opacity]',
        collapsed && 'opacity-0 scale-x-0'
      )}
      style={cssProps({ collapseDelay: numToMs(collapseDelay) })}
    />
    <div
      className={classes(
        'absolute opacity-100',
        'bg-primary',
        'transition-opacity duration-l ease-fast-out-slow-in delay-(--collapseDelay)',
        'motion-reduce:transition-[clip-path,opacity]',
        '[clip-path:polygon(0_-1px,100%_-1px,calc(100%-10px)_100%,10px_100%)]',
        'top-(--lineHeight)',
        'after:content-[""] after:absolute after:top-0 after:left-full after:w-[64px] after:h-[2px] after:bg-primary',
        collapsed && 'opacity-0 [clip-path:polygon(0_-1px,0_-1px,10px_100%,10px_100%)]'
      )}
      style={{
        width: notchWidth,
        height: notchHeight,
        ...cssProps({
          collapseDelay: numToMs(collapseDelay + 160),
          lineHeight: lineHeight,
        }),
      }}
    />
  </div>
);
