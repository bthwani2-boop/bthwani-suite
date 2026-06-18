// Canonical location: dsh/frontend/shared/discovery/client-navigation.model.ts
// Authority: dsh/frontend/shared/discovery — client navigation and route context model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshRoute } from '../checkout/dsh-client-binding.contracts';
import type { ClientOperationScreenId } from '../checkout/dsh-client-binding.contracts';

export type ClientNavigationModelProps = {
  route: DshRoute;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  handleRegisterBackHandler: (handler: (() => boolean) | null) => void;
  openCreateOrderJourney: () => void;
  openTrackedOrder: (orderId?: string, overrides?: any) => void;
  setSelectedOperationScreen: React.Dispatch<React.SetStateAction<ClientOperationScreenId | null>>;
  selectedOperationScreen: ClientOperationScreenId | null;
  onExit?: () => void;
  openSupportFlow: () => void;
  serviceDialTrigger: any;
  onOpenService?: (serviceId: string) => void;
};

export function useDshClientNavigationModel({
  route,
  setRoute,
  handleRegisterBackHandler,
  openCreateOrderJourney,
  openTrackedOrder,
  setSelectedOperationScreen,
  selectedOperationScreen,
  onExit,
  openSupportFlow,
  serviceDialTrigger,
  onOpenService,
}: ClientNavigationModelProps) {
  const returnHome = React.useCallback(() => setRoute('home'), [setRoute]);

  return {
    route,
    setRoute,
    returnHome,
    openCreateOrderJourney,
    openTrackedOrder,
    setSelectedOperationScreen,
    selectedOperationScreen,
    onExit,
    openSupportFlow,
    handleRegisterBackHandler,
    serviceDialTrigger,
    onOpenService,
  };
}
