// Mobile-specific providers (if any)
import { ReactNode } from 'react';

export function BthMobileProviders({ children }: { children: ReactNode }) {
  // Reserved extension point for mobile-only root providers.
  return <>{children}</>;
}
