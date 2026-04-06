import React, { createContext, useContext, useMemo } from 'react';
import { darkTheme, lightTheme, type SemanticTheme, type ThemeMode } from '../foundation/themes';

type ThemeContextValue = {
  mode: ThemeMode;
  theme: SemanticTheme;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  theme: lightTheme
});

export type ThemeProviderProps = {
  mode?: ThemeMode;
  children: React.ReactNode;
};

export function ThemeProvider({ mode = 'light', children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => ({ mode, theme: mode === 'dark' ? darkTheme : lightTheme }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
