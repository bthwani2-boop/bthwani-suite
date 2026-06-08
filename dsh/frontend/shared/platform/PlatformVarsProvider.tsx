import React from 'react';

export interface PlatformVarsConfig {
  dshApiBaseUrl: string | null;
  dshAuthBearerToken: string | null;
  dshClientId: string | null;
  mediaBaseUrl: string | null;
  devMediaBaseUrl: string | null;
  captainWalletBalanceThreshold: string;
  dshVisibilityRegionSanaa: string;
  partnerAcceptanceTimeoutSecs: string;
  dispatchSearchRadiusKm: string;
  partnerSettlementSchedule: string;
}

const DEFAULT_VARS: PlatformVarsConfig = {
  dshApiBaseUrl: null,
  dshAuthBearerToken: null,
  dshClientId: null,
  mediaBaseUrl: null,
  devMediaBaseUrl: null,
  captainWalletBalanceThreshold: '10,000 ريال',
  dshVisibilityRegionSanaa: 'مفعّل',
  partnerAcceptanceTimeoutSecs: '90 ثانية',
  dispatchSearchRadiusKm: '3.5 كم',
  partnerSettlementSchedule: 'كل أحد 10:00 ص',
};

// Static registry to allow non-React contexts to read values synchronously without context
export class PlatformVarsRegistry {
  private static config: PlatformVarsConfig = { ...DEFAULT_VARS };
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof process !== 'undefined' && process.env) {
      const env = process.env;

      this.config.dshApiBaseUrl = (env.EXPO_PUBLIC_DSH_API_BASE_URL ?? env.NEXT_PUBLIC_DSH_API_BASE_URL ?? null)?.trim() || null;
      this.config.dshAuthBearerToken = (env.EXPO_PUBLIC_DSH_AUTH_BEARER_TOKEN ?? null)?.trim() || null;
      this.config.dshClientId = (env.EXPO_PUBLIC_DSH_CLIENT_ID ?? null)?.trim() || null;
      this.config.mediaBaseUrl = (env.EXPO_PUBLIC_MEDIA_BASE_URL ?? null)?.trim() || null;
      this.config.devMediaBaseUrl = (
        env.EXPO_PUBLIC_DEV_MEDIA_BASE_URL ??
        env.EXPO_PUBLIC_DEV_MEDIA_BASE ??
        env.NEXT_PUBLIC_DEV_MEDIA_BASE_URL ??
        env.NEXT_PUBLIC_DEV_MEDIA_BASE ??
        env.DEV_MEDIA_BASE_URL ??
        env.DEV_MEDIA_BASE ??
        null
      )?.trim() || null;

      if (env.VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE) {
        this.config.captainWalletBalanceThreshold = env.VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE;
      }
      if (env.VAR_DSH_VISIBILITY_REGION_SANAA) {
        this.config.dshVisibilityRegionSanaa = env.VAR_DSH_VISIBILITY_REGION_SANAA;
      }
      if (env.VAR_DSH_PARTNER_ACCEPTANCE_TIMEOUT_SECS) {
        this.config.partnerAcceptanceTimeoutSecs = env.VAR_DSH_PARTNER_ACCEPTANCE_TIMEOUT_SECS;
      }
      if (env.VAR_DSH_DISPATCH_SEARCH_RADIUS_KM) {
        this.config.dispatchSearchRadiusKm = env.VAR_DSH_DISPATCH_SEARCH_RADIUS_KM;
      }
      if (env.VAR_DSH_PARTNER_SETTLEMENT_SCHEDULE) {
        this.config.partnerSettlementSchedule = env.VAR_DSH_PARTNER_SETTLEMENT_SCHEDULE;
      }
    }
  }

  public static get<K extends keyof PlatformVarsConfig>(key: K): PlatformVarsConfig[K] {
    if (!this.initialized) {
      this.initialize();
    }
    return this.config[key];
  }

  public static getAll(): PlatformVarsConfig {
    if (!this.initialized) {
      this.initialize();
    }
    return { ...this.config };
  }

  public static override(newConfig: Partial<PlatformVarsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

const PlatformVarsContext = React.createContext<PlatformVarsConfig>(DEFAULT_VARS);

export interface PlatformVarsProviderProps {
  children: React.ReactNode;
}

export function PlatformVarsProvider({ children }: PlatformVarsProviderProps) {
  const [config] = React.useState<PlatformVarsConfig>(() => {
    PlatformVarsRegistry.initialize();
    return PlatformVarsRegistry.getAll();
  });

  return (
    <PlatformVarsContext.Provider value={config}>
      {children}
    </PlatformVarsContext.Provider>
  );
}

export function usePlatformVars(): PlatformVarsConfig {
  return React.useContext(PlatformVarsContext);
}
