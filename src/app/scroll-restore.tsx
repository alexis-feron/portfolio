'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const targetElement = hash ? document.getElementById(hash) : null;

    if (targetElement) {
      window.scrollTo(0, targetElement.offsetTop);
      targetElement.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      document.body.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
