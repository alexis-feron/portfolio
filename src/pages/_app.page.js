import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Navbar } from 'components/Navbar';
import { ThemeProvider } from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useFoucFix, useLocalStorage } from 'hooks';
import styles from 'layouts/App/App.module.css';
import 'layouts/App/global.css';
import { initialState, reducer } from 'layouts/App/reducer';
import 'layouts/App/reset.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, createContext, useEffect, useReducer } from 'react';
import { msToNum } from 'utils/style';
import { ScrollRestore } from '../layouts/App/ScrollRestore';

export const AppContext = createContext({});

const repoPrompt = `
\nTaking a peek huh? Check out the source code: https://github.com/alexis-feron/portfolio
`;

const App = ({ Component, pageProps }) => {
  const isClient = typeof window !== 'undefined';
  const [storedTheme] = useLocalStorage('theme', isClient ? 'dark' : null);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { route, asPath } = useRouter();
  const canonicalRoute = route === '/' ? '' : `${asPath}`;
  const router = useRouter();

  useFoucFix();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.info(`${repoPrompt}\n\n`);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      dispatch({ type: 'setTheme', value: storedTheme || 'dark' });
    }
  }, [storedTheme]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <SpeedInsights route={router.pathname} />
      <ThemeProvider themeId={state.theme}>
        <LazyMotion features={domAnimation}>
          <Fragment>
            <Head>
              <link
                rel="canonical"
                href={`${
                  process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://alexis-feron.com'
                }${canonicalRoute}`}
              />
            </Head>
            <Navbar />
            <main className={styles.app} tabIndex={-1} id="MainContent">
              <AnimatePresence>
                <m.div
                  key={route}
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
                  <Component {...pageProps} />
                  <Analytics />
                </m.div>
              </AnimatePresence>
            </main>
          </Fragment>
        </LazyMotion>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
