'use client';

import { Button } from 'components/ui/Button';
import { useAppContext } from 'hooks';
import { ButtonHTMLAttributes, useId } from 'react';
import { classes } from 'utils/style';

interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isMobile?: boolean; // We likely don't need isMobile prop anymore if CSS handles it? 
  // But keeping it compatible.
}

export const ThemeToggle = ({ isMobile, ...rest }: ThemeToggleProps) => {
  const { dispatch } = useAppContext();
  const id = useId();
  const maskId = `${id}theme-toggle-mask`;

  const handleClick = () => {
    dispatch({ type: 'toggleTheme' });
  };

  return (
    <Button
      iconOnly
      className={classes(
        '!inline-flex fixed z-50 top-[24px] right-[24px] translate-x-0 translate-y-0 transform-none',
        // Use module class for hiding logic
        // Use module class for hiding logic matches desktop behavior
        !isMobile && "nav-mobile-hidden",
        rest.className
      )}
      style={!isMobile ? { position: 'fixed', top: '24px', right: '24px', zIndex: 60, display: 'inline-flex' } : {}}
      data-mobile={isMobile}
      aria-label="Toggle theme"
      onClick={handleClick}
      {...rest}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon (Visible in Light Mode) */}
        <svg 
          className="w-[24px] h-[24px] text-[var(--colorTextBody)] dark:opacity-0 transition-opacity duration-300 absolute" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>

        {/* Moon Icon (Visible in Dark Mode) */}
        <svg 
          className="w-[24px] h-[24px] text-[var(--colorTextBody)] opacity-0 dark:opacity-100 transition-opacity duration-300 absolute" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </Button>
  );
};
