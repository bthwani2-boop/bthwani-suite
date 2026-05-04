 'use client';

import React from 'react';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem, type ControlPanelDshWorkspaceFrameProps } from '../../shared';
import { buildOperationsHref, type AnyOperationsWorkspaceId } from '../operations.registry';
import { AUDIT_SUPPORT_SLA_PREVIEW } from '../operations.preview-data';

export type AuditSupportSlaScreenProps = {
  hubHref: string;
};

export function AuditSupportSlaScreen({ hubHref }: AuditSupportSlaScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(AUDIT_SUPPORT_SLA_PREVIEW.audits[0]?.id ?? null);

  return (
    <React.Fragment>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Operations"
        title="Audit, support and SLA"
        description="Manual audits, support bridges, and SLA recovery stay visible in one canonical lane."
        badges={['DSH', 'Audit', 'SLA']}
        metaItems={['Proof queue', 'Support bridge', 'SLA timing']}
        primaryAction={{ label: 'Open live orders', href: '/operations?workspace=live-orders' }}
        secondaryAction={{ label: 'Open exceptions', href: '/operations?workspace=exceptions-escalations' }}
        signals={AUDIT_SUPPORT_SLA_PREVIEW.signals as NonNullable<ControlPanelDshWorkspaceFrameProps['signals']>}
        actions={AUDIT_SUPPORT_SLA_PREVIEW.actions as NonNullable<ControlPanelDshWorkspaceFrameProps['actions']>}
        disclosures={AUDIT_SUPPORT_SLA_PREVIEW.disclosures as NonNullable<ControlPanelDshWorkspaceFrameProps['disclosures']>}
        decisionBoard={AUDIT_SUPPORT_SLA_PREVIEW.decisionBoard as NonNullable<ControlPanelDshWorkspaceFrameProps['decisionBoard']>}
        footerNote={`Hub route: ${hubHref}`}
      />

      <ControlPanelDshActionQueue
        title="Audit queue"
        purpose="Keep evidence visible and move each audit into the correct closure path."
        items={AUDIT_SUPPORT_SLA_PREVIEW.audits as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => window.location.assign(buildOperationsHref(item.ownerSurface as AnyOperationsWorkspaceId, { orderId: item.id }))}
        secondaryAction={() => window.location.assign('/operations?workspace=exceptions-escalations')}
        evidenceAction={() => window.location.assign('/operations?workspace=live-orders')}
      />
    </React.Fragment>
  );
}

export default AuditSupportSlaScreen;