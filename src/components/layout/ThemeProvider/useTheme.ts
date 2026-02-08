import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import type { ThemeColors } from './theme';

export function useTheme(): ThemeColors {
  const currentTheme = useContext(ThemeContext);
  return currentTheme;
}
