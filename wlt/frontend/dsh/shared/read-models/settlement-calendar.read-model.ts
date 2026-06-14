import type { WltDshSettlementCalendarCycle } from '../contracts/settlementCalendar.types';
import { formatWltYer } from '../contracts/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

export function buildRuntimeSettlementCycles(
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
