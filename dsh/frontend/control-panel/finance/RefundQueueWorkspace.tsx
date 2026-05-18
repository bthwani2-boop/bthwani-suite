// ML-042: CP refund queue workspace skeleton (WLT bridge + refund-candidacy flag)
// WLT owns all refund money semantics — ops here can only flag candidacy, not initiate refunds
import React from 'react';
import { ControlPanelDshRefundQueueScreen } from './FinanceHubScreens';

export type RefundQueueWorkspaceProps = {
  // refundCandidacyEnabled: ops can flag an order as refund-candidate — WLT decides actual refund
  refundCandidacyEnabled?: boolean;
};

export function RefundQueueWorkspace({ refundCandidacyEnabled: _enabled = false }: RefundQueueWorkspaceProps) {
  // BLOCKED_BY_CONTRACT: surface refund-candidacy flag action once CG-030 (PATCH /dsh/ops/orders/:id/refund-candidacy) proven
  // DO NOT add refund initiation or amount logic — WLT owns all money
  return <ControlPanelDshRefundQueueScreen />;
}

export default RefundQueueWorkspace;
