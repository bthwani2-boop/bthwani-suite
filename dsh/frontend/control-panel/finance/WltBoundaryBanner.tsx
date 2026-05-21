// P0-07: WLT Finance Boundary Banner — reusable read-only boundary badge for all finance workspaces.
// DSH displays WLT-owned financial data. No mutations, no calculations, no approvals inside DSH.
// All financial truth (settlement / payout / refund / commission / platform-fee) is owned by WLT.
import React from 'react';
import { Box, Chip, KeyValueList, Text } from '@bthwani/ui-kit';
import type { DshWltFinanceBoundaryRecord } from '../../../shared/dshFinancePreviewModel';

const CONTRACT_STATUS_CHIP_TONES: Record<
  DshWltFinanceBoundaryRecord['contractStatus'],
  'success' | 'warning' | 'danger'
> = {
  connected: 'success',
  pending_contract: 'warning',
  blocked: 'danger',
};

export function WltBoundaryBanner({ record }: { record: DshWltFinanceBoundaryRecord }) {
  const chipTone = CONTRACT_STATUS_CHIP_TONES[record.contractStatus];
  return (
    <Box padding={3} background="surfaceInset" radiusToken="lg" gap={2}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Chip label="WLT — عرض فقط" tone="brand" />
        <Chip label={record.contractStatusLabel} tone={chipTone} />
        {record.blockedReason ? (
          <Chip label={`محظور: ${record.blockedReason}`} tone="danger" />
        ) : null}
      </Box>
      <KeyValueList
        items={[
          { label: 'المجال المالي', value: record.domain },
          { label: 'مصدر الحقيقة المالية', value: record.source },
          { label: 'دور DSH', value: record.dshRole },
          { label: 'التحوير', value: record.mutation },
          { label: 'الجهة المتأثرة', value: record.affectedActor },
          { label: 'حالة المزامنة', value: record.lastSyncLabel },
          ...(record.affectedEntityId
            ? [{ label: 'معرف الكيان', value: record.affectedEntityId }]
            : []),
        ]}
      />
      {record.auditVisibilityRequired ? (
        <Box padding={2} background="warningSurface" radiusToken="sm">
          <Text role="caption" tone="muted">
            سجل التدقيق مطلوب لكل تحول في الحالة.
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

export default WltBoundaryBanner;
