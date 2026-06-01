/**
 * DSH Wallet & Finance Preview Data SSoT Adapter.
 *
 * This file dynamically adapts the central WLT-owned preview data from
 * `wlt/frontend/shared/finance/dshFinancePreview.ts` to DSH's control panel views.
 *
 * DSH has no independent financial truth.
 */

import {
  getWltControlPanelFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltDshStoreDeliveryFinancePreview,
  getWltFieldFinancePreview,
  type WltDshFinancePreviewRecord,
} from '../../../wlt/frontend/shared/finance/dshFinancePreview';

export const dshWalletPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'WLT-owned read-only preview reference',
} as const;

export type DshWalletReferencePreview = {
  id: string;
  ownerId: string;
  ownerKind: 'customer' | 'partner' | 'captain';
  label: string;
  balanceLabel: string;
  wltOwned: true;
};

export type DshFinancePreviewSurface =
  | 'overview'
  | 'settlements'
  | 'cod-reconciliation'
  | 'refunds'
  | 'captain-eligibility'
  | 'payouts'
  | 'ledger'
  | 'risk-audit'
  | 'captain-finance'
  | 'store-delivery-finance';

export type DshFinancePreviewRow = {
  id: string;
  amount: string;
  owner: string;
  status: string;
  risk: 'danger' | 'warning' | 'success';
  evidence: string;
  nextAction: string;
  recommendation: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  sla: string;
};

