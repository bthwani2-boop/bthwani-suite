import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceStorageKey,
  isBThwaniAppearanceMode,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const APP_FIELD_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('app-field');

type AppFieldAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const AppFieldAppearanceContext = React.createContext<AppFieldAppearanceContextValue | null>(null);

export function AppFieldAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(defaultBThwaniAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    void AsyncStorage.getItem(APP_FIELD_APPEARANCE_STORAGE_KEY)
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
    void AsyncStorage.setItem(APP_FIELD_APPEARANCE_STORAGE_KEY, nextMode).catch(() => {
      // Keep the in-memory appearance active even if persistence fails.
    });
  }, []);

  const value = React.useMemo<AppFieldAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return <AppFieldAppearanceContext.Provider value={value}>{children}</AppFieldAppearanceContext.Provider>;
}

export function useAppFieldAppearance() {
  const context = React.useContext(AppFieldAppearanceContext);

  if (!context) {
    throw new Error('useAppFieldAppearance must be used within AppFieldAppearanceProvider.');
  }

  return context;
}
