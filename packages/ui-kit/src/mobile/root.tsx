import React, { type ReactNode } from 'react';
import { BthUiKitProvider, type BthUiKitConfig } from '../providers';

export type BthMobileRootProps = {
  children: ReactNode;
  config?: Partial<BthUiKitConfig>;
};

export function BthMobileRoot({ children, config }: BthMobileRootProps) {
  return <BthUiKitProvider config={config}>{children}</BthUiKitProvider>;
}

export const BthMobileProviders = BthMobileRoot;
