/**
 * WLT Financial Center Preview — FIN-ACCOUNTING-DETAILS-FIRST
 *
 * المركز المالي: الحسابات والأرصدة والذمم والمستحقات أولاً.
 * المطابقة والإغلاق طبقة لاحقة فوق هذه البيانات — ليست مركز النظام.
 *
 * CONTRACT_SCAFFOLD_PREVIEW_ONLY — لا backend / ledger / real balances.
 * WLT يملك جميع الأرقام المالية الحقيقية. DSH يعرض فقط.
 */

import type { WltDshFinancePreviewRecord, WltDshFinanceEventKind } from './dshFinancePreview';
import { formatWltYer } from './dshFinancePreview';

// ─── Entry: قيد دفتر الأستاذ ──────────────────────────────────────

export type WltLedgerEntryKind =
  | 'cod-collection'
  | 'client-payment'
  | 'partner-settlement'
  | 'captain-earning'
  | 'field-commission'
  | 'store-fee'
  | 'platform-commission'
  | 'refund'
  | 'wallet-movement'
  | 'other';

export type WltLedgerEntryStatus = 'posted' | 'pending' | 'disputed' | 'blocked';

export type WltLedgerEntry = {
  readonly id: string;
  readonly debitAccountCode: string;
  readonly debitAccountLabel: string;
  readonly creditAccountCode: string;
  readonly creditAccountLabel: string;
  readonly amountMinorUnits: number;
  readonly amountLabel: string;
  readonly entryKind: WltLedgerEntryKind;
  readonly party: string;
  readonly partyKind: 'client' | 'captain' | 'partner' | 'field' | 'platform';
  readonly sourceRef: string;
  readonly statusLabel: string;
  readonly status: WltLedgerEntryStatus;
  readonly isPending: boolean;
  readonly needsReconciliation: boolean;
  readonly isPreview: true;
};

// ─── Account Position Line ─────────────────────────────────────────

export type WltAccountPositionLine = {
  readonly accountCode: string;
  readonly accountLabel: string;
  readonly accountType: 'asset' | 'liability' | 'revenue' | 'expense';
  readonly totalMinorUnits: number;
  readonly totalLabel: string;
  readonly entryCount: number;
  readonly pendingCount: number;
  readonly entries: readonly WltLedgerEntry[];
  readonly isPreview: true;
};

// ─── Financial Center ──────────────────────────────────────────────

export type WltFinancialCenterSection = {
  readonly sectionType: 'asset' | 'liability' | 'revenue' | 'expense';
  readonly sectionLabel: string;
  readonly totalMinorUnits: number;
  readonly totalLabel: string;
  readonly lines: readonly WltAccountPositionLine[];
};

export type WltFinancialCenterBlockingVariance = {
  readonly entryId: string;
  readonly description: string;
  readonly varianceMinorUnits: number;
  readonly varianceLabel: string;
  readonly partyKind: string;
  readonly reason: string;
};

export type WltFinancialCenter = {
  readonly businessDate: string;
  readonly sections: readonly WltFinancialCenterSection[];
  readonly allEntries: readonly WltLedgerEntry[];
  readonly totalAssets: number;
  readonly totalAssetsLabel: string;
  readonly totalLiabilities: number;
  readonly totalLiabilitiesLabel: string;
  readonly totalRevenue: number;
  readonly totalRevenueLabel: string;
  readonly totalExpenses: number;
  readonly totalExpensesLabel: string;
  readonly netPosition: number;
  readonly netPositionLabel: string;
  readonly blockingVariances: readonly WltFinancialCenterBlockingVariance[];
  readonly canClose: boolean;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
  readonly openingBalanceSource: 'none — no real ledger in preview';
  readonly closingBalanceSource: 'none — no real ledger in preview';
  readonly isPreview: true;
};

// ─── Event Kind → Account Mapping ─────────────────────────────────

type AccountPair = { debitCode: string; debitLabel: string; creditCode: string; creditLabel: string };

