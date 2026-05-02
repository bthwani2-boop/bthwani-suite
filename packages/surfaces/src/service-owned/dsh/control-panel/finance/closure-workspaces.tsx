import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshFinanceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Finance"
      title="DSH finance overview"
      description="Partner settlement summary, captain settlement summary, COD reconciliation, refund queue, and commission visibility."
      badges={['finance', 'settlement']}
      metaItems={['partner settlement', 'captain settlement', 'cod reconciliation', 'refund queue']}
      primaryAction={{ label: 'Open settlements', href: '/operations?workspace=settlements' }}
      secondaryAction={{ label: 'Open COD', href: '/operations?workspace=cod' }}
      signals={[
        { id: 'partner-settlement', title: 'Partner settlement', value: 'Ready', description: 'Settlement summary is visible.', tone: 'brand' },
        { id: 'captain-settlement', title: 'Captain settlement', value: 'Ready', description: 'Captain payout summary is visible.', tone: 'brand' },
        { id: 'cod-reconciliation', title: 'COD reconciliation', value: 'Visible', description: 'Collected and pending amounts stay explicit.', tone: 'warning' },
        { id: 'refund-queue', title: 'Refund queue', value: 'Open', description: 'Refund work items remain in view.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshSettlementScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Settlement"
      title="Partner and captain settlement"
      description="Pending, approved, and blocked payouts stay visible without runtime mutation."
      badges={['settlement']}
      metaItems={['pending', 'approved', 'blocked']}
      primaryAction={{ label: 'Open finance', href: '/operations?workspace=finance' }}
      secondaryAction={{ label: 'Open refunds', href: '/operations?workspace=refunds' }}
      signals={[
        { id: 'partner-payouts', title: 'Partner payouts', value: 'Pending', description: 'Partner payout queue state.', tone: 'brand' },
        { id: 'captain-payouts', title: 'Captain payouts', value: 'Pending', description: 'Captain payout queue state.', tone: 'brand' },
        { id: 'approved', title: 'Approved', value: 'Visible', description: 'Approved payout entries remain explicit.', tone: 'best' },
        { id: 'blocked', title: 'Blocked', value: 'Visible', description: 'Blocked payout items remain obvious.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshCodReconciliationScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="COD"
      title="COD reconciliation"
      description="Collected, pending, and exception states stay on the surface before settlement."
      badges={['cod', 'reconciliation']}
      metaItems={['collected', 'pending', 'exceptions']}
      primaryAction={{ label: 'Open finance', href: '/operations?workspace=finance' }}
      secondaryAction={{ label: 'Open refund queue', href: '/operations?workspace=refunds' }}
      signals={[
        { id: 'collected', title: 'COD collected', value: 'Visible', description: 'Collected COD totals stay obvious.', tone: 'best' },
        { id: 'pending', title: 'COD pending', value: 'Visible', description: 'Pending COD amounts remain explicit.', tone: 'warning' },
        { id: 'exceptions', title: 'Exceptions', value: 'Summarized', description: 'Exception review remains in the control room.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshRefundQueueScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Refund queue"
      title="Refund handling"
      description="Pending, refunded, and rejected entries stay visible for control-room review."
      badges={['refunds']}
      metaItems={['pending', 'refunded', 'rejected']}
      primaryAction={{ label: 'Open COD', href: '/operations?workspace=cod' }}
      secondaryAction={{ label: 'Open finance', href: '/operations?workspace=finance' }}
      signals={[
        { id: 'refund-pending', title: 'Refund pending', value: 'Open', description: 'Pending refund items remain visible.', tone: 'warning' },
        { id: 'refunded', title: 'Refunded', value: 'Visible', description: 'Completed refunds are summarized.', tone: 'best' },
        { id: 'rejected', title: 'Rejected', value: 'Visible', description: 'Rejected or disputed refunds stay legible.', tone: 'danger' },
      ]}
    />
  );
}

export default ControlPanelDshFinanceScreen;
