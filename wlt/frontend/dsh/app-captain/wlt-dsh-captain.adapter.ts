import { createWltDshTypedClient } from '../contracts';
import type { WltLedgerEntry } from '../contracts';
import {
  formatWltYer,
  type WltCaptainFinanceSection,
  type WltCaptainFinanceSnapshot,
  type WltDshFinanceSummaryRecord,
} from '../shared';

function getClient(bearerToken?: string | null) {
  return createWltDshTypedClient({ bearerToken: bearerToken ?? undefined });
}

function earningRecord(entry: WltLedgerEntry): WltDshFinanceSummaryRecord {
  const amount = Math.round(entry.amount * 100);
  return {
    id: entry.id,
    actor: 'captain',
    kind: 'captain-earning',
    currencyCode: entry.currency,
    amountMinorUnits: amount,
    amountLabel: formatWltYer(amount),
    tone: entry.transaction_type === 'CREDIT' ? 'positive' : 'negative',
    title: `أرباح كابتن · ${entry.subject}`,
    subtitle: `WLT runtime · ${entry.reference_type}`,
    statusLabel: entry.status,
    statusTone: entry.status === 'COMPLETED' ? 'success' : 'warning',
    timeLabel: entry.created_at,
    sourceOrderId: entry.order_id,
    sourceCaptainId: entry.subject,
    isPreview: false,
  };
}

export async function getSnapshot(captainId: string, bearerToken?: string | null): Promise<WltCaptainFinanceSnapshot> {
  const [walletSummary, earningsResponse] = await Promise.all([
    getClient(bearerToken).getCaptainWalletSummary(captainId),
    getClient(bearerToken).listCaptainEarnings(captainId),
  ]);
  const earningsMinorUnits = earningsResponse.entries
    .filter((e) => e.transaction_type === 'CREDIT')
    .reduce((sum, e) => sum + Math.round(e.amount * 100), 0);
  const balanceMinorUnits = Math.round(walletSummary.balance * 100);

  return {
    codLiabilityMinorUnits: 0,
    codLiabilityLabel: formatWltYer(0),
    earningsMinorUnits,
    earningsLabel: formatWltYer(earningsMinorUnits),
    settlementMinorUnits: 0,
    settlementLabel: formatWltYer(0),
    pendingPayoutMinorUnits: balanceMinorUnits,
    pendingPayoutLabel: formatWltYer(balanceMinorUnits),
    cycleLabel: '—',
    eligibilityBalanceMinorUnits: balanceMinorUnits,
    eligibilityBalanceLabel: formatWltYer(balanceMinorUnits),
    minimumEligibilityMinorUnits: 0,
    minimumEligibilityLabel: formatWltYer(0),
    isEligible: walletSummary.balance >= 0,
    eligibilityShortfallMinorUnits: 0,
    eligibilityShortfallLabel: formatWltYer(0),
    hasEligibilityBlock: false,
    eligibilityBlockReason: '',
    contractState: 'CONTRACT_TBD',
    isPreview: false,
  };
}

export async function getRecords(captainId: string, bearerToken?: string | null): Promise<WltDshFinanceSummaryRecord[]> {
  const { entries } = await getClient(bearerToken).listCaptainEarnings(captainId);
  return entries.map(earningRecord);
}

export function getSections() {
  return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export async function getRecordsForSection(
  section: WltCaptainFinanceSection,
  captainId: string,
  bearerToken?: string | null,
): Promise<WltDshFinanceSummaryRecord[]> {
  const records = await getRecords(captainId, bearerToken);
  if (section === 'earnings') return records.filter((r) => r.kind === 'captain-earning');
  return [];
}

export async function topUp(): Promise<{ success: boolean; error: string }> {
  return {
    success: false,
    error: 'wlt_captain_top_up_out_of_scope_for_dsh_runtime_slice',
  };
}

export async function requestSettlement(): Promise<{ success: boolean; error: string }> {
  return {
    success: false,
    error: 'wlt_payout_decision_requires_control_panel_wlt_operation',
  };
}

const WltDshCaptainAdapter = {
  getSnapshot,
  getRecords,
  getSections,
  getRecordsForSection,
  topUp,
  requestSettlement,
};

export default WltDshCaptainAdapter;
