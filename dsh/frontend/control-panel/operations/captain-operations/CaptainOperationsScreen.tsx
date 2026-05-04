 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { CAPTAIN_OPERATIONS_PREVIEW } from '../operations.preview-data';

export type CaptainOperationsScreenProps = {
  hubHref: string;
};

export function CaptainOperationsScreen({ hubHref }: CaptainOperationsScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(CAPTAIN_OPERATIONS_PREVIEW.captains[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Captain operations"
        description="Crew readiness and captain pressure stay visible before assignment changes."
        badges={['DSH', 'Crew', 'Capacity']}
        metaItems={['Crew roster', 'Readiness', 'Coverage pressure']}
        primaryAction={{ label: 'Open dispatch assignment', href: '/operations?workspace=dispatch-assignment' }}
        secondaryAction={{ label: 'Open area capacity', href: '/operations?workspace=area-capacity' }}
        signals={CAPTAIN_OPERATIONS_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={CAPTAIN_OPERATIONS_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={CAPTAIN_OPERATIONS_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={CAPTAIN_OPERATIONS_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Captain roster"
        purpose="Keep captain readiness visible and route the selected row to the owning surface."
        items={CAPTAIN_OPERATIONS_PREVIEW.captains as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=dispatch-assignment')}
        evidenceAction={() => window.location.assign('/operations?workspace=area-capacity')}
      />
    </React.Fragment>
  );
}

export default CaptainOperationsScreen;