import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../shared';

type SupportLane = 'order' | 'partner' | 'captain' | 'field';

function buildSupportItems(kind: 'queue' | 'dispute') {
  const lanes: readonly SupportLane[] = ['order', 'partner', 'captain', 'field'];
  return lanes.map((lane) => ({
    id: `${kind}-${lane}`,
    title: `${lane} ${kind}`,
    status: lane === 'order' ? 'Open' : 'Ready',
    ownerSurface: 'support',
    blocker: kind === 'dispute' ? 'Evidence and ownership must be confirmed.' : 'Assign an owner and choose a linked surface.',
    evidence: `Linked ${lane} surface proof`,
    primaryActionLabel: kind === 'dispute' ? 'Resolve locally' : 'Triage',
    secondaryActionLabel: 'Assign owner',
    evidenceActionLabel: `Open linked ${lane}`,
    tone: lane === 'order' ? 'brand' : lane === 'partner' ? 'best' : lane === 'captain' ? 'warning' : 'warning',
  })) as const;
}

function SupportQueueBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: 'queue' | 'dispute';
}) {
  const items = buildSupportItems(kind);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [note, setNote] = React.useState('Ready for triage');
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshActionQueue
        title={title}
        purpose={purpose}
        items={items}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        primaryAction={(item) => { setSelectedId(item.id); setNote(`${item.primaryActionLabel}: ${item.title}`); }}
        secondaryAction={(item) => { setSelectedId(item.id); setNote(`${item.secondaryActionLabel}: ${item.title}`); }}
        evidenceAction={(item) => { setSelectedId(item.id); setNote(`${item.evidenceActionLabel}: ${item.title}`); }}
      />

      <ControlPanelDshWorkspaceFrame
        eyebrow={kind === 'queue' ? 'Support queue' : 'Dispute resolution'}
        title={title}
        description="DSH-linked support queue with triage, assignment, and linked surface resolution."
        badges={['support', kind]}
        metaItems={[selected?.status ?? 'Open', note]}
        decisionBoard={{
          title: `${title} board`,
          purpose,
          primaryDecision: selected?.status ?? 'Open',
          nextAction: note,
          blockers: selected?.blocker ?? 'Select an issue lane.',
          ownerSurface: 'support',
          evidenceHint: selected?.evidence ?? 'linked surface proof',
          routeHint: '/operations?workspace=issues',
          decisionTone: kind === 'dispute' ? 'warning' : 'danger',
        }}
        primaryAction={{ label: 'Open issues', href: '/operations?workspace=issues' }}
        secondaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        signals={[
          { id: `${kind}-open`, title: 'Open', value: 'Visible', description: 'Open issue lane.', tone: 'warning' },
          { id: `${kind}-assigned`, title: 'Assigned', value: 'Local', description: 'Assigned owner lane.', tone: 'best' },
          { id: `${kind}-linked`, title: 'Linked', value: 'Visible', description: 'Linked surface lane.', tone: 'brand' },
          { id: `${kind}-escalated`, title: 'Escalated', value: 'Tracked', description: 'Escalation lane.', tone: 'danger' },
        ]}
      />
    </Box>
  );
}

export function ControlPanelDshSupportQueueScreen() {
  return <SupportQueueBoard title="Cross-surface support queue" purpose="Keep support tied to DSH-linked issues instead of a generic root inbox." kind="queue" />;
}

export function ControlPanelDshDisputeResolutionScreen() {
  return <SupportQueueBoard title="Dispute lifecycle" purpose="Keep the dispute on a DSH-linked context and not a generic support path." kind="dispute" />;
}

export default ControlPanelDshSupportQueueScreen;
