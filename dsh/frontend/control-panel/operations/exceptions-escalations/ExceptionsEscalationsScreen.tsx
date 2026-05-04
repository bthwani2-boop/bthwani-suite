 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { EXCEPTIONS_ESCALATIONS_PREVIEW } from '../operations.preview-data';

export type ExceptionsEscalationsScreenProps = {
  hubHref: string;
};

export function ExceptionsEscalationsScreen({ hubHref }: ExceptionsEscalationsScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(EXCEPTIONS_ESCALATIONS_PREVIEW.exceptions[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Exceptions and escalations"
        description="Exception recovery, owner routing, and SLA pressure stay visible in one lane."
        badges={['DSH', 'Risk', 'Escalation']}
        metaItems={['Exception queue', 'Recovery path', 'SLA pressure']}
        primaryAction={{ label: 'Open audit support', href: '/operations?workspace=audit-support-sla' }}
        secondaryAction={{ label: 'Open area capacity', href: '/operations?workspace=area-capacity' }}
        signals={EXCEPTIONS_ESCALATIONS_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={EXCEPTIONS_ESCALATIONS_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={EXCEPTIONS_ESCALATIONS_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={EXCEPTIONS_ESCALATIONS_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Exception queue"
        purpose="Escalate the selected case into the correct recovery lane without hiding the issue."
        items={EXCEPTIONS_ESCALATIONS_PREVIEW.exceptions as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=audit-support-sla')}
        evidenceAction={() => window.location.assign('/operations?workspace=area-capacity')}
      />
    </React.Fragment>
  );
}

export default ExceptionsEscalationsScreen;