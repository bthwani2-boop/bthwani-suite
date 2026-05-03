import React from 'react';
import { Box, ListItem, Surface, Text } from '@bthwani/ui-kit';
import type { DshPartnerCommissionSummary } from '../model/dshPartnerFinanceModel';

const defaultCommissionItems: DshPartnerCommissionSummary[] = [
  { mode: 'pickup', rateLabel: '0%', notesLabel: 'الاستلام الذاتي بلا عمولة تشغيل.' },
  { mode: 'store_delivery', rateLabel: '8%', notesLabel: 'توصيل المتجر يحتسب بعمولة تشغيلية ثابتة.' },
  { mode: 'platform_delivery', rateLabel: '15%', notesLabel: 'توصيل بثواني يملك عمولة أعلى بسبب مسار المنصة.' },
];

function resolveModeLabel(mode: DshPartnerCommissionSummary['mode']) {
  if (mode === 'pickup') return 'استلم بنفسك';
  if (mode === 'store_delivery') return 'توصيل المتجر';
  return 'توصيل بثواني';
}

export type DshPartnerCommissionSummaryPanelProps = {
  items?: readonly DshPartnerCommissionSummary[];
};

export function DshPartnerCommissionSummaryPanel({ items = defaultCommissionItems }: DshPartnerCommissionSummaryPanelProps) {
  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Box gap={1}>
        <Text role="label">ملخص العمولة حسب النمط</Text>
        <Text role="bodySm" tone="muted">العمولات هنا توضيحية وتبقى جسر عرض فقط داخل مساحة DSH.</Text>
      </Box>
      <Box gap={2}>
        {items.map((item) => (
          <ListItem key={item.mode} title={resolveModeLabel(item.mode)} subtitle={item.notesLabel} meta={item.rateLabel} />
        ))}
      </Box>
    </Surface>
  );
}

export default DshPartnerCommissionSummaryPanel;
