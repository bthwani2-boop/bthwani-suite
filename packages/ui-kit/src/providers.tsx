import React, { createContext, useContext, type ReactNode } from 'react';
import { bthDefaultDirection, bthDefaultLocale, type BthDirection, type BthLocale } from './foundation';

export type BthUiKitConfig = {
  locale: BthLocale;
  direction: BthDirection;
};

export type BthUiKitProviderProps = {
  children: ReactNode;
  config?: Partial<BthUiKitConfig>;
};

const defaultConfig: BthUiKitConfig = {
  locale: bthDefaultLocale,
  direction: bthDefaultDirection,
};

const BthUiKitContext = createContext<BthUiKitConfig>(defaultConfig);

export function BthUiKitProvider({ children, config }: BthUiKitProviderProps) {
  const value: BthUiKitConfig = {
    locale: config?.locale ?? defaultConfig.locale,
    direction: config?.direction ?? defaultConfig.direction,
  };

  return <BthUiKitContext.Provider value={value}>{children}</BthUiKitContext.Provider>;
}

export function useBthUiKit() {
  return useContext(BthUiKitContext);
}

export const BthRootProviders = BthUiKitProvider;
