"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* -------------------------------------------------------------------------
   Store
   -------------------------------------------------------------------------
   localStorage is the source of truth, not the DOM. Switching locale makes
   Next re-render the [locale] layout — which is the root layout — and that
   resets every attribute on <html> to its server value, wiping the class the
   bootstrap script added. Reading the theme back from the DOM would therefore
   "forget" it on every language change.
   ------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
let cached: Theme | null = null;

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage can be unavailable in private mode - non blocking */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Must be stable between notifications, hence the cache. */
function getSnapshot(): Theme {
  if (cached === null) cached = readTheme();
  return cached;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep tabs in sync with each other.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function writeTheme(theme: Theme) {
  cached = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* non blocking */
  }
  listeners.forEach((listener) => listener());
}

function paintTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

/** `useLayoutEffect` warns during SSR; this keeps it silent on the server. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Runs on every commit, so the class is restored in the same frame Next wipes
  // it — before paint, so a language switch never flashes the wrong theme.
  useIsomorphicLayoutEffect(() => {
    paintTheme(theme);
  });

  const setTheme = useCallback((next: Theme) => {
    const commit = () => {
      writeTheme(next);
      paintTheme(next);
    };

    // Cross-fade the whole page when the browser supports it.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        finished: Promise<void>;
        ready: Promise<void>;
        updateCallbackDone: Promise<void>;
      };
    };
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!doc.startViewTransition || reduced) {
      commit();
      return;
    }

    const transition = doc.startViewTransition(commit);

    // Interrupting one transition with another rejects these promises; the
    // theme is already applied either way, so swallow it rather than let it
    // surface as an unhandled rejection.
    const ignore = () => {};
    transition.finished.catch(ignore);
    transition.ready.catch(ignore);
    transition.updateCallbackDone.catch(ignore);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider");
  return context;
}
