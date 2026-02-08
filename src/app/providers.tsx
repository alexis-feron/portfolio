'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { initialState, reducer } from 'app/reducer';
import { Navbar } from 'components/layout/Navbar/Navbar';
import { ThemeProvider } from 'components/layout/ThemeProvider/ThemeProvider';
import { LazyMotion, domAnimation } from 'framer-motion';
import { useLocalStorage } from 'hooks';
import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';

interface AppState {
  theme?: string;
  menuOpen: boolean;
}

interface AppAction {
  type: string;
  value?: string;
}

interface AppContextType extends AppState {
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType>({
  menuOpen: false,
  dispatch: () => {},
});

export function Providers({ children }: { children: ReactNode }) {
  const [storedTheme] = useLocalStorage<string>('theme', 'dark');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'setTheme', value: storedTheme || 'dark' });
  }, [storedTheme]);

  useEffect(() => {
    console.info(
      `\nTaking a peek huh? Check out the source code: https://github.com/alexis-feron/portfolio\n\n`
    );
  }, []);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <SpeedInsights />
      <ThemeProvider themeId={state.theme}>
        <LazyMotion features={domAnimation}>
          <Navbar />
          <main
            className="w-full relative grid grid-cols-[100%] grid-rows-[100%]"
            tabIndex={-1}
            id="MainContent"
          >
            {children}
            <Analytics />
          </main>
        </LazyMotion>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