function resolveAccountPair(kind: WltDshFinanceEventKind): AccountPair {
  switch (kind) {
    case 'cash-on-delivery':
    case 'captain-cod-liability':
      return { debitCode: '1020', debitLabel: 'ذمم COD مستحقة (كابتن)', creditCode: '2010', creditLabel: 'مستحقات الكابتن' };
    case 'client-payment':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '2001', creditLabel: 'رصيد محفظة العميل' };
    case 'wallet-payment':
      return { debitCode: '2001', debitLabel: 'رصيد محفظة العميل', creditCode: '1010', creditLabel: 'رصيد المقاصة البنكية' };
    case 'partner-settlement':
      return { debitCode: '1030', debitLabel: 'مقاصة التسوية', creditCode: '2020', creditLabel: 'مستحقات الشريك' };
    case 'captain-earning':
    case 'captain-eligibility-topup':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '2010', creditLabel: 'مستحقات الكابتن' };
    case 'field-commission':
    case 'field-commission-pending':
    case 'field-commission-rejected':
    case 'field-payout':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '2030', creditLabel: 'مستحقات الميداني' };
    case 'store-delivery-fee':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '4010', creditLabel: 'إيرادات رسوم التوصيل' };
    case 'store-courier-compensation':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '2040', creditLabel: 'مستحقات موصل المتجر' };
    case 'refund-adjustment':
      return { debitCode: '5001', debitLabel: 'مصروف الاسترداد', creditCode: '2050', creditLabel: 'التزام الاسترداد للعميل' };
    case 'platform-commission':
    case 'reconciliation-export':
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '4001', creditLabel: 'إيرادات عمولة المنصة' };
    default:
      return { debitCode: '1010', debitLabel: 'رصيد المقاصة البنكية', creditCode: '1001', creditLabel: 'النقدية بالصندوق' };
  }
}

function resolveEntryKind(kind: WltDshFinanceEventKind): WltLedgerEntryKind {
  if (kind === 'cash-on-delivery' || kind === 'captain-cod-liability') return 'cod-collection';
  if (kind === 'client-payment' || kind === 'wallet-payment') return 'client-payment';
  if (kind === 'partner-settlement') return 'partner-settlement';
  if (kind === 'captain-earning' || kind === 'captain-eligibility-topup') return 'captain-earning';
  if (kind === 'field-commission' || kind === 'field-commission-pending' || kind === 'field-commission-rejected' || kind === 'field-payout') return 'field-commission';
  if (kind === 'store-delivery-fee' || kind === 'store-courier-compensation') return 'store-fee';
  if (kind === 'platform-commission' || kind === 'reconciliation-export') return 'platform-commission';
  if (kind === 'refund-adjustment') return 'refund';
  return 'other';
}

function resolveEntryStatus(record: WltDshFinancePreviewRecord): WltLedgerEntryStatus {
  if (record.statusTone === 'error') return 'blocked';
  if (record.statusTone === 'warning') return 'disputed';
  if (record.kind === 'field-commission-pending') return 'pending';
  return 'posted';
}

function resolvePartyLabel(record: WltDshFinancePreviewRecord): string {
  if (record.actor === 'captain' && record.sourceCaptainId) return `كابتن · ${record.sourceCaptainId}`;
  if (record.actor === 'partner' && record.sourceStoreId) return `متجر · ${record.sourceStoreId}`;
  if (record.actor === 'field' && record.sourceFieldAgentId) return `ميداني · ${record.sourceFieldAgentId}`;
  if (record.actor === 'client') return 'عميل';
  return 'المنصة';
}

function resolveSourceRef(record: WltDshFinancePreviewRecord): string {
  if (record.sourceOrderId) return `طلب ${record.sourceOrderId}`;
  if (record.settlementCycleId) return `دورة ${record.settlementCycleId}`;
  return `[معاينة] ${record.id}`;
}

// ─── Builder ───────────────────────────────────────────────────────

