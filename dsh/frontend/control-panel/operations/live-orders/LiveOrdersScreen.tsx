 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { LIVE_ORDERS_PREVIEW } from '../operations.preview-data';

export type LiveOrdersScreenProps = {
  hubHref: string;
};

export function LiveOrdersScreen({ hubHref }: LiveOrdersScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(LIVE_ORDERS_PREVIEW.orders[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Live orders"
        description="Queue, detail, and chat remain in one live operations lane."
        badges={['DSH', 'Live', 'Orders']}
        metaItems={['Order queue', 'Detail panel', 'Chat panel']}
        primaryAction={{ label: 'Open dispatch assignment', href: '/operations?workspace=dispatch-assignment' }}
        secondaryAction={{ label: 'Open audit support', href: '/operations?workspace=audit-support-sla' }}
        signals={LIVE_ORDERS_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={LIVE_ORDERS_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={LIVE_ORDERS_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={LIVE_ORDERS_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Order queue"
        purpose="Inspect the live queue and push the selected order to the right owning surface."
        items={LIVE_ORDERS_PREVIEW.orders as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=command-center')}
        evidenceAction={() => window.location.assign('/operations?workspace=audit-support-sla')}
      />
    </React.Fragment>
  );
}

export default LiveOrdersScreen;