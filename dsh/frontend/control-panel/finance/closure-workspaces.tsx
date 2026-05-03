import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem } from '../shared';

type FinanceStatus = 'Payable' | 'Pending' | 'Blocked' | 'Disputed';

type FinanceQueueKind = 'settlement' | 'cod' | 'refund';

function buildFinanceRows(kind: FinanceQueueKind) {
  const labels: readonly FinanceStatus[] = ['Payable', 'Pending', 'Blocked', 'Disputed'];
  return labels.map((status) => ({
    id: `${kind}-${status.toLowerCase()}`,
    title: `${status} ${kind}`,
    status,
    ownerSurface: 'finance',
    blocker:
      status === 'Payable'
        ? 'Ready to release after review.'
        : status === 'Pending'
          ? 'Needs evidence before release.'
          : status === 'Blocked'
            ? 'Blocker or mismatch must be resolved.'
            : 'Dispute requires a local decision.',
    evidence: `${kind} ledger row and exception proof`,
    primaryActionLabel: status === 'Blocked' ? 'Dispute' : 'Release',
    secondaryActionLabel: status === 'Pending' ? 'Hold' : 'Open blocker',
    evidenceActionLabel: kind === 'refund' ? 'Open refund case' : 'Open evidence',
    tone: status === 'Payable' ? 'best' : status === 'Blocked' ? 'danger' : 'warning',
  })) satisfies readonly ControlPanelDshActionQueueItem[];
}

function FinanceQueueBoard({
  title,
  purpose,
  kind,
  onActionLabel,
}: {
  title: string;
  purpose: string;
  kind: FinanceQueueKind;
  onActionLabel: string;
}) {
  const items = buildFinanceRows(kind);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [statusNote, setStatusNote] = React.useState(onActionLabel);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshActionQueue
        title={title}
        purpose={purpose}
        items={items}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        primaryAction={(item) => {
          setSelectedId(item.id);
          setStatusNote(`${item.primaryActionLabel}: ${item.title}`);
        }}
        secondaryAction={(item) => {
          setSelectedId(item.id);
          setStatusNote(`${item.secondaryActionLabel}: ${item.title}`);
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setStatusNote(`${item.evidenceActionLabel}: ${item.title}`);
        }}
      />

      <ControlPanelDshWorkspaceFrame
        eyebrow={kind.toUpperCase()}
        title={title}
        description="Queue-based finance control room with local release, hold, dispute, and evidence actions."
        badges={['finance', kind]}
        metaItems={[selectedItem?.status ?? 'Pending', statusNote]}
        decisionBoard={{
          title: `${title} board`,
          purpose,
          primaryDecision: selectedItem?.status ?? 'Pending',
          nextAction: statusNote,
          blockers: selectedItem?.blocker ?? 'Select a finance row.',
          ownerSurface: 'finance',
          evidenceHint: selectedItem?.evidence ?? 'finance row evidence',
          routeHint: '/operations?workspace=finance',
          decisionTone: selectedItem?.tone,
        }}
        primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: `${kind}-payable`, title: 'Payable', value: 'Ready', description: 'Release candidate.', tone: 'best' },
          { id: `${kind}-pending`, title: 'Pending', value: 'Open', description: 'Needs review.', tone: 'warning' },
          { id: `${kind}-blocked`, title: 'Blocked', value: 'Visible', description: 'Needs blocker review.', tone: 'danger' },
          { id: `${kind}-disputed`, title: 'Disputed', value: 'Tracked', description: 'Needs exception handling.', tone: 'warning' },
        ]}
      />
    </Box>
  );
}

export function ControlPanelDshFinanceScreen() {
  return (
    <FinanceQueueBoard
      title="DSH finance overview"
      purpose="Separate payable, pending, blocked, and disputed amounts in one read."
      kind="settlement"
      onActionLabel="Open settlement lane"
    />
  );
}

export function ControlPanelDshSettlementScreen() {
  return (
    <FinanceQueueBoard
      title="Partner and captain settlement"
      purpose="Keep partner and captain payout visibility operational, not just summarized."
      kind="settlement"
      onActionLabel="Open settlement lane"
    />
  );
}

export function ControlPanelDshCodReconciliationScreen() {
  return (
    <FinanceQueueBoard
      title="COD reconciliation"
      purpose="Keep collected and pending COD in a single operational read."
      kind="cod"
      onActionLabel="Review COD exception"
    />
  );
}

export function ControlPanelDshRefundQueueScreen() {
  return (
    <FinanceQueueBoard
      title="Refund handling"
      purpose="Keep refund handling readable when items move between pending, refunded, and rejected."
      kind="refund"
      onActionLabel="Open refund case"
    />
  );
}

export default ControlPanelDshFinanceScreen;
