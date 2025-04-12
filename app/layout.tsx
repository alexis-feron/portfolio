'use client';

import styles from '@/app/App.module.css';
import { initialState, reducer } from '@/app/reducer';
import { ScrollRestore } from '@/app/ScrollRestore';
import { Navbar } from '@/features/Navbar';
import { msToNum } from '@/lib/style';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useFoucFix, useLocalStorage } from 'hooks';
import { usePathname } from 'next/navigation';
import React, { Fragment, createContext, useEffect, useReducer } from 'react';

import '@/styles/global.css';
import '@/styles/reset.css';

export const AppContext = createContext({});

const repoPrompt = `
\nTaking a peek huh? Check out the source code: https://github.com/alexis-feron/portfolio
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isClient = typeof window !== 'undefined';
  const [storedTheme] = useLocalStorage('theme', isClient ? 'dark' : null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const pathname = usePathname();
  useFoucFix();

  useEffect(() => {
    console.info(`${repoPrompt}\n\n`);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      dispatch({ type: 'setTheme', value: storedTheme || 'dark' });
      const theme = storedTheme || 'dark';
      document.body.dataset.theme = theme;
    }
  }, [storedTheme]);

  return (
    <html lang="en">
      <body>
        <AppContext.Provider value={{ ...state, dispatch }}>
          <SpeedInsights route={pathname} />
          <ThemeProvider themeId={state.theme}>
            <LazyMotion features={domAnimation}>
              <Fragment>
                <Navbar />
                <main className={styles.app} tabIndex={-1} id="MainContent">
                  <AnimatePresence>
                    <m.div
                      key={pathname}
                      className={styles.page}
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
                      <Analytics />
                      <div id="portal-root" />
                    </m.div>
                  </AnimatePresence>
                </main>
              </Fragment>
            </LazyMotion>
          </ThemeProvider>
        </AppContext.Provider>
      </body>
    </html>
  );
}
