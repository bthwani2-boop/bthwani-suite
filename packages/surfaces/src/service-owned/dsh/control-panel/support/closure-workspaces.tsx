import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshSupportQueueScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Support queue"
      title="Cross-surface support queue"
      description="Order issue queue plus client, partner, captain, and field issue lanes stay visible."
      badges={['support', 'queue']}
      metaItems={['orders', 'client', 'partner', 'captain', 'field']}
      decisionBoard={{
        title: 'Support triage board',
        purpose: 'Keep support tied to DSH-linked issues instead of a generic root inbox.',
        primaryDecision: 'Route the issue to order, partner, captain, or field.',
        nextAction: 'Open dispute resolution if evidence is missing or contested.',
        blockers: 'Untriaged and unlinked issues still block support closure.',
        ownerSurface: 'support',
        evidenceHint: 'linked issue lane and source surface proof',
        routeHint: '/operations?workspace=issues',
        decisionTone: 'danger',
      }}
      primaryAction={{ label: 'Open issues', href: '/operations?workspace=issues' }}
      secondaryAction={{ label: 'Open dispute resolution', href: '/operations?workspace=disputes' }}
      signals={[
        { id: 'order-issues', title: 'Order issue queue', value: 'Open', description: 'Orders needing support action stay visible.', tone: 'brand' },
        { id: 'client-lane', title: 'Client lane', value: 'Ready', description: 'Client issue lane stays separated.', tone: 'best' },
        { id: 'partner-lane', title: 'Partner lane', value: 'Ready', description: 'Partner issue lane stays separated.', tone: 'brand' },
        { id: 'field-lane', title: 'Field lane', value: 'Ready', description: 'Field issue lane stays separated.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshDisputeResolutionScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Dispute resolution"
      title="Dispute lifecycle"
      description="Evidence, resolution status, and the current step stay visible without any backend mutation."
      badges={['dispute', 'evidence']}
      metaItems={['evidence', 'resolution', 'status']}
      decisionBoard={{
        title: 'Dispute decision board',
        purpose: 'Keep the dispute on a DSH-linked context and not a generic support path.',
        primaryDecision: 'Accept the evidence or send the case back to the owning surface.',
        nextAction: 'Open the linked support queue when the dispute needs triage.',
        blockers: 'Missing evidence or unresolved status still blocks closure.',
        ownerSurface: 'support',
        evidenceHint: 'dispute evidence and linked resolution state',
        routeHint: '/operations?workspace=issues',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'Open support queue', href: '/operations?workspace=issues' }}
      secondaryAction={{ label: 'Open governance', href: '/operations?workspace=evidence' }}
      signals={[
        { id: 'evidence', title: 'Evidence', value: 'Visible', description: 'Evidence items remain on the surface.', tone: 'brand' },
        { id: 'resolution', title: 'Resolution status', value: 'Tracked', description: 'Resolution state stays explicit.', tone: 'warning' },
        { id: 'lifecycle', title: 'Dispute lifecycle', value: 'Open', description: 'Lifecycle progression remains visible.', tone: 'best' },
      ]}
    />
  );
}

export default ControlPanelDshSupportQueueScreen;
