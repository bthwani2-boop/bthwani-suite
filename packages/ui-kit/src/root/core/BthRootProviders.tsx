// Root provider composition for all UI context (theme, direction, etc.)
import { ReactNode } from 'react';
import { UiKitProvider } from '../../providers/UiKitProvider';
import type { BthRootConfig } from './BthRootConfig';
import { BTH_ROOT_DEFAULTS } from './BthRootDefaults';

export interface BthRootProvidersProps extends BthRootConfig {
  children: ReactNode;
}

export function BthRootProviders({ children, language, themeMode }: BthRootProvidersProps) {
  return (
    <UiKitProvider
      language={language ?? BTH_ROOT_DEFAULTS.language}
      themeMode={themeMode ?? BTH_ROOT_DEFAULTS.themeMode}
    >
      {children}
    </UiKitProvider>
  );
}
