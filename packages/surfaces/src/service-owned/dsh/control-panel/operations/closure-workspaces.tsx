import React from 'react';
import { ControlPanelDshWorkspaceFrame, getDshClosureItemsBySurface } from '../shared';

function makeActions(workspace: string) {
  return [
    {
      id: `${workspace}-overview`,
      label: 'Open overview',
      description: 'Return to the closure dashboard before drilling down further.',
      href: '/operations?workspace=dashboard',
      tone: 'secondary' as const,
    },
  ];
}

export function ControlPanelDshCaptainOperationsScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Captain operations"
      title="Captain operational closure"
      description="Availability, active orders, proof review, and COD exceptions in one compact control room."
      badges={['captain', 'ops']}
      metaItems={['availability', 'active orders', 'proof review', 'cod exceptions']}
      decisionBoard={{
        title: 'Captain ops board',
        purpose: 'Keep captain capacity, active orders, proof review, and COD exceptions readable.',
        primaryDecision: 'Keep the captain active, or hold them for evidence review.',
        nextAction: 'Open evidence when proof review or COD exceptions are not closed.',
        blockers: 'Proof review and COD exceptions still block final closure.',
        ownerSurface: 'operations',
        evidenceHint: 'active-order proof and COD exception review',
        routeHint: '/operations?workspace=evidence',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'availability', title: 'Captain availability', value: 'Live', description: 'Current captain capacity and readiness.', tone: 'best' },
        { id: 'active-orders', title: 'Active orders', value: 'Open', description: 'Orders currently requiring captain action.', tone: 'brand' },
        { id: 'proof-review', title: 'Proof review', value: 'Queued', description: 'Evidence review stays visible before closure.', tone: 'warning' },
        { id: 'cod-exceptions', title: 'COD exceptions', value: '0-3', description: 'Visible exceptions summary for finance handoff.', tone: 'warning' },
      ]}
      actions={makeActions('captain')}
      disclosures={getDshClosureItemsBySurface('captain').map((item) => ({
        id: item.area,
        label: item.title,
        description: item.description,
        badge: item.status,
        href: item.routeHint,
      }))}
    />
  );
}

export function ControlPanelDshFieldOperationsScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Field operations"
      title="Field operational closure"
      description="Visits, store activation, geo pin review, and onboarding queue in one control surface."
      badges={['field', 'ops']}
      metaItems={['visits', 'stores', 'geo pin', 'onboarding queue']}
      decisionBoard={{
        title: 'Field ops board',
        purpose: 'Keep visits, onboarding, and geo-pin review in one operational read.',
        primaryDecision: 'Close the visit, hold onboarding, or fix the geo pin.',
        nextAction: 'Open evidence for the store or visit cluster needing review.',
        blockers: 'Activation and geo-pin checks remain open.',
        ownerSurface: 'operations',
        evidenceHint: 'visit proof, store activation, and geo-pin evidence',
        routeHint: '/operations?workspace=evidence',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'Open visits', href: '/operations?workspace=dashboard' }}
      secondaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
      signals={[
        { id: 'visits', title: 'Visits', value: 'Visible', description: 'Field visits awaiting review or closure.', tone: 'brand' },
        { id: 'activation', title: 'Store activation', value: 'Queue', description: 'Activation requests remain explicit.', tone: 'warning' },
        { id: 'geopin', title: 'Geo pin review', value: 'Required', description: 'Coordinates and landmark checks stay visible.', tone: 'warning' },
        { id: 'onboarding', title: 'Onboarding queue', value: 'Open', description: 'The next onboarding step remains discoverable.', tone: 'best' },
      ]}
      actions={makeActions('field')}
      disclosures={getDshClosureItemsBySurface('field').map((item) => ({
        id: item.area,
        label: item.title,
        description: item.description,
        badge: item.status,
        href: item.routeHint,
      }))}
    />
  );
}

export function ControlPanelDshIssueQueueScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Issue queue"
      title="Cross-surface issue queue"
      description="Problems are grouped by client, partner, captain, and field so escalation stays legible."
      badges={['issues', 'queue']}
      metaItems={['client', 'partner', 'captain', 'field']}
      decisionBoard={{
        title: 'Issue queue board',
        purpose: 'Keep triage oriented to the owning DSH surface, not a generic support pool.',
        primaryDecision: 'Send the issue to order, partner, captain, or field.',
        nextAction: 'Open support or dashboard after assigning the issue lane.',
        blockers: 'Untriaged issues still block a clean handoff.',
        ownerSurface: 'support',
        evidenceHint: 'issue queue and linked surface context',
        routeHint: '/operations?workspace=issues',
        decisionTone: 'danger',
      }}
      primaryAction={{ label: 'Open support', href: '/operations?workspace=issues' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'client-issues', title: 'client issues', value: 'Ready', description: 'Client order issues and blockers.', tone: 'brand' },
        { id: 'partner-issues', title: 'partner issues', value: 'Ready', description: 'Partner order and activation issues.', tone: 'brand' },
        { id: 'captain-issues', title: 'captain issues', value: 'Ready', description: 'Captain order and proof issues.', tone: 'warning' },
        { id: 'field-issues', title: 'field issues', value: 'Ready', description: 'Field onboarding and visit issues.', tone: 'warning' },
      ]}
      actions={makeActions('issues')}
    />
  );
}

export function ControlPanelDshServiceabilityScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Serviceability"
      title="Zone and serviceability closure"
      description="Zones, fees, store availability, area coverage, and delivery modes remain visible."
      badges={['serviceability']}
      metaItems={['zones', 'fees', 'availability', 'coverage', 'delivery modes']}
      decisionBoard={{
        title: 'Serviceability board',
        purpose: 'Keep zone policy, fee policy, and coverage constraints visible for route decisions.',
        primaryDecision: 'Approve the zone or keep the route protected.',
        nextAction: 'Open finance if fee coverage needs a handoff or refinement.',
        blockers: 'Coverage gaps and store availability still constrain serviceability.',
        ownerSurface: 'operations',
        evidenceHint: 'zone policy, fees, and coverage proof',
        routeHint: '/operations?workspace=serviceability',
        decisionTone: 'brand',
      }}
      primaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      secondaryAction={{ label: 'Open finance', href: '/operations?workspace=finance' }}
      signals={[
        { id: 'zones', title: 'Zones', value: 'Defined', description: 'Area boundaries are visible.', tone: 'brand' },
        { id: 'fees', title: 'Fees', value: 'Visible', description: 'Fee visibility stays explicit.', tone: 'best' },
        { id: 'availability', title: 'Store availability', value: 'Checked', description: 'Store-level serviceability remains clear.', tone: 'warning' },
        { id: 'coverage', title: 'Area coverage', value: 'Mapped', description: 'Coverage remains legible for the control room.', tone: 'brand' },
      ]}
      actions={makeActions('serviceability')}
    />
  );
}

export default ControlPanelDshCaptainOperationsScreen;
