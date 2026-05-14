import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceStorageKey,
  isBThwaniAppearanceMode,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const APP_CAPTAIN_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('app-captain');

type AppCaptainAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const AppCaptainAppearanceContext = React.createContext<AppCaptainAppearanceContextValue | null>(null);

export function AppCaptainAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(defaultBThwaniAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    void AsyncStorage.getItem(APP_CAPTAIN_APPEARANCE_STORAGE_KEY)
      .then((storedMode) => {
        if (!mounted || !isBThwaniAppearanceMode(storedMode)) {
          return;
        }

        setModeState(storedMode);
      })
      .finally(() => {
        if (mounted) {
          setHydrated(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = React.useCallback((nextMode: BThwaniAppearanceMode) => {
    setModeState((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
    void AsyncStorage.setItem(APP_CAPTAIN_APPEARANCE_STORAGE_KEY, nextMode).catch(() => {
      // Keep the in-memory appearance active even if persistence fails.
    });
  }, []);

  const value = React.useMemo<AppCaptainAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return <AppCaptainAppearanceContext.Provider value={value}>{children}</AppCaptainAppearanceContext.Provider>;
}

export function useAppCaptainAppearance() {
  const context = React.useContext(AppCaptainAppearanceContext);

  if (!context) {
    throw new Error('useAppCaptainAppearance must be used within AppCaptainAppearanceProvider.');
  }

  return context;
}
