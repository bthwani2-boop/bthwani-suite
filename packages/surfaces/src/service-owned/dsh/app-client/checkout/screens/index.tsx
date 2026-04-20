import React from 'react';
import { DshIntakeHubScreen as DshIntakeHubPlaceholder, DshOrdersListScreen, DshCreateOrderScreen, DshOrderSuccessState, DshTrackingScreen, DshDeliveryManagementHubScreen } from './checkoutTracking';

export type DshIntakeHubScreenProps = {
  screenId: string;
  [key: string]: any;
};

export function DshIntakeHubScreen(_props: DshIntakeHubScreenProps) {
  return <DshIntakeHubPlaceholder />;
}

export {
  DshOrdersListScreen,
  DshCreateOrderScreen,
  DshOrderSuccessState,
  DshTrackingScreen,
  DshDeliveryManagementHubScreen,
};