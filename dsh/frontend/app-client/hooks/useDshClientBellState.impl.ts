// Canonical location: dsh/frontend/app-client/hooks/useDshClientBellState.impl.ts
// Authority: dsh/frontend/app-client — surface-specific bell state hook.
// Depends on DshRoute (surface type) — must NOT live in shared.

import React from 'react';
import type { DshRoute } from '../dsh-client.types';
import type { DshSignalSummary } from '../../shared/marketing/dsh-signal-layer.model';
import { getDshSignalSummaries } from '../../shared/marketing/dsh-signal-layer.model';

type CheckoutAuth = { bearerToken?: string; clientId?: string };

type UseDshClientBellStateOptions = {
  route: DshRoute;
  dshApiBaseUrl: string | undefined;
  checkoutAuth: CheckoutAuth;
  setRoute: (route: DshRoute) => void;
};

type ClientOperationScreenId = 'support' | 'benefits' | 'service-launcher';

export function useDshClientBellState({
  route: _route,
  dshApiBaseUrl: _dshApiBaseUrl,
  checkoutAuth: _checkoutAuth,
  setRoute,
}: UseDshClientBellStateOptions) {
  // Client-surface signal summaries from the local signal layer.
  // Lean list entries only — detail loaded on explicit open.
  const bellSignalEvents = React.useMemo<readonly DshSignalSummary[]>(
    () => getDshSignalSummaries('app-client', 'client'),
    [],
  );

  const [selectedOperationScreen, setSelectedOperationScreen] =
    React.useState<ClientOperationScreenId | null>(null);
  const [serviceDialTrigger, setServiceDialTrigger] = React.useState<number>(0);

  const handleServiceLauncherPress = React.useCallback(() => {
    setServiceDialTrigger((t) => t + 1);
  }, []);

  const handleOpenHomeBenefits = React.useCallback(() => {
    setRoute('benefits' as DshRoute);
  }, [setRoute]);

  const openSupportFlow = React.useCallback(() => {
    setSelectedOperationScreen('support');
  }, []);

  return {
    bellSignalEvents,
    selectedOperationScreen,
    setSelectedOperationScreen,
    serviceDialTrigger,
    handleServiceLauncherPress,
    handleOpenHomeBenefits,
    openSupportFlow,
  } as const;
}
