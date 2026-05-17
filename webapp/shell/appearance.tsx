'use client';

import React from 'react';
import {
  BThwaniAppearanceProvider,
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceStorageKey,
  getBThwaniAppearanceThemeMode,
  isBThwaniAppearanceMode,
  syncBThwaniAppearanceCookie,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const WEBAPP_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('webapp');

type WebAppAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const WebAppAppearanceContext = React.createContext<WebAppAppearanceContextValue | null>(null);

function resolveInitialAppearanceMode() {
  if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bth-theme') === 'dark') {
    return 'darkGlass' satisfies BThwaniAppearanceMode;
  }

  return defaultBThwaniAppearanceMode;
}

function syncWebAppearance(mode: BThwaniAppearanceMode) {
  if (typeof document === 'undefined') {
    return;
  }

  const themeMode = getBThwaniAppearanceThemeMode(mode);
  const targets = [document.documentElement, document.body].filter(Boolean) as HTMLElement[];

  for (const target of targets) {
    target.setAttribute('data-bth-root', 'true');
    target.setAttribute('data-bth-theme', themeMode);
    target.setAttribute('data-ui-theme', themeMode);
  }

  document.documentElement.style.colorScheme = themeMode === 'dark' ? 'dark' : 'light';
}

export function WebAppAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(resolveInitialAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    try {
      const storedMode = window.localStorage.getItem(WEBAPP_APPEARANCE_STORAGE_KEY);
      if (mounted && isBThwaniAppearanceMode(storedMode)) {
        setModeState(storedMode);
      }
    } catch {
      // Keep the bootstrap-resolved mode when storage is not available.
    } finally {
      if (mounted) {
        setHydrated(true);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    syncWebAppearance(mode);
    syncBThwaniAppearanceCookie('webapp', mode);
  }, [mode]);

  const setMode = React.useCallback((nextMode: BThwaniAppearanceMode) => {
    setModeState((currentMode) => (currentMode === nextMode ? currentMode : nextMode));

    try {
      window.localStorage.setItem(WEBAPP_APPEARANCE_STORAGE_KEY, nextMode);
    } catch {
      // Keep the in-memory appearance active even if persistence fails.
    }

    syncBThwaniAppearanceCookie('webapp', nextMode);
  }, []);

  const value = React.useMemo<WebAppAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return (
    <WebAppAppearanceContext.Provider value={value}>
      <BThwaniAppearanceProvider mode={mode}>{children}</BThwaniAppearanceProvider>
    </WebAppAppearanceContext.Provider>
  );
}

export function useWebAppAppearance() {
  const context = React.useContext(WebAppAppearanceContext);

  if (!context) {
    throw new Error('useWebAppAppearance must be used within WebAppAppearanceProvider.');
  }

  return context;
}