export const dshWalletReferencePreviews: readonly DshWalletReferencePreview[] = [
  { id: 'wallet-customer-preview', ownerId: 'customer-360-001', ownerKind: 'customer', label: 'محفظة العميل', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-captain-preview', ownerId: 'captain-preview-001', ownerKind: 'captain', label: 'رصيد الكابتن', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-partner-preview', ownerId: 'store-101', ownerKind: 'partner', label: 'تسوية الشريك', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
];

/**
 * Adapter mapping a WLT preview record to the DSH decision row format.
 */
function mapWltRecordToDshRow(record: WltDshFinancePreviewRecord): DshFinancePreviewRow {
  let risk: 'danger' | 'warning' | 'success' = 'success';
  if (record.statusTone === 'error') risk = 'danger';
  else if (record.statusTone === 'warning') risk = 'warning';

  let nextAction = 'عرض تفاصيل الحركة ودراسة الأدلة المتاحة';
  let primaryActionLabel = 'معاينة التفاصيل';

  if (record.kind === 'captain-cod-liability') {
    nextAction = 'تأكيد إيداع COD في البنك والمطابقة';
    primaryActionLabel = 'مطابقة الإيداع';
  } else if (record.kind === 'refund-adjustment') {
    nextAction = 'مراجعة مستندات الاسترداد والنزاع';
    primaryActionLabel = 'معاينة الاسترداد';
  } else if (record.kind === 'partner-settlement') {
    nextAction = 'مراجعة دورة التسوية وتحويل المستحقات';
    primaryActionLabel = 'مراجعة التسوية';
  } else if (record.kind === 'field-commission-pending') {
    nextAction = 'مراجعة مستندات الاستقطاب والتفعيل الميداني';
    primaryActionLabel = 'اعتماد العمولات';
  } else if (record.kind === 'reconciliation-export') {
    nextAction = 'بدء مطابقة دورة اليوم المالي';
    primaryActionLabel = 'معاينة السجل المالي';
  }

  // Construct a friendly arabic actor label
  const owner = record.actor === 'captain' && record.sourceCaptainId ? `كابتن · ${record.sourceCaptainId}`
    : record.actor === 'partner' && record.sourceStoreId ? `متجر · ${record.sourceStoreId}`
    : record.actor === 'field' && record.sourceFieldAgentId ? `ميداني · ${record.sourceFieldAgentId}`
    : record.title;

  return {
    id: record.id,
    amount: record.amountLabel,
    owner,
    status: record.statusLabel,
    risk,
    evidence: record.subtitle,
    nextAction,
    recommendation: record.holdReason || 'توصية بمطابقة الحركة الحالية بناءً على سجلات WLT المرجعية والالتزام بالاتفاق المالي.',
    primaryActionLabel,
    secondaryActionLabel: 'فتح الأدلة المالية',
    sla: record.timeLabel,
  };
}

/**
 * Dynamically build the rows for each control panel surface from WLT seeds.
 */
export function getAdaptedFinanceControlPanelRows(): Record<DshFinancePreviewSurface, ReadonlyArray<DshFinancePreviewRow>> {
  const wltPreview = getWltControlPanelFinancePreview();
  const capSnap = getWltCaptainFinanceSnapshot();
  const storeDelivery = getWltDshStoreDeliveryFinancePreview();
  const fieldPreview = getWltFieldFinancePreview();

  const overviewRows: DshFinancePreviewRow[] = [];
  const settlementsRows: DshFinancePreviewRow[] = [];
  const codReconciliationRows: DshFinancePreviewRow[] = [];
  const refundsRows: DshFinancePreviewRow[] = [];
  const captainEligibilityRows: DshFinancePreviewRow[] = [];
  const payoutsRows: DshFinancePreviewRow[] = [];
  const ledgerRows: DshFinancePreviewRow[] = [];
  const riskAuditRows: DshFinancePreviewRow[] = [];
  const captainFinanceRows: DshFinancePreviewRow[] = [];
  const storeDeliveryFinanceRows: DshFinancePreviewRow[] = [];

  // Map each of allRecords
  wltPreview.allRecords.forEach((record) => {
    const row = mapWltRecordToDshRow(record);

    // 1. Overview: Platform and critical/warning items
    if (record.actor === 'control-panel' || record.statusTone === 'error' || record.statusTone === 'warning') {
      overviewRows.push(row);
    }

    // 2. Settlements
    if (record.kind === 'partner-settlement' || record.kind === 'field-payout') {
      settlementsRows.push(row);
    }

    // 3. COD Reconciliation
    if (record.kind === 'captain-cod-liability') {
      codReconciliationRows.push(row);
    }

    // 4. Refunds
    if (record.kind === 'refund-adjustment') {
      refundsRows.push(row);
    }

    // 5. Payouts
    if (record.kind === 'field-payout' || record.kind === 'partner-settlement') {
      payoutsRows.push(row);
    }

    // 6. Ledger
    if (record.kind === 'platform-commission' || record.kind === 'reconciliation-export') {
      ledgerRows.push(row);
    }

    // 7. Risk Audit
    if (record.statusTone === 'error' || record.statusTone === 'warning' || record.holdReason) {
      riskAuditRows.push(row);
    }

    // 8. Captain Finance
    if (record.actor === 'captain') {
      captainFinanceRows.push(row);
    }

    // 9. Store Delivery Finance
    if (record.kind === 'store-delivery-fee' || record.kind === 'store-courier-compensation') {
      storeDeliveryFinanceRows.push(row);
    }
  });

  // Construct Captain Eligibility Row from WLT snapshot
  captainEligibilityRows.push({
    id: 'CEL-401',
    amount: capSnap.eligibilityBalanceLabel,
    owner: 'كابتن فهد · CAP-77',
    status: capSnap.isEligible ? 'مؤهل' : 'غير مؤهل',
    risk: capSnap.isEligible ? 'success' : 'warning',
    evidence: capSnap.eligibilityBlockReason,
    nextAction: 'فحص الرصيد الضامن والشحن للتأهل',
    recommendation: capSnap.eligibilityBlockReason,
    primaryActionLabel: 'محاكاة شحن الرصيد',
    secondaryActionLabel: 'فتح ملف الكابتن',
    sla: 'خلال ٢٤ ساعة',
  });

  return {
    overview: overviewRows.length > 0 ? overviewRows : [
      { id: 'FIN-EMPTY-1', amount: '٠ ر.ي', owner: 'نظرة عامة', status: 'سليم', risk: 'success', evidence: 'لا توجد فوارق مالية اليوم', nextAction: 'مراقبة مستمرة', recommendation: 'لا توجد إجراءات إضافية مطلوبة', primaryActionLabel: 'معاينة', secondaryActionLabel: 'فتح السجل', sla: 'مباشر' }
    ],
    settlements: settlementsRows,
    'cod-reconciliation': codReconciliationRows,
    refunds: refundsRows,
    'captain-eligibility': captainEligibilityRows,
    payouts: payoutsRows,
    ledger: ledgerRows,
    'risk-audit': riskAuditRows,
    'captain-finance': captainFinanceRows,
    'store-delivery-finance': storeDeliveryFinanceRows,
  };
}

export const dshFinanceControlPanelPreviewRows = getAdaptedFinanceControlPanelRows();
