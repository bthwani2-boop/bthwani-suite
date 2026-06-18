// Canonical location: dsh/frontend/shared/discovery/useDshClientBellState.ts
// Authority: dsh/frontend/shared/discovery — client surface bell and signal state.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshRoute, ClientOperationScreenId } from '../checkout/dsh-client-binding.contracts';
import type { DshSignalSummary } from '../marketing/dsh-signal-layer.model';
import { getDshSignalSummaries } from '../marketing/dsh-signal-layer.model';

type CheckoutAuth = { bearerToken?: string; clientId?: string };



type UseDshClientBellStateOptions = {
  route: DshRoute;
  dshApiBaseUrl: string | undefined;
  checkoutAuth: CheckoutAuth;
  setRoute: (route: DshRoute) => void;
};

export type { ClientOperationScreenId };

export function useDshClientBellState({
  route: _route,
  dshApiBaseUrl: _dshApiBaseUrl,
  checkoutAuth: _checkoutAuth,
  setRoute,
}: UseDshClientBellStateOptions) {
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
    setSelectedOperationScreen('order-issue-flag');
    setRoute('order-issue-workspace');
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
