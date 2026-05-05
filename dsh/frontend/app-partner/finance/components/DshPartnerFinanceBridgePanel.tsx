import React from 'react';
import { Box, KeyValueList, Surface, Text } from '@bthwani/ui-kit';
import type { DshPartnerFinanceBridgeState } from '../model/dshPartnerFinanceModel';

const defaultFinanceState: DshPartnerFinanceBridgeState = {
  partnerBalanceLabel: '3,420 ر.س',
  pendingPayoutsLabel: '1,240 ر.س',
  lastSettlementLabel: 'الخميس 25 أبريل',
  financeNoteLabel: 'الملاحظات المالية المرتبطة بالطلبات تظهر هنا للقراءة فقط.',
};

export type DshPartnerFinanceBridgePanelProps = {
  state?: DshPartnerFinanceBridgeState;
};

export function DshPartnerFinanceBridgePanel({ state = defaultFinanceState }: DshPartnerFinanceBridgePanelProps) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Box gap={1}>
        <Text role="label">جسر المالية للشريك</Text>
        <Text role="bodySm" tone="muted">هذا الجسر يوضح الرصيد والتسويات والعمولة من دون أي wallet mutation.</Text>
      </Box>
      <KeyValueList
        items={[
          { label: 'ظهور رصيد الشريك', value: state.partnerBalanceLabel, tone: 'success' },
          { label: 'المبالغ المعلقة', value: state.pendingPayoutsLabel, tone: 'warning' },
          { label: 'آخر تسوية', value: state.lastSettlementLabel },
          { label: 'ملاحظات مالية مرتبطة بالطلبات', value: state.financeNoteLabel, tone: 'info' },
        ]}
      />
    </Surface>
  );
}

export default DshPartnerFinanceBridgePanel;
