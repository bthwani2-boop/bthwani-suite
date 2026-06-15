// Canonical location: dsh/frontend/shared/discovery/client-orders-topic.model.ts
// Authority: dsh/frontend/shared/discovery — client orders topic model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshNavigationCommand } from '../checkout/dsh-client-binding.contracts';
import { initialOrders, commandTargetToRoute, hostClientStates } from './client.navigation-bridge';

export type ClientOrdersTopicModelProps = {
  ordersTracking: any;
  command: DshNavigationCommand;
};

const defaultTrackingOrderId = initialOrders[0]?.id;

export function useDshClientOrdersTopicModel({
  ordersTracking,
  command,
}: ClientOrdersTopicModelProps) {
  const {
    filteredOrders,
    ordersQuery,
    setOrdersQuery,
    handleReorderClick,
    trackingClientState,
    setTrackingClientState,
    activeTrackedOrder,
    trackingWltIntent,
    liveOrderDetails,
    trackingOrderValues,
    trackingTimeline,
    reopenTracking,
    handleCancelOrder,
    handleSupportEscalation,
    returnOrdersList,
    setSelectedOrderId,
  } = ordersTracking;

  React.useEffect(() => {
    if (commandTargetToRoute(command.target) === 'tracking') {
      if (defaultTrackingOrderId) {
        setSelectedOrderId(defaultTrackingOrderId);
        setTrackingClientState(hostClientStates.trackingActive);
      }
    }
  }, [command, setSelectedOrderId, setTrackingClientState]);

  return {
    filteredOrders,
    ordersQuery,
    setOrdersQuery,
    handleReorderClick,
    trackingClientState,
    activeTrackedOrder,
    trackingWltIntent,
    liveOrderDetails,
    trackingOrderValues,
    trackingTimeline,
    reopenTracking,
    handleCancelOrder,
    handleSupportEscalation,
    returnOrdersList,
  };
}
