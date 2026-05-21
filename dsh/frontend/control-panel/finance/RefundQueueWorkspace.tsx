// P0-07: CP refund queue workspace — WLT bridge, view-only.
// DSH displays WLT-owned refund states. No refund initiation, approval, or mutation inside DSH.
// Refund candidacy is a read-only signal; WLT decides all refund outcomes.
import React from 'react';
import { Box, Chip, Text } from '@bthwani/ui-kit';
import {
  getDshWltRefundStatusLabel,
  getDshWltRefundStatusTone,
  buildDshWltFinanceBoundaryRecord,
  type DshWltRefundBridgeStatus,
} from '../../shared/dshFinancePreviewModel';
import { WltBoundaryBanner } from './WltBoundaryBanner';
import { ControlPanelDshRefundQueueScreen } from './FinanceHubScreens';

export type RefundQueueWorkspaceProps = {
  refundCandidacyEnabled?: boolean;
};

const REFUND_STATUS_PREVIEW: ReadonlyArray<DshWltRefundBridgeStatus> = [
  'refund_pending_wlt',
  'refund_completed_wlt',
  'refund_rejected_wlt',
];

export function RefundQueueWorkspace({ refundCandidacyEnabled: _enabled = false }: RefundQueueWorkspaceProps) {
  const boundaryRecord = buildDshWltFinanceBoundaryRecord({
    domain: 'refund',
    contractStatus: 'pending_contract',
    affectedActor: 'عمليات DSH',
    auditVisibilityRequired: true,
  });

  return (
    <Box gap={4} padding={4}>
      <WltBoundaryBanner record={boundaryRecord} />
      <Box gap={2}>
        <Text role="titleSm">حالات الاسترداد — WLT (عرض فقط)</Text>
        <Box style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {REFUND_STATUS_PREVIEW.map((status) => (
            <Chip
              key={status}
              label={getDshWltRefundStatusLabel(status)}
              tone={getDshWltRefundStatusTone(status)}
            />
          ))}
        </Box>
        <Text role="caption" tone="muted">
          هذه الحالات للعرض فقط — WLT يحدد جميع مآلات الاسترداد. DSH لا تبادر أو تعتمد أي استرداد.
        </Text>
      </Box>
      <ControlPanelDshRefundQueueScreen />
    </Box>
  );
}

export default RefundQueueWorkspace;
