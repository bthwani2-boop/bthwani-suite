import React from 'react';

export interface FeatureFlagsConfig {
  'DSH:sanaa-pilot': boolean;
  'DSH:capability:store-pickup': boolean;
  'DSH:capability:awnak': boolean;
  [key: string]: boolean;
}

const DEFAULT_FLAGS: FeatureFlagsConfig = {
  'DSH:sanaa-pilot': true,
  'DSH:capability:store-pickup': false,
  'DSH:capability:awnak': true,
};

export class FeatureFlagsRegistry {
  private static flags: FeatureFlagsConfig = { ...DEFAULT_FLAGS };
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof process !== 'undefined' && process.env) {
      const env = process.env;

      const parseBool = (val: string | undefined, defaultVal: boolean): boolean => {
        if (!val) return defaultVal;
        const normalized = val.trim().toLowerCase();
        return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
      };

      this.flags['DSH:sanaa-pilot'] = parseBool(
        env.EXPO_PUBLIC_FLAG_SANAA_PILOT ?? env.NEXT_PUBLIC_FLAG_SANAA_PILOT,
        DEFAULT_FLAGS['DSH:sanaa-pilot']
      );

      this.flags['DSH:capability:store-pickup'] = parseBool(
        env.EXPO_PUBLIC_FLAG_STORE_PICKUP ?? env.NEXT_PUBLIC_FLAG_STORE_PICKUP,
        DEFAULT_FLAGS['DSH:capability:store-pickup']
      );

      this.flags['DSH:capability:awnak'] = parseBool(
        env.EXPO_PUBLIC_FLAG_AWNAK ?? env.NEXT_PUBLIC_FLAG_AWNAK,
        DEFAULT_FLAGS['DSH:capability:awnak']
      );
    }
  }

  public static get(key: string): boolean {
    if (!this.initialized) {
      this.initialize();
    }
    return this.flags[key] ?? false;
  }

  public static getAll(): FeatureFlagsConfig {
    if (!this.initialized) {
      this.initialize();
    }
    return { ...this.flags };
  }

  public static override(newFlags: Partial<FeatureFlagsConfig>): void {
    this.flags = { ...this.flags, ...newFlags };
  }
}

const FeatureFlagContext = React.createContext<FeatureFlagsConfig>(DEFAULT_FLAGS);

export interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const [flags, setFlags] = React.useState<FeatureFlagsConfig>(() => {
    FeatureFlagsRegistry.initialize();
    return FeatureFlagsRegistry.getAll();
  });

  React.useEffect(() => {
    const handleOverride = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; enabled: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.key === 'string') {
        const { key, enabled } = customEvent.detail;
        FeatureFlagsRegistry.override({ [key]: enabled });
        setFlags(FeatureFlagsRegistry.getAll());
      }
    };

    // Only subscribe on web — React Native has a `window` global but
    // does not implement DOM event APIs (addEventListener is undefined).
    if (
      typeof window !== 'undefined' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('dsh-flag-override', handleOverride);
      return () => {
        window.removeEventListener('dsh-flag-override', handleOverride);
      };
    }
  }, []);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flag: string): boolean {
  const flags = React.useContext(FeatureFlagContext);
  return flags[flag] ?? false;
}
