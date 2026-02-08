'use client';

import { useHasMounted } from 'hooks';
import { createContext, useEffect, type ReactNode } from 'react';
import { classes, media } from 'utils/style';
import { theme, tokens, type ThemeColors } from './theme';
import { useTheme } from './useTheme';

export const ThemeContext = createContext<ThemeColors>({} as ThemeColors);

interface ThemeProviderProps {
  themeId?: string;
  theme?: Partial<ThemeColors>;
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export const ThemeProvider = ({
  themeId = 'dark',
  theme: themeOverrides,
  children,
  className,
  as: Component = 'div',
  ...rest
}: ThemeProviderProps) => {
  const currentTheme: ThemeColors = { ...theme[themeId], ...themeOverrides };
  const parentTheme = useTheme();
  const isRootProvider = !parentTheme.themeId;
  const hasMounted = useHasMounted();

  // Save root theme id to localstorage and apply class to body
  useEffect(() => {
    if (isRootProvider && hasMounted) {
      window.localStorage.setItem('theme', JSON.stringify(themeId));
      document.body.dataset.theme = themeId;
    }
  }, [themeId, isRootProvider, hasMounted]);

  // Update theme-color meta tag
  useEffect(() => {
    if (isRootProvider && hasMounted) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', `rgb(${currentTheme.rgbBackground})`);
      }
    }
  }, [currentTheme.rgbBackground, isRootProvider, hasMounted]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {isRootProvider && children}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component
          className={classes('theme-provider', className)}
          data-theme={themeId}
          {...rest}
        >
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  );
};


// Logic extracted to themeStyles.ts
