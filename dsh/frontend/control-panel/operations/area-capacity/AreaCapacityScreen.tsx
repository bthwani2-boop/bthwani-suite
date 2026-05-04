 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { AREA_CAPACITY_PREVIEW } from '../operations.preview-data';

export type AreaCapacityScreenProps = {
  hubHref: string;
};

export function AreaCapacityScreen({ hubHref }: AreaCapacityScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(AREA_CAPACITY_PREVIEW.areas[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Area capacity"
        description="Capacity pressure and reserved windows stay readable before the lane overflows."
        badges={['DSH', 'Capacity', 'Control']}
        metaItems={['Capacity pressure', 'Reserved windows', 'Peak mode']}
        primaryAction={{ label: 'Open peak mode', href: '/operations?workspace=dispatch-assignment' }}
        secondaryAction={{ label: 'Open exceptions', href: '/operations?workspace=exceptions-escalations' }}
        signals={AREA_CAPACITY_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={AREA_CAPACITY_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={AREA_CAPACITY_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={AREA_CAPACITY_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Area queue"
        purpose="Move the selected area to the right owning lane before pressure becomes a bottleneck."
        items={AREA_CAPACITY_PREVIEW.areas as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=dispatch-assignment')}
        evidenceAction={() => window.location.assign('/operations?workspace=exceptions-escalations')}
      />
    </React.Fragment>
  );
}

export default AreaCapacityScreen;