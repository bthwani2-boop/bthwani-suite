'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshSettlementCalendarPreview,
  type WltDshSettlementCalendarCycle,
} from '../financeContracts';
import { formatWltYer } from '../models/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

const STATUS_LABEL: Record<string, string> = {
  open_preview: 'مفتوحة كمعاينة',
  cutoff_locked: 'تم قفل القطع',
  wlt_review: 'مراجعة WLT',
  paid_preview: 'مدفوعة كمعاينة',
  held: 'محجوزة',
};

function buildRuntimeSettlementCycles(
  runtimeFinance: WltDshFinanceRuntimeResult | null,
): WltDshSettlementCalendarCycle[] {
  if (runtimeFinance?.state !== 'runtime') {
    return [];
  }

  const grouped = new Map<string, typeof runtimeFinance.data.overview.settlements>();
  for (const settlement of runtimeFinance.data.overview.settlements) {
    const key = settlement.partner_id || 'partner-unknown';
    const current = grouped.get(key);
    if (current) {
      current.push(settlement);
    } else {
      grouped.set(key, [settlement]);
    }
  }

  return Array.from(grouped.entries()).map(([partnerId, settlements]) => {
    const sorted = [...settlements].sort((left, right) => left.created_at.localeCompare(right.created_at));
    const periodStart = sorted[0]?.created_at.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
    const periodEnd = sorted.at(-1)?.updated_at.slice(0, 10) ?? periodStart;
    const netPayableMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
    const holdAmountMinorUnits = settlements
      .filter((item) => item.status === 'FAILED' || item.status === 'PROCESSING')
      .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
    const status =
      settlements.some((item) => item.status === 'FAILED')
        ? 'held'
        : settlements.every((item) => item.status === 'COMPLETED')
          ? 'paid_preview'
          : settlements.some((item) => item.status === 'PROCESSING')
            ? 'wlt_review'
            : 'cutoff_locked';

    return {
      cycleId: `runtime-cycle-${partnerId}-${periodEnd}`,
      ownerKind: 'store',
      ownerLabel: `شريك ${partnerId}`,
      frequency: 'weekly',
      periodStart,
      periodEnd,
      cutoffDate: periodEnd,
      expectedPayoutDate: periodEnd,
      actualPayoutDate: settlements.every((item) => item.status === 'COMPLETED') ? periodEnd : undefined,
      status,
      includedOrderCount: settlements.filter((item) => item.status === 'COMPLETED').length,
      excludedOrderCount: settlements.filter((item) => item.status !== 'COMPLETED').length,
      netPayableMinorUnits,
      netPayableLabel: formatWltYer(netPayableMinorUnits),
      holdAmountMinorUnits,
      holdAmountLabel: formatWltYer(holdAmountMinorUnits),
      releasePolicy:
        holdAmountMinorUnits > 0
          ? 'WLT runtime يشير إلى تسويات معلقة أو فاشلة تتطلب مراجعة قبل الصرف.'
          : 'الصرف يمر عبر WLT بعد اكتمال المطابقة.',
      contract: {
        contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
        runtimeTruth: false,
        backendSource: false,
        owner: 'wlt',
        currencyCode: 'YER',
        isPreview: true,
      },
    } satisfies WltDshSettlementCalendarCycle;
  });
}

export function WltDshSettlementCalendar({
  runtimeFinance = null,
}: {
  runtimeFinance?: WltDshFinanceRuntimeResult | null;
} = {}) {
  const previewCycles = React.useMemo(() => getWltDshSettlementCalendarPreview(), []);
  const runtimeCycles = React.useMemo(() => buildRuntimeSettlementCycles(runtimeFinance), [runtimeFinance]);
  const cycles = runtimeCycles.length > 0 ? runtimeCycles : previewCycles;

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" weight="black">تقويم التسويات</Text>
        <Text role="bodySm" tone="soft">
          يوضح دورات القطع والدفع والحجز لكل مالك مالي. يعرض WLT runtime أولًا ثم fallback عند التعذر.
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
