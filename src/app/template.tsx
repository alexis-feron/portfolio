'use client';

import { tokens } from 'components/layout/ThemeProvider/theme';
import { m } from 'framer-motion';
import { msToNum } from 'utils/style';
import { ScrollRestore } from './scroll-restore';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      className="col-start-1 row-start-1 min-h-[100lvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: 'tween',
        ease: 'linear',
        duration: msToNum(tokens.base.durationS) / 1000,
        delay: 0.1,
      }}
    >
      <ScrollRestore />
      {children}
    </m.div>
  );
}
