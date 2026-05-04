 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { PARTNER_STORES_PREVIEW } from '../operations.preview-data';

export type PartnerStoresScreenProps = {
  hubHref: string;
};

export function PartnerStoresScreen({ hubHref }: PartnerStoresScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(PARTNER_STORES_PREVIEW.stores[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Partner stores"
        description="Store readiness, prep pressure, and intake blockers stay explicit in one lane."
        badges={['DSH', 'Stores', 'Readiness']}
        metaItems={['Store readiness', 'Prep pressure', 'Intake blockers']}
        primaryAction={{ label: 'Open live orders', href: '/operations?workspace=live-orders' }}
        secondaryAction={{ label: 'Open dispatch assignment', href: '/operations?workspace=dispatch-assignment' }}
        signals={PARTNER_STORES_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={PARTNER_STORES_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={PARTNER_STORES_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={PARTNER_STORES_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Store queue"
        purpose="Track readiness and return each store to the owning operational lane when needed."
        items={PARTNER_STORES_PREVIEW.stores as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=dispatch-assignment')}
        evidenceAction={() => window.location.assign('/operations?workspace=live-orders')}
      />
    </React.Fragment>
  );
}

export default PartnerStoresScreen;