import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  BThwaniAppearanceProvider,
  defaultBThwaniAppearanceMode,
  type BThwaniAppearanceMode,
} from '@bthwani/ui-kit';

const APP_CLIENT_APPEARANCE_STORAGE_KEY = '@bthwani/app-client/appearance-mode';

type AppClientAppearanceContextValue = {
  hydrated: boolean;
  mode: BThwaniAppearanceMode;
  setMode: (mode: BThwaniAppearanceMode) => void;
};

const AppClientAppearanceContext = React.createContext<AppClientAppearanceContextValue | null>(null);

function isAppearanceMode(value: string | null): value is BThwaniAppearanceMode {
  return value === 'lightPremium' || value === 'darkGlass';
}

export function AppClientAppearanceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<BThwaniAppearanceMode>(defaultBThwaniAppearanceMode);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    void AsyncStorage.getItem(APP_CLIENT_APPEARANCE_STORAGE_KEY)
      .then((storedMode) => {
        if (!mounted || !isAppearanceMode(storedMode)) {
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
    void AsyncStorage.setItem(APP_CLIENT_APPEARANCE_STORAGE_KEY, nextMode).catch(() => {
      // Keep the in-memory appearance active even if persistence fails.
    });
  }, []);

  const value = React.useMemo<AppClientAppearanceContextValue>(() => ({
    hydrated,
    mode,
    setMode,
  }), [hydrated, mode, setMode]);

  return (
    <AppClientAppearanceContext.Provider value={value}>
      <BThwaniAppearanceProvider mode={mode} syncThemeMode={false}>
        {children}
      </BThwaniAppearanceProvider>
    </AppClientAppearanceContext.Provider>
  );
}

export function useAppClientAppearance() {
  const context = React.useContext(AppClientAppearanceContext);

  if (!context) {
    throw new Error('useAppClientAppearance must be used within AppClientAppearanceProvider.');
  }

  return context;
}
