import type { WltDshStoreSettlementStatement as StoreStatement } from '../contracts/storeSettlement.types';
import { formatWltYer } from '../contracts/dshFinance.types';
import type { WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

function mapRuntimeStatementStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): StoreStatement['status'] {
  if (status === 'COMPLETED') return 'paid_preview';
  if (status === 'FAILED') return 'held_by_wlt';
  if (status === 'PROCESSING') return 'ready_for_review';
  return 'draft_preview';
}

function mapRuntimeOrderStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): StoreStatement['orders'][number]['settlementStatus'] {
  if (status === 'COMPLETED') return 'included';
  if (status === 'FAILED') return 'disputed';
  if (status === 'PROCESSING') return 'held';
  return 'next_cycle';
}

function resolveRuntimePeriodBounds(items: readonly { created_at: string; updated_at: string; completed_at?: string }[]) {
  const created = items.map((item) => item.created_at).filter(Boolean).sort();
  const updated = items.map((item) => item.completed_at ?? item.updated_at ?? item.created_at).filter(Boolean).sort();
  const periodStart = created[0]?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const periodEnd = updated.at(-1)?.slice(0, 10) ?? periodStart;
  return { periodStart, periodEnd };
}

export function buildRuntimeStoreStatements(runtimeFinance: WltDshFinanceRuntimeResult | null): StoreStatement[] {
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

  return Array.from(grouped.entries())
    .map(([partnerId, settlements]) => {
      const { periodStart, periodEnd } = resolveRuntimePeriodBounds(settlements);
      const grossOrdersTotalMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.gross_amount * 100), 0);
      const platformCommissionTotalMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.platform_fee * 100), 0);
      const netPayableMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const paidToDateMinorUnits = settlements
        .filter((item) => item.status === 'COMPLETED')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const remainingPayableMinorUnits = settlements
        .filter((item) => item.status !== 'COMPLETED')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const holdsTotalMinorUnits = settlements
        .filter((item) => item.status === 'FAILED' || item.status === 'PROCESSING')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);

      const status =
        settlements.some((item) => item.status === 'FAILED')
          ? 'held_by_wlt'
          : settlements.every((item) => item.status === 'COMPLETED')
            ? 'paid_preview'
            : settlements.some((item) => item.status === 'PROCESSING')
              ? 'ready_for_review'
              : 'draft_preview';

      return {
        statementId: `runtime-statement-${partnerId}`,
        storeId: partnerId,
        storeName: `شريك ${partnerId}`,
        settlementCycleId: `runtime-cycle-${partnerId}-${periodEnd}`,
        frequency: 'weekly',
        periodStart,
        periodEnd,
        cutoffDate: periodEnd,
        expectedPayoutDate: periodEnd,
        status,
        grossOrdersTotalMinorUnits,
        grossOrdersTotalLabel: formatWltYer(grossOrdersTotalMinorUnits),
        orderCount: settlements.length,
        deliveryFeesTotalMinorUnits: 0,
        deliveryFeesTotalLabel: formatWltYer(0),
        platformCommissionTotalMinorUnits,
        platformCommissionTotalLabel: formatWltYer(platformCommissionTotalMinorUnits),
        discountsTotalMinorUnits: 0,
        discountsTotalLabel: formatWltYer(0),
        refundsTotalMinorUnits: 0,
        refundsTotalLabel: formatWltYer(0),
        holdsTotalMinorUnits,
        holdsTotalLabel: formatWltYer(holdsTotalMinorUnits),
        netPayableMinorUnits,
        netPayableLabel: formatWltYer(netPayableMinorUnits),
        paidToDateMinorUnits,
        paidToDateLabel: formatWltYer(paidToDateMinorUnits),
        remainingPayableMinorUnits,
        remainingPayableLabel: formatWltYer(remainingPayableMinorUnits),
        orders: settlements.map((item) => {
          const orderGrossMinorUnits = Math.round(item.gross_amount * 100);
          const platformCommissionMinorUnits = Math.round(item.platform_fee * 100);
          const netSettlementImpactMinorUnits = Math.round(item.partner_payout * 100);
          return {
            orderId: item.order_id,
            orderDate: item.created_at.slice(0, 10),
            deliveryDate: (item.completed_at ?? item.updated_at ?? item.created_at).slice(0, 10),
            paymentMethod: 'manual',
            orderGrossMinorUnits,
            orderGrossLabel: formatWltYer(orderGrossMinorUnits),
            deliveryFeeMinorUnits: 0,
            deliveryFeeLabel: formatWltYer(0),
            platformCommissionMinorUnits,
            platformCommissionLabel: formatWltYer(platformCommissionMinorUnits),
            discountMinorUnits: 0,
            discountLabel: formatWltYer(0),
            refundMinorUnits: 0,
            refundLabel: formatWltYer(0),
            netSettlementImpactMinorUnits,
            netSettlementImpactLabel: formatWltYer(netSettlementImpactMinorUnits),
            includedInCycle: item.status === 'COMPLETED',
            settlementStatus: mapRuntimeOrderStatus(item.status),
            evidenceRef: item.idempotency_key || item.id,
          };
        }),
        contract: {
          contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
          runtimeTruth: false,
          backendSource: false,
          owner: 'wlt',
          currencyCode: 'YER',
          isPreview: true,
        },
      } satisfies StoreStatement;
    })
    .sort((left, right) => left.storeName.localeCompare(right.storeName, 'ar'));
}

export { mapRuntimeStatementStatus };
