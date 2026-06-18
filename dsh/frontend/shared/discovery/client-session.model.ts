// Canonical location: dsh/frontend/shared/discovery/client-session.model.ts
// Authority: dsh/frontend/shared/discovery — client session model.
// No JSX. No ui-kit. No Tamagui.

import type { DshClientAppearance } from './useDshClientSurfaceModel';

export type ClientSessionModelProps = {
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  appearance: DshClientAppearance;
  bellSignalEvents: any;
  walletSession: any;
};

export function useDshClientSessionModel({
  dshAuthBearerToken,
  dshClientId,
  appearance,
  bellSignalEvents,
  walletSession,
}: ClientSessionModelProps) {
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = appearance;

  return {
    dshAuthBearerToken,
    dshClientId,
    appearanceHydrated,
    appearanceMode,
    setAppearanceMode,
    bellSignalEvents,
    walletSession,
  };
}
