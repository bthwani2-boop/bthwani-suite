'use client';

import React from 'react';
import { StateView } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshOrdersScreen } from '../orders';
import { resolveOperationsStateCopy, type OperationsViewState } from '../operations.state';
import { useDshControlPanelText } from '../shared';
import type { OperationsPanelId } from '../operations.types';

export type OrdersLaneProps = {
  state?: OperationsViewState;
  hubHref: string;
  orderId?: string;
  panel?: OperationsPanelId;
};

export function OrdersLane({ state = 'ready', hubHref, orderId, panel }: OrdersLaneProps) {
  const text = useDshControlPanelText();

  if (state !== 'ready') {
    return <StateView {...resolveOperationsStateCopy(text, state)} />;
  }

  return (
    <WebSectionCard
      title="Orders lane"
      description="Orders queue, order detail, and order chat are unified here as panels instead of separate workspaces."
    >
      <ControlPanelDshOrdersScreen
        embedded
        showHeader={false}
        hubHref={hubHref}
        operationsHref={hubHref}
        initialSelectedOrderId={orderId ?? null}
        initialOverlayMode={panel ?? null}
      />
    </WebSectionCard>
  );
}

export default OrdersLane;