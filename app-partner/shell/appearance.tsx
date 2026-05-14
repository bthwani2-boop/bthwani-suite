import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  defaultBThwaniAppearanceMode,
  getBThwaniAppearanceStorageKey,
  isBThwaniAppearanceMode,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const APP_PARTNER_APPEARANCE_STORAGE_KEY = getBThwaniAppearanceStorageKey('app-partner');

type AppPartnerAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const AppPartnerAppearanceContext = React.createContext<AppPartnerAppearanceContextValue | null>(null);

export function AppPartnerAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(defaultBThwaniAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    void AsyncStorage.getItem(APP_PARTNER_APPEARANCE_STORAGE_KEY)
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
    void AsyncStorage.setItem(APP_PARTNER_APPEARANCE_STORAGE_KEY, nextMode).catch(() => {
      // Keep the in-memory appearance active even if persistence fails.
    });
  }, []);

  const value = React.useMemo<AppPartnerAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return <AppPartnerAppearanceContext.Provider value={value}>{children}</AppPartnerAppearanceContext.Provider>;
}

export function useAppPartnerAppearance() {
  const context = React.useContext(AppPartnerAppearanceContext);

  if (!context) {
    throw new Error('useAppPartnerAppearance must be used within AppPartnerAppearanceProvider.');
  }

  return context;
}
