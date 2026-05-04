 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { DISPATCH_ASSIGNMENT_PREVIEW } from '../operations.preview-data';

export type DispatchAssignmentScreenProps = {
  hubHref: string;
};

export function DispatchAssignmentScreen({ hubHref }: DispatchAssignmentScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(DISPATCH_ASSIGNMENT_PREVIEW.assignments[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Dispatch assignment"
        description="Manual assignment, captain coverage, and peak mode are coordinated here."
        badges={['DSH', 'Dispatch', 'Assignment']}
        metaItems={['Assignment queue', 'Captain pool', 'Coverage pressure']}
        primaryAction={{ label: 'Open area capacity', href: '/operations?workspace=area-capacity' }}
        secondaryAction={{ label: 'Open captain operations', href: '/operations?workspace=captain-operations' }}
        signals={DISPATCH_ASSIGNMENT_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={DISPATCH_ASSIGNMENT_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={DISPATCH_ASSIGNMENT_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={DISPATCH_ASSIGNMENT_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Assignment queue"
        purpose="Keep the assignment decision visible and move each row to the next canonical surface."
        items={DISPATCH_ASSIGNMENT_PREVIEW.assignments as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=area-capacity')}
        evidenceAction={() => window.location.assign('/operations?workspace=captain-operations')}
      />
    </React.Fragment>
  );
}

export default DispatchAssignmentScreen;