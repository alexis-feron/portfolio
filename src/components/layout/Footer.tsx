'use client';

import { Text } from 'components/ui/Text';
import { classes } from 'utils/style';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => (
  <footer
    className={classes(
      'flex flex-wrap items-baseline justify-center px-l py-3xl relative z-20 text-(--colorTextLight) [--lineHeightBody:1.1]',
      className
    )}
  >
    <Text size="s" align="center">
      <span className="pr-xs inline-flex">{`© ${new Date().getFullYear()} Alexis Feron.`}</span>
    </Text>
  </footer>
);
