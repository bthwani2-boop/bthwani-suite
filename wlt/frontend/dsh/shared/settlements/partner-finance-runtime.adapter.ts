import { createWltDshTypedClient } from '../clients';
import type { WltSettlement } from '../../contracts';
import {
  formatWltYer,
  type WltDshFinanceSummaryRecord,
  type WltPartnerFinanceSnapshot,
} from '../boundary/dsh-finance-read-model.types';

export const EMPTY_PARTNER_FINANCE_SNAPSHOT: WltPartnerFinanceSnapshot = {
  settlementRecords: [],
  grossSalesMinorUnits: 0,
  grossSalesLabel: '—',
  platformCommissionMinorUnits: 0,
  platformCommissionLabel: '—',
  deductionsMinorUnits: 0,
  deductionsLabel: '—',
  netSettlementMinorUnits: 0,
  netSettlementLabel: '—',
  nextSettlementMinorUnits: 0,
  nextSettlementLabel: '—',
  totalLabel: '—',
  cycleStatus: 'empty',
  cycleStartDate: '—',
  cycleEndDate: '—',
  nextPayoutDate: '—',
  contractState: 'CONTRACT_TBD',
  dataKind: 'preview',
  runtimeTruth: 'none — runtime_unbound',
  backendSource: 'none — preview_seeds_only',
  bindingSource: 'wlt_frontend_shared_finance',
  moneySemantics: 'display_only — no_accounting_effect',
  sourceLabel: '—',
  warnings: [],
  isPreview: false,
};

function settlementRecord(settlement: WltSettlement): WltDshFinanceSummaryRecord {
  const amount = Math.round(settlement.partner_payout * 100);
  const isDone = settlement.status === 'COMPLETED';
  return {
    id: settlement.id,
    actor: 'partner',
    kind: 'partner-settlement',
    currencyCode: settlement.currency,
    amountMinorUnits: amount,
    amountLabel: formatWltYer(amount),
    tone: amount >= 0 ? 'positive' : 'negative',
    title: `Partner settlement · ${settlement.partner_id}`,
    subtitle: `WLT runtime · ${settlement.status}`,
    statusLabel: settlement.status,
    statusTone: isDone ? 'success' : 'warning',
    timeLabel: settlement.created_at,
    sourceStoreId: settlement.partner_id,
    sourceOrderId: settlement.order_id,
    settlementCycleId: settlement.id,
    isPreview: false,
  };
}

export async function getPartnerSnapshot(
  partnerId: string,
  bearerToken?: string | null,
): Promise<WltPartnerFinanceSnapshot> {
  const client = createWltDshTypedClient({
    bearerToken: bearerToken || undefined,
    devClientId: partnerId,
  });
  const { settlements } = await client.listPartnerSettlements(partnerId);
  const settlementRecords = settlements.map(settlementRecord);
  const netSettlementMinorUnits = settlements.reduce((sum, s) => sum + Math.round(s.partner_payout * 100), 0);

  return {
    ...EMPTY_PARTNER_FINANCE_SNAPSHOT,
    settlementRecords,
    grossSalesMinorUnits: netSettlementMinorUnits,
    grossSalesLabel: formatWltYer(netSettlementMinorUnits),
    netSettlementMinorUnits,
    netSettlementLabel: formatWltYer(netSettlementMinorUnits),
    nextSettlementMinorUnits: netSettlementMinorUnits,
    nextSettlementLabel: formatWltYer(netSettlementMinorUnits),
    totalLabel: formatWltYer(netSettlementMinorUnits),
    cycleStatus: settlements[0]?.status ?? 'empty',
    cycleStartDate: settlements[0]?.created_at ?? '—',
    cycleEndDate: settlements[0]?.created_at ?? '—',
    sourceLabel: 'WLT runtime',
    warnings: [],
    isPreview: false,
  };
}

const WltDshPartnerFinanceRuntimeAdapter = {
  EMPTY_PARTNER_FINANCE_SNAPSHOT,
  getPartnerSnapshot,
};

export default WltDshPartnerFinanceRuntimeAdapter;
