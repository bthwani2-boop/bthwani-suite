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

const WEBSITE_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('website');

type WebsiteAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const WebsiteAppearanceContext = React.createContext<WebsiteAppearanceContextValue | null>(null);

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

export function WebsiteAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(resolveInitialAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    try {
      const storedMode = window.localStorage.getItem(WEBSITE_APPEARANCE_STORAGE_KEY);
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
    syncBThwaniAppearanceCookie('website', mode);
  }, [mode]);

  const setMode = React.useCallback((nextMode: BThwaniAppearanceMode) => {
    setModeState((currentMode) => (currentMode === nextMode ? currentMode : nextMode));

    try {
      window.localStorage.setItem(WEBSITE_APPEARANCE_STORAGE_KEY, nextMode);
    } catch {
      // Keep the in-memory appearance active even if persistence fails.
    }

    syncBThwaniAppearanceCookie('website', nextMode);
  }, []);

  const value = React.useMemo<WebsiteAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return (
    <WebsiteAppearanceContext.Provider value={value}>
      <BThwaniAppearanceProvider mode={mode}>{children}</BThwaniAppearanceProvider>
    </WebsiteAppearanceContext.Provider>
  );
}

export function useWebsiteAppearance() {
  const context = React.useContext(WebsiteAppearanceContext);

  if (!context) {
    throw new Error('useWebsiteAppearance must be used within WebsiteAppearanceProvider.');
  }

  return context;
}
