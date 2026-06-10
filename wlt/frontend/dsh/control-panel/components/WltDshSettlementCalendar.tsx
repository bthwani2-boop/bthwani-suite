'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { getWltDshSettlementCalendarPreview } from '../financeContracts';

const STATUS_LABEL: Record<string, string> = {
  open_preview: 'مفتوحة كمعاينة',
  cutoff_locked: 'تم قفل القطع',
  wlt_review: 'مراجعة WLT',
  paid_preview: 'مدفوعة كمعاينة',
  held: 'محجوزة',
};

export function WltDshSettlementCalendar() {
  const cycles = React.useMemo(() => getWltDshSettlementCalendarPreview(), []);

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" weight="black">تقويم التسويات</Text>
        <Text role="bodySm" tone="soft">
          يوضح دورات القطع والدفع والحجز لكل مالك مالي. لا ينفذ دفعًا ولا يفتح ledger runtime.
        </Text>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {cycles.map((cycle) => (
          <Box key={cycle.cycleId} padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
            <Text role="titleSm" weight="black">{cycle.ownerLabel}</Text>
            <Text role="caption" tone="muted">{cycle.cycleId} · {cycle.frequency} · {STATUS_LABEL[cycle.status]}</Text>
            <div style={{ display: 'grid', gap: 7, marginTop: 6 }}>
              <div>الفترة: {cycle.periodStart} → {cycle.periodEnd}</div>
              <div>موعد القطع: {cycle.cutoffDate}</div>
              <div>موعد الدفع المتوقع: {cycle.expectedPayoutDate}</div>
              <div>الصافي: <strong>{cycle.netPayableLabel}</strong></div>
              <div>الحجز: <strong>{cycle.holdAmountLabel}</strong></div>
              <div>طلبات داخلة/مستبعدة: {cycle.includedOrderCount.toLocaleString('ar-YE')} / {cycle.excludedOrderCount.toLocaleString('ar-YE')}</div>
              <Text role="caption" tone="muted">{cycle.releasePolicy}</Text>
            </div>
          </Box>
        ))}
      </div>
    </Box>
  );
}

export default WltDshSettlementCalendar;
