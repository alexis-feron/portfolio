import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useRef } from 'react';

export function useScrollToHash() {
  const scrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const scrollToHash = useCallback(
    (hash: string, onDone?: () => void) => {
      const id = hash.split('#')[1];
      const targetElement = document.getElementById(id);
      const newPath = `${pathname}#${id}`;

      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      const handleScroll = () => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === pathname) {
            onDone?.();
            window.history.pushState(null, '', newPath);
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      };
    },
    [pathname, reduceMotion]
  );

  return scrollToHash;
}