export function buildWltFinancialCenter(
  businessDate: string,
  records: ReadonlyArray<WltDshFinancePreviewRecord>,
): WltFinancialCenter {
  // Map each record to a ledger entry
  const allEntries: WltLedgerEntry[] = records.map((record) => {
    const accounts = resolveAccountPair(record.kind);
    const status = resolveEntryStatus(record);
    return {
      id: record.id,
      debitAccountCode: accounts.debitCode,
      debitAccountLabel: accounts.debitLabel,
      creditAccountCode: accounts.creditCode,
      creditAccountLabel: accounts.creditLabel,
      amountMinorUnits: record.amountMinorUnits,
      amountLabel: record.amountLabel,
      entryKind: resolveEntryKind(record.kind),
      party: resolvePartyLabel(record),
      partyKind: record.actor === 'control-panel' ? 'platform' : record.actor,
      sourceRef: resolveSourceRef(record),
      statusLabel: record.statusLabel,
      status,
      isPending: status === 'pending' || status === 'blocked',
      needsReconciliation: status !== 'posted',
      isPreview: true,
    };
  });

  // Aggregate by account code (credit side = the balance accumulator)
  const accountTotals = new Map<string, { label: string; type: 'asset' | 'liability' | 'revenue' | 'expense'; total: number; entries: WltLedgerEntry[] }>();

  const CODE_TYPE: Record<string, { label: string; type: 'asset' | 'liability' | 'revenue' | 'expense' }> = {
    '1001': { label: 'النقدية بالصندوق', type: 'asset' },
    '1010': { label: 'رصيد المقاصة البنكية', type: 'asset' },
    '1020': { label: 'ذمم COD مستحقة (كابتن)', type: 'asset' },
    '1030': { label: 'مقاصة التسوية', type: 'asset' },
    '2001': { label: 'رصيد محفظة العميل (التزام)', type: 'liability' },
    '2010': { label: 'مستحقات الكابتن', type: 'liability' },
    '2020': { label: 'مستحقات الشريك', type: 'liability' },
    '2030': { label: 'مستحقات الميداني', type: 'liability' },
    '2040': { label: 'مستحقات موصل المتجر', type: 'liability' },
    '2050': { label: 'التزام الاسترداد للعميل', type: 'liability' },
    '4001': { label: 'إيرادات عمولة المنصة', type: 'revenue' },
    '4010': { label: 'إيرادات رسوم التوصيل', type: 'revenue' },
    '5001': { label: 'مصروف الاسترداد', type: 'expense' },
    '5010': { label: 'مصروف الترويج والخصومات', type: 'expense' },
  };

  for (const entry of allEntries) {
    // Credit side accumulates the balance (what the account "holds")
    const creditMeta = CODE_TYPE[entry.creditAccountCode];
    if (creditMeta) {
      const existing = accountTotals.get(entry.creditAccountCode);
      if (existing) {
        existing.total += entry.amountMinorUnits;
        existing.entries.push(entry);
      } else {
        accountTotals.set(entry.creditAccountCode, {
          label: creditMeta.label,
          type: creditMeta.type,
          total: entry.amountMinorUnits,
          entries: [entry],
        });
      }
    }
  }

  // Build position lines grouped by type
  const buildSection = (type: 'asset' | 'liability' | 'revenue' | 'expense', sectionLabel: string): WltFinancialCenterSection => {
    const lines: WltAccountPositionLine[] = [];
    for (const [code, data] of accountTotals) {
      if (data.type !== type) continue;
      lines.push({
        accountCode: code,
        accountLabel: data.label,
        accountType: type,
        totalMinorUnits: data.total,
        totalLabel: formatWltYer(data.total),
        entryCount: data.entries.length,
        pendingCount: data.entries.filter((e) => e.isPending).length,
        entries: data.entries,
        isPreview: true,
      });
    }
    const total = lines.reduce((s, l) => s + l.totalMinorUnits, 0);
    return { sectionType: type, sectionLabel, totalMinorUnits: total, totalLabel: formatWltYer(total), lines };
  };

  const assetSection = buildSection('asset', 'الأصول');
  const liabilitySection = buildSection('liability', 'الالتزامات');
  const revenueSection = buildSection('revenue', 'الإيرادات');
  const expenseSection = buildSection('expense', 'المصروفات');

  const netPosition = assetSection.totalMinorUnits - liabilitySection.totalMinorUnits;

  // Blocking variances: entries with non-posted status
  const blockingVariances: WltFinancialCenterBlockingVariance[] = allEntries
    .filter((e) => e.needsReconciliation)
    .map((e) => ({
      entryId: e.id,
      description: `${e.party} — ${e.debitAccountLabel} ← ${e.creditAccountLabel}`,
      varianceMinorUnits: e.amountMinorUnits,
      varianceLabel: e.amountLabel,
      partyKind: e.partyKind,
      reason: e.status === 'blocked' ? 'محجوب من WLT' : e.status === 'disputed' ? 'قيد النزاع' : 'قيد المراجعة',
    }));

  return {
    businessDate,
    sections: [assetSection, liabilitySection, revenueSection, expenseSection],
    allEntries,
    totalAssets: assetSection.totalMinorUnits,
    totalAssetsLabel: assetSection.totalLabel,
    totalLiabilities: liabilitySection.totalMinorUnits,
    totalLiabilitiesLabel: liabilitySection.totalLabel,
    totalRevenue: revenueSection.totalMinorUnits,
    totalRevenueLabel: revenueSection.totalLabel,
    totalExpenses: expenseSection.totalMinorUnits,
    totalExpensesLabel: expenseSection.totalLabel,
    netPosition,
    netPositionLabel: formatWltYer(Math.abs(netPosition)),
    blockingVariances,
    canClose: blockingVariances.length === 0,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
    openingBalanceSource: 'none — no real ledger in preview',
    closingBalanceSource: 'none — no real ledger in preview',
    isPreview: true,
  };
}

export const WLT_FINANCIAL_CENTER_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  principle: 'Accounts → Journal Entries → Balances → Reconciliation (as control layer) → Close',
  isPreview: true,
} as const;
