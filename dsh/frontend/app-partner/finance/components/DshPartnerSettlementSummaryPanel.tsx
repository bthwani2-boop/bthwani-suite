import React from 'react';
import { Box, ListItem, Surface, Text } from '@bthwani/ui-kit';
import type { DshPartnerSettlementSummary } from '../model/dshPartnerFinanceModel';

const defaultSettlements: DshPartnerSettlementSummary[] = [
  { id: 'settlement-1', title: 'تسوية الأسبوع الحالي', amountLabel: '1,240 ر.س', statusLabel: 'بانتظار الصرف', dateLabel: 'الخميس 02 مايو' },
  { id: 'settlement-2', title: 'تسوية الأسبوع الماضي', amountLabel: '2,860 ر.س', statusLabel: 'مكتملة', dateLabel: 'الخميس 25 أبريل' },
];

export type DshPartnerSettlementSummaryPanelProps = {
  items?: readonly DshPartnerSettlementSummary[];
};

export function DshPartnerSettlementSummaryPanel({ items = defaultSettlements }: DshPartnerSettlementSummaryPanelProps) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Box gap={1}>
        <Text role="label">ملخص التسويات</Text>
        <Text role="bodySm" tone="muted">الملخص يوضح آخر التسويات من دون أي ربط API أو عمليات صرف.</Text>
      </Box>
      <Box gap={2}>
        {items.map((item) => (
          <ListItem key={item.id} title={item.title} subtitle={`${item.statusLabel} · ${item.dateLabel}`} meta={item.amountLabel} />
        ))}
      </Box>
    </Surface>
  );
}

export default DshPartnerSettlementSummaryPanel;
