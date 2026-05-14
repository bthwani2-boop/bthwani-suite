'use client';

import React from 'react';
import {
  BThwaniAppearanceProvider,
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceStorageKey,
  getBThwaniAppearanceThemeMode,
  isBThwaniAppearanceMode,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const CONTROL_PANEL_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('control-panel');

type ControlPanelAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const ControlPanelAppearanceContext = React.createContext<ControlPanelAppearanceContextValue | null>(null);

function resolveInitialAppearanceMode() {
  if (typeof document !== 'undefined') {
    const themeMode = document.documentElement.getAttribute('data-bth-theme');
    if (themeMode === 'dark') {
      return 'darkGlass' satisfies BThwaniAppearanceMode;
    }
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

export function ControlPanelAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(resolveInitialAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    try {
      const storedMode = window.localStorage.getItem(CONTROL_PANEL_APPEARANCE_STORAGE_KEY);
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
  }, [mode]);

  const setMode = React.useCallback((nextMode: BThwaniAppearanceMode) => {
    setModeState((currentMode) => (currentMode === nextMode ? currentMode : nextMode));

    try {
      window.localStorage.setItem(CONTROL_PANEL_APPEARANCE_STORAGE_KEY, nextMode);
    } catch {
      // Keep the in-memory appearance active even if persistence fails.
    }
  }, []);

  const value = React.useMemo<ControlPanelAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return (
    <ControlPanelAppearanceContext.Provider value={value}>
      <BThwaniAppearanceProvider mode={mode}>{children}</BThwaniAppearanceProvider>
    </ControlPanelAppearanceContext.Provider>
  );
}

export function useControlPanelAppearance() {
  const context = React.useContext(ControlPanelAppearanceContext);

  if (!context) {
    throw new Error('useControlPanelAppearance must be used within ControlPanelAppearanceProvider.');
  }

  return context;
}
