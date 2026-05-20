/**
 * WLT-owned DSH Finance Preview Model.
 *
 * PREVIEW ONLY — not a real ledger, not a real payment, not a real settlement.
 * All amounts are in minor units (integer, never float). Currency: YER / ريال يمني.
 * WLT owns all financial artifacts. DSH owns order/delivery context only.
 *
 * Currency: YER  Label: ر.ي  Locale: ar-YE (with safe fallback)
 * Naming: amountMinorUnits — NOT halalas (halalas are Saudi subunits, not applicable here)
 */

export type WltDshFinanceActor = 'client' | 'partner' | 'captain' | 'field' | 'control-panel';

export type WltDshFinanceEventKind =
  | 'client-payment'
  | 'wallet-payment'
  | 'cash-on-delivery'
  | 'partner-settlement'
  | 'store-delivery-fee'
  | 'store-courier-compensation'
  | 'captain-earning'
  | 'captain-cod-liability'
  | 'captain-eligibility-topup'
  | 'field-commission'
  | 'field-commission-pending'
  | 'field-commission-rejected'
  | 'field-payout'
  | 'refund-adjustment'
  | 'platform-commission'
  | 'reconciliation-export';

export type WltDshFinanceTone = 'positive' | 'negative' | 'neutral';
export type WltDshFinanceStatusTone = 'success' | 'warning' | 'info' | 'error';

export interface WltDshFinancePreviewRecord {
  id: string;
  actor: WltDshFinanceActor;
  kind: WltDshFinanceEventKind;
  currencyCode: string;
  amountMinorUnits: number;
  amountLabel: string;
  tone: WltDshFinanceTone;
  title: string;
  subtitle: string;
  statusLabel: string;
  statusTone: WltDshFinanceStatusTone;
  timeLabel: string;
  sourceOrderId?: string;
  sourceStoreId?: string;
  sourceCaptainId?: string;
  sourceFieldAgentId?: string;
  settlementCycleId?: string;
  holdReason?: string;
  isPreview: true;
}

// ─── Currency formatter ───────────────────────────────────────────
// Uses ar-YE locale with a safe fallback to ar if runtime does not support ar-YE.
// Currency: YER (Yemeni Rial). Label suffix: ر.ي

function formatYer(minorUnits: number, currency = 'ر.ي'): string {
  const major = Math.abs(minorUnits) / 100;
  try {
    return `${major.toLocaleString('ar-YE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currency}`;
  } catch {
    return `${major.toLocaleString('ar', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currency}`;
  }
}

const PREVIEW_SEEDS: WltDshFinancePreviewRecord[] = [
  // ─── Client Payment ───────────────────────────────────────────
  {
    id: 'WLT-TXN-001',
    actor: 'client',
    kind: 'client-payment',
    currencyCode: 'YER',
    amountMinorUnits: 1500000,
    amountLabel: formatYer(1500000),
    tone: 'negative',
    title: 'دفع طلب',
    subtitle: 'طلب رقم #ORD-2026-X1',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'اليوم، 10:30 ص',
    sourceOrderId: 'ORD-2026-X1',
    isPreview: true,
  },
  // ─── Wallet Payment ───────────────────────────────────────────
  {
    id: 'WLT-TXN-002',
    actor: 'client',
    kind: 'wallet-payment',
    currencyCode: 'YER',
    amountMinorUnits: 850000,
    amountLabel: formatYer(850000),
    tone: 'negative',
    title: 'دفع بالمحفظة',
    subtitle: 'طلب رقم #ORD-2026-X3',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'اليوم، 12:10 م',
    sourceOrderId: 'ORD-2026-X3',
    isPreview: true,
  },
  // ─── Client Refund ────────────────────────────────────────────
  {
    id: 'WLT-REF-401',
    actor: 'client',
    kind: 'refund-adjustment',
    currencyCode: 'YER',
    amountMinorUnits: 300000,
    amountLabel: formatYer(300000),
    tone: 'positive',
    title: 'استرداد جزئي',
    subtitle: 'طلب رقم #ORD-2026-X1',
    statusLabel: 'تمت المعالجة',
    statusTone: 'info',
    timeLabel: 'اليوم، 11:00 ص',
    sourceOrderId: 'ORD-2026-X1',
    isPreview: true,
  },
  // ─── Partner Settlement ───────────────────────────────────────
  {
    id: 'WLT-STL-101',
    actor: 'partner',
    kind: 'partner-settlement',
    currencyCode: 'YER',
    amountMinorUnits: 42500000,
    amountLabel: formatYer(42500000),
    tone: 'positive',
    title: 'تسوية أسبوعية',
    subtitle: 'دورة رقم #CYC-05-01',
    statusLabel: 'تم التحويل',
    statusTone: 'success',
    timeLabel: 'أمس',
    settlementCycleId: 'CYC-05-01',
    sourceStoreId: 'STORE-99',
    isPreview: true,
  },
  // ─── Store Delivery Fee ───────────────────────────────────────────
  // Delivery fee paid by client for partner_delivery orders — goes to partner (per policy).
  // captainPayout does NOT apply here. This is NOT a BThwani captain earning.
  {
    id: 'WLT-SDF-701',
    actor: 'partner',
    kind: 'store-delivery-fee',
    currencyCode: 'YER',
    amountMinorUnits: 1200000,
    amountLabel: formatYer(1200000),
    tone: 'positive',
    title: 'رسوم توصيل المتجر',
    subtitle: 'طلب #ORD-2026-SD1 — partner_delivery (موصل المتجر)',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'اليوم، 09:15 ص',
    sourceOrderId: 'ORD-2026-SD1',
    sourceStoreId: 'STORE-99',
    isPreview: true,
  },
  // ─── Store Courier Compensation ───────────────────────────────────
  // What the PARTNER pays their OWN store courier — internal to the store.
  // NOT a BThwani captain settlement. NOT in WLT captain payout.
  {
    id: 'WLT-SCC-702',
    actor: 'partner',
    kind: 'store-courier-compensation',
    currencyCode: 'YER',
    amountMinorUnits: 400000,
    amountLabel: formatYer(400000),
    tone: 'negative',
    title: 'تعويض موصل المتجر',
    subtitle: 'المتجر يدفع لموصله الداخلي — ليس تسوية كابتن بثواني',
    statusLabel: 'مسجّل — ليس تسوية كابتن',
    statusTone: 'info',
    timeLabel: 'اليوم، 09:15 ص',
    sourceOrderId: 'ORD-2026-SD1',
    sourceStoreId: 'STORE-99',
    isPreview: true,
  },
  // ─── Captain COD Liability ────────────────────────────────────
  {
    id: 'WLT-COD-201',
    actor: 'captain',
    kind: 'captain-cod-liability',
    currencyCode: 'YER',
    amountMinorUnits: 2100000,
    amountLabel: formatYer(2100000),
    tone: 'neutral',
    title: 'تحصيل كاش — ذمة مستحقة',
    subtitle: 'طلب رقم #ORD-2026-X2 — يجب الإيداع',
    statusLabel: 'ذمة معلقة',
    statusTone: 'warning',
    timeLabel: 'منذ ساعتين',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
    isPreview: true,
  },
  // ─── Captain Earning ──────────────────────────────────────────
  {
    id: 'WLT-ERN-202',
    actor: 'captain',
    kind: 'captain-earning',
    currencyCode: 'YER',
    amountMinorUnits: 150000,
    amountLabel: formatYer(150000),
    tone: 'positive',
    title: 'رسوم توصيل',
    subtitle: 'طلب رقم #ORD-2026-X2',
    statusLabel: 'تم الكسب',
    statusTone: 'success',
    timeLabel: 'منذ ساعتين',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
    isPreview: true,
  },
  // ─── Field Commission (approved) ──────────────────────────────
  {
    id: 'WLT-FLD-301',
    actor: 'field',
    kind: 'field-commission',
    currencyCode: 'YER',
    amountMinorUnits: 500000,
    amountLabel: formatYer(500000),
    tone: 'positive',
    title: 'عمولة استقطاب — معتمدة',
    subtitle: 'متجر #STORE-102',
    statusLabel: 'تم التحقق',
    statusTone: 'success',
    timeLabel: 'الاثنين',
    sourceStoreId: 'STORE-102',
    sourceFieldAgentId: 'FLD-88',
    isPreview: true,
  },
  // ─── Field Commission (pending) ───────────────────────────────
  {
    id: 'WLT-FLD-303',
    actor: 'field',
    kind: 'field-commission-pending',
    currencyCode: 'YER',
    amountMinorUnits: 350000,
    amountLabel: formatYer(350000),
    tone: 'neutral',
    title: 'عمولة استقطاب — قيد المراجعة',
    subtitle: 'متجر #STORE-108 — بانتظار اعتماد العرض',
    statusLabel: 'معلقة',
    statusTone: 'warning',
    timeLabel: 'الأحد',
    sourceStoreId: 'STORE-108',
    sourceFieldAgentId: 'FLD-88',
    isPreview: true,
  },
  // ─── Field Commission (rejected) ──────────────────────────────
  {
    id: 'WLT-FLD-304',
    actor: 'field',
    kind: 'field-commission-rejected',
    currencyCode: 'YER',
    amountMinorUnits: 200000,
    amountLabel: formatYer(200000),
    tone: 'negative',
    title: 'عمولة استقطاب — مرفوضة',
    subtitle: 'متجر #STORE-110 — لم يُستوفَ شرط الاعتماد',
    statusLabel: 'مرفوضة',
    statusTone: 'error',
    timeLabel: 'الخميس',
    sourceStoreId: 'STORE-110',
    sourceFieldAgentId: 'FLD-88',
    holdReason: 'المتجر لم يكمل متطلبات التفعيل خلال المهلة المحددة',
    isPreview: true,
  },
  // ─── Field Payout ─────────────────────────────────────────────
  {
    id: 'WLT-FLD-302',
    actor: 'field',
    kind: 'field-payout',
    currencyCode: 'YER',
    amountMinorUnits: 12000000,
    amountLabel: formatYer(12000000),
    tone: 'negative',
    title: 'صرف شهري',
    subtitle: 'أبريل 2026',
    statusLabel: 'تم الصرف',
    statusTone: 'success',
    timeLabel: '1 مايو 2026',
    sourceFieldAgentId: 'FLD-88',
    isPreview: true,
  },
  // ─── Platform Commission ──────────────────────────────────────
  {
    id: 'WLT-COM-501',
    actor: 'control-panel',
    kind: 'platform-commission',
    currencyCode: 'YER',
    amountMinorUnits: 6375000,
    amountLabel: formatYer(6375000),
    tone: 'positive',
    title: 'عمولة المنصة',
    subtitle: 'دورة #CYC-05-01',
    statusLabel: 'مقيّد',
    statusTone: 'warning',
    timeLabel: 'أمس',
    settlementCycleId: 'CYC-05-01',
    isPreview: true,
  },
  // ─── Reconciliation / Export Preview ─────────────────────────
  {
    id: 'WLT-REC-601',
    actor: 'control-panel',
    kind: 'reconciliation-export',
    currencyCode: 'YER',
    amountMinorUnits: 0,
    amountLabel: '— جار المطابقة —',
    tone: 'neutral',
    title: 'تسوية المطابقة',
    subtitle: 'دورة مايو 2026 — غير مغلقة',
    statusLabel: 'قيد المراجعة',
    statusTone: 'warning',
    timeLabel: '9 مايو 2026',
    settlementCycleId: 'CYC-05-01',
    isPreview: true,
  },
];

// ─── Accessors ───────────────────────────────────────────────────

export function getWltDshFinanceRecordsForActor(
  actor: WltDshFinanceActor,
): WltDshFinancePreviewRecord[] {
  return PREVIEW_SEEDS.filter((r) => r.actor === actor);
}

function sumMinorUnits(records: WltDshFinancePreviewRecord[]): number {
  return records.reduce((acc, r) => {
    if (r.tone === 'positive') return acc + r.amountMinorUnits;
    if (r.tone === 'negative') return acc - r.amountMinorUnits;
    return acc;
  }, 0);
}

export function getWltDshFinanceSummaryForActor(actor: WltDshFinanceActor) {
  const records = getWltDshFinanceRecordsForActor(actor);
  const totalMinorUnits = sumMinorUnits(records);
  return {
    count: records.length,
    totalMinorUnits,
    totalLabel: formatYer(Math.abs(totalMinorUnits)),
  };
}

// ─── Per-actor preview helpers ────────────────────────────────────

export function getWltPartnerSettlementPreview() {
  const records = getWltDshFinanceRecordsForActor('partner');
  const summary = getWltDshFinanceSummaryForActor('partner');
  const grossSalesMinorUnits = 50000000;
  const platformCommissionMinorUnits = 7500000;
  const deductionsMinorUnits = 2000000;
  const netSettlementMinorUnits = grossSalesMinorUnits - platformCommissionMinorUnits - deductionsMinorUnits;
  return {
    records,
    summary,
    grossSalesMinorUnits,
    grossSalesLabel: formatYer(grossSalesMinorUnits),
    platformCommissionMinorUnits,
    platformCommissionLabel: formatYer(platformCommissionMinorUnits),
    deductionsMinorUnits,
    deductionsLabel: formatYer(deductionsMinorUnits),
    netSettlementMinorUnits,
    netSettlementLabel: formatYer(netSettlementMinorUnits),
    nextSettlementMinorUnits: 8502500,
    nextSettlementLabel: formatYer(8502500),
    cycleStatus: 'نشطة',
    cycleStartDate: '2026-05-01',
    cycleEndDate: '2026-05-07',
    nextPayoutDate: '2026-05-14',
    isPreview: true as const,
  };
}

export function getWltCaptainFinancePreview() {
  const records = getWltDshFinanceRecordsForActor('captain');
  const codMinorUnits = records
    .filter((r) => r.kind === 'captain-cod-liability')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const earningMinorUnits = records
    .filter((r) => r.kind === 'captain-earning')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return {
    records,
    codLiabilityMinorUnits: codMinorUnits,
    codLiabilityLabel: formatYer(codMinorUnits),
    earningsMinorUnits: earningMinorUnits,
    earningsLabel: formatYer(earningMinorUnits),
    settlementMinorUnits: 0,
    settlementLabel: formatYer(0),
    pendingPayoutMinorUnits: 150000,
    pendingPayoutLabel: formatYer(150000),
    cycleLabel: 'الأسبوع الحالي',
    // Eligibility fields
    eligibilityBalanceMinorUnits: 800000,
    eligibilityBalanceLabel: formatYer(800000),
    minimumEligibilityMinorUnits: 1000000,
    minimumEligibilityLabel: formatYer(1000000),
    isEligible: false,
    eligibilityShortfallMinorUnits: 200000,
    eligibilityShortfallLabel: formatYer(200000),
    hasEligibilityBlock: true,
    eligibilityBlockReason: 'الرصيد الضامن أقل من الحد الأدنى المطلوب — شحن 2,000 ر.ي إضافية للتأهل',
    isPreview: true as const,
  };
}

export function getWltFieldFinancePreview(stores?: string[]) {
  const records = getWltDshFinanceRecordsForActor('field');
  const filtered = stores
    ? records.filter((r) => !r.sourceStoreId || stores.includes(r.sourceStoreId))
    : records;
  const totalCommissionMinorUnits = filtered
    .filter((r) => r.kind === 'field-commission')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const pendingCommissionsMinorUnits = filtered
    .filter((r) => r.kind === 'field-commission-pending')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const rejectedCommissionsMinorUnits = filtered
    .filter((r) => r.kind === 'field-commission-rejected')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return {
    records: filtered,
    commissionRecords: filtered.filter((r) => r.kind === 'field-commission'),
    pendingRecords: filtered.filter((r) => r.kind === 'field-commission-pending'),
    rejectedRecords: filtered.filter((r) => r.kind === 'field-commission-rejected'),
    payoutRecords: filtered.filter((r) => r.kind === 'field-payout'),
    totalCommissionMinorUnits,
    totalCommissionLabel: formatYer(totalCommissionMinorUnits),
    pendingCommissionsMinorUnits,
    pendingCommissionsLabel: formatYer(pendingCommissionsMinorUnits),
    rejectedCommissionsMinorUnits,
    rejectedCommissionsLabel: formatYer(rejectedCommissionsMinorUnits),
    eligibleFilesCount: stores?.length ?? 12,
    lastPayoutMinorUnits: 12000000,
    lastPayoutLabel: formatYer(12000000),
    lastPayoutDate: '2026-05-01',
    nextPayoutDate: '2026-06-01',
    isPreview: true as const,
  };
}

export function getWltControlPanelFinancePreview() {
  const allRecords = PREVIEW_SEEDS;
  const platformRecords = getWltDshFinanceRecordsForActor('control-panel');
  const clientRecords = getWltDshFinanceRecordsForActor('client');
  const partnerRecords = getWltDshFinanceRecordsForActor('partner');
  const captainRecords = getWltDshFinanceRecordsForActor('captain');
  const fieldRecords = getWltDshFinanceRecordsForActor('field');
  const totalInflowMinorUnits = allRecords
    .filter((r) => r.tone === 'positive')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const totalOutflowMinorUnits = allRecords
    .filter((r) => r.tone === 'negative')
    .reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return {
    allRecords,
    platformRecords,
    clientRecords,
    partnerRecords,
    captainRecords,
    fieldRecords,
    totalInflowMinorUnits,
    totalInflowLabel: formatYer(totalInflowMinorUnits),
    totalOutflowMinorUnits,
    totalOutflowLabel: formatYer(totalOutflowMinorUnits),
    netMinorUnits: totalInflowMinorUnits - totalOutflowMinorUnits,
    netLabel: formatYer(Math.abs(totalInflowMinorUnits - totalOutflowMinorUnits)),
    contractState: 'CONTRACT_TBD' as const,
    isPreview: true as const,
  };
}

export function resolveWltDshFinanceEventKindForPaymentMethod(
  method: 'cod' | 'wallet' | 'mixed' | 'official-wallets',
): WltDshFinanceEventKind {
  if (method === 'cod') return 'cash-on-delivery';
  if (method === 'wallet' || method === 'mixed' || method === 'official-wallets') {
    return 'wallet-payment';
  }
  return 'client-payment';
}

// ─── F3: Typed snapshots ──────────────────────────────────────────

export type WltCaptainFinanceSection = 'eligibility' | 'cod-liability' | 'earnings' | 'settlement';

export type WltCaptainFinanceSnapshot = {
  codLiabilityMinorUnits: number;
  codLiabilityLabel: string;
  earningsMinorUnits: number;
  earningsLabel: string;
  settlementMinorUnits: number;
  settlementLabel: string;
  pendingPayoutMinorUnits: number;
  pendingPayoutLabel: string;
  cycleLabel: string;
  eligibilityBalanceMinorUnits: number;
  eligibilityBalanceLabel: string;
  minimumEligibilityMinorUnits: number;
  minimumEligibilityLabel: string;
  isEligible: boolean;
  eligibilityShortfallMinorUnits: number;
  eligibilityShortfallLabel: string;
  hasEligibilityBlock: boolean;
  eligibilityBlockReason: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export type WltPartnerFinanceSnapshot = {
  settlementRecords: WltDshFinancePreviewRecord[];
  grossSalesMinorUnits: number;
  grossSalesLabel: string;
  platformCommissionMinorUnits: number;
  platformCommissionLabel: string;
  deductionsMinorUnits: number;
  deductionsLabel: string;
  netSettlementMinorUnits: number;
  netSettlementLabel: string;
  nextSettlementMinorUnits: number;
  nextSettlementLabel: string;
  totalLabel: string;
  cycleStatus: string;
  cycleStartDate: string;
  cycleEndDate: string;
  nextPayoutDate: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export type WltFieldFinanceSnapshot = {
  records: WltDshFinancePreviewRecord[];
  commissionRecords: WltDshFinancePreviewRecord[];
  pendingRecords: WltDshFinancePreviewRecord[];
  rejectedRecords: WltDshFinancePreviewRecord[];
  payoutRecords: WltDshFinancePreviewRecord[];
  totalCommissionMinorUnits: number;
  totalCommissionLabel: string;
  pendingCommissionsMinorUnits: number;
  pendingCommissionsLabel: string;
  rejectedCommissionsMinorUnits: number;
  rejectedCommissionsLabel: string;
  eligibleFilesCount: number;
  lastPayoutMinorUnits: number;
  lastPayoutLabel: string;
  lastPayoutDate: string;
  nextPayoutDate: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export function getWltCaptainFinanceSnapshot(): WltCaptainFinanceSnapshot {
  const p = getWltCaptainFinancePreview();
  return {
    codLiabilityMinorUnits: p.codLiabilityMinorUnits,
    codLiabilityLabel: p.codLiabilityLabel,
    earningsMinorUnits: p.earningsMinorUnits,
    earningsLabel: p.earningsLabel,
    settlementMinorUnits: p.settlementMinorUnits,
    settlementLabel: p.settlementLabel,
    pendingPayoutMinorUnits: p.pendingPayoutMinorUnits,
    pendingPayoutLabel: p.pendingPayoutLabel,
    cycleLabel: p.cycleLabel,
    eligibilityBalanceMinorUnits: p.eligibilityBalanceMinorUnits,
    eligibilityBalanceLabel: p.eligibilityBalanceLabel,
    minimumEligibilityMinorUnits: p.minimumEligibilityMinorUnits,
    minimumEligibilityLabel: p.minimumEligibilityLabel,
    isEligible: p.isEligible,
    eligibilityShortfallMinorUnits: p.eligibilityShortfallMinorUnits,
    eligibilityShortfallLabel: p.eligibilityShortfallLabel,
    hasEligibilityBlock: p.hasEligibilityBlock,
    eligibilityBlockReason: p.eligibilityBlockReason,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

export function getWltPartnerFinanceSnapshot(): WltPartnerFinanceSnapshot {
  const p = getWltPartnerSettlementPreview();
  return {
    settlementRecords: p.records,
    grossSalesMinorUnits: p.grossSalesMinorUnits,
    grossSalesLabel: p.grossSalesLabel,
    platformCommissionMinorUnits: p.platformCommissionMinorUnits,
    platformCommissionLabel: p.platformCommissionLabel,
    deductionsMinorUnits: p.deductionsMinorUnits,
    deductionsLabel: p.deductionsLabel,
    netSettlementMinorUnits: p.netSettlementMinorUnits,
    netSettlementLabel: p.netSettlementLabel,
    nextSettlementMinorUnits: p.nextSettlementMinorUnits,
    nextSettlementLabel: p.nextSettlementLabel,
    totalLabel: p.summary.totalLabel,
    cycleStatus: p.cycleStatus,
    cycleStartDate: p.cycleStartDate,
    cycleEndDate: p.cycleEndDate,
    nextPayoutDate: p.nextPayoutDate,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

export function getWltFieldFinanceSnapshot(stores?: string[]): WltFieldFinanceSnapshot {
  const p = getWltFieldFinancePreview(stores);
  return {
    records: p.records,
    commissionRecords: p.commissionRecords,
    pendingRecords: p.pendingRecords,
    rejectedRecords: p.rejectedRecords,
    payoutRecords: p.payoutRecords,
    totalCommissionMinorUnits: p.totalCommissionMinorUnits,
    totalCommissionLabel: p.totalCommissionLabel,
    pendingCommissionsMinorUnits: p.pendingCommissionsMinorUnits,
    pendingCommissionsLabel: p.pendingCommissionsLabel,
    rejectedCommissionsMinorUnits: p.rejectedCommissionsMinorUnits,
    rejectedCommissionsLabel: p.rejectedCommissionsLabel,
    eligibleFilesCount: p.eligibleFilesCount,
    lastPayoutMinorUnits: p.lastPayoutMinorUnits,
    lastPayoutLabel: p.lastPayoutLabel,
    lastPayoutDate: p.lastPayoutDate,
    nextPayoutDate: p.nextPayoutDate,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

// ─── F2: Client Payment Preview ───────────────────────────────────

export type WltDshPaymentMethod = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

export type WltDshPaymentOptionPreview = {
  id: WltDshPaymentMethod;
  titleLabel: string;
  descriptionLabel: string;
  availabilityLabel: string;
  availabilityTone: WltDshFinanceStatusTone;
  isAvailable: boolean;
  isPreview: true;
};

export type WltDshPaymentPreviewState = {
  method: WltDshPaymentMethod;
  orderTotalMinorUnits: number;
  walletBalanceMinorUnits: number;
  walletLinked: boolean;
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  valid: boolean;
  summaryLabel: string;
  blockingLabel?: string;
  feedbackTone: WltDshFinanceStatusTone;
  financeEventKind: WltDshFinanceEventKind;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export function getWltDshClientPaymentPreview() {
  const records = getWltDshFinanceRecordsForActor('client');
  const summary = getWltDshFinanceSummaryForActor('client');
  const paymentRecords = records.filter((r) => r.kind === 'client-payment' || r.kind === 'wallet-payment');
  const refundRecords = records.filter((r) => r.kind === 'refund-adjustment');
  return {
    records,
    paymentRecords,
    refundRecords,
    summary,
    isPreview: true as const,
  };
}

export function getWltDshPaymentOptionsPreview(): WltDshPaymentOptionPreview[] {
  return [
    {
      id: 'cod',
      titleLabel: 'الدفع عند الاستلام',
      descriptionLabel: 'ادفع كامل المبلغ عند استلام الطلب.',
      availabilityLabel: 'متاح دائمًا',
      availabilityTone: 'success',
      isAvailable: true,
      isPreview: true,
    },
    {
      id: 'wallet',
      titleLabel: 'رصيد المحفظة (WLT)',
      descriptionLabel: 'ادفع من رصيد محفظة WLT الداخلية إذا توفر الرصيد.',
      availabilityLabel: 'يتطلب ربط وكفاية الرصيد',
      availabilityTone: 'warning',
      isAvailable: false,
      isPreview: true,
    },
    {
      id: 'mixed',
      titleLabel: 'دفع مدمج',
      descriptionLabel: 'جزء من المحفظة والباقي عند الاستلام.',
      availabilityLabel: 'يتطلب رصيدًا جزئيًا في WLT',
      availabilityTone: 'info',
      isAvailable: false,
      isPreview: true,
    },
    {
      id: 'official-wallets',
      titleLabel: 'المحافظ الرسمية',
      descriptionLabel: 'اختر محفظة رسمية معتمدة لإتمام الدفع.',
      availabilityLabel: 'CONTRACT_TBD — غير مفعّل',
      availabilityTone: 'warning',
      isAvailable: false,
      isPreview: true,
    },
  ];
}

export function resolveWltDshPaymentPreviewState(
  method: WltDshPaymentMethod,
  orderTotalMinorUnits: number,
  walletBalanceMinorUnits: number,
  walletLinked: boolean,
): WltDshPaymentPreviewState {
  const base = {
    method,
    orderTotalMinorUnits,
    walletBalanceMinorUnits,
    walletLinked,
    contractState: 'CONTRACT_TBD' as const,
    financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(method),
    isPreview: true as const,
  };

  if (method === 'cod') {
    return {
      ...base,
      walletAmountMinorUnits: 0,
      amountDueOnDeliveryMinorUnits: orderTotalMinorUnits,
      valid: true,
      summaryLabel: `ستدفع ${formatYer(orderTotalMinorUnits)} عند الاستلام.`,
      feedbackTone: 'info',
    };
  }

  if (method === 'wallet') {
    if (!walletLinked) {
      return {
        ...base,
        walletAmountMinorUnits: 0,
        amountDueOnDeliveryMinorUnits: orderTotalMinorUnits,
        valid: false,
        summaryLabel: 'المحفظة غير مرتبطة.',
        blockingLabel: 'اربط محفظة WLT أولًا لتفعيل هذا الخيار.',
        feedbackTone: 'warning',
      };
    }
    if (walletBalanceMinorUnits < orderTotalMinorUnits) {
      return {
        ...base,
        walletAmountMinorUnits: walletBalanceMinorUnits,
        amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits,
        valid: false,
        summaryLabel: `الرصيد ${formatYer(walletBalanceMinorUnits)} أقل من إجمالي الطلب.`,
        blockingLabel: `تحتاج شحن ${formatYer(orderTotalMinorUnits - walletBalanceMinorUnits)} إضافيًا.`,
        feedbackTone: 'warning',
      };
    }
    return {
      ...base,
      walletAmountMinorUnits: orderTotalMinorUnits,
      amountDueOnDeliveryMinorUnits: 0,
      valid: true,
      summaryLabel: `الرصيد يكفي — سيُخصم ${formatYer(orderTotalMinorUnits)} من المحفظة.`,
      feedbackTone: 'success',
    };
  }

  if (method === 'mixed') {
    if (!walletLinked || walletBalanceMinorUnits <= 0) {
      return {
        ...base,
        walletAmountMinorUnits: 0,
        amountDueOnDeliveryMinorUnits: orderTotalMinorUnits,
        valid: false,
        summaryLabel: 'الدفع المدمج يحتاج رصيدًا في المحفظة.',
        blockingLabel: 'لا يوجد رصيد متاح لتفعيل الدفع المدمج.',
        feedbackTone: 'warning',
      };
    }
    if (walletBalanceMinorUnits >= orderTotalMinorUnits) {
      return {
        ...base,
        walletAmountMinorUnits: orderTotalMinorUnits,
        amountDueOnDeliveryMinorUnits: 0,
        valid: false,
        summaryLabel: 'الرصيد يكفي للدفع الكامل من المحفظة.',
        blockingLabel: 'استخدم خيار "رصيد المحفظة" بدلًا من الدفع المدمج.',
        feedbackTone: 'info',
      };
    }
    return {
      ...base,
      walletAmountMinorUnits: walletBalanceMinorUnits,
      amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits,
      valid: true,
      summaryLabel: `${formatYer(walletBalanceMinorUnits)} من المحفظة + ${formatYer(orderTotalMinorUnits - walletBalanceMinorUnits)} عند الاستلام.`,
      feedbackTone: 'info',
    };
  }

  // official-wallets — always CONTRACT_TBD blocked
  return {
    ...base,
    walletAmountMinorUnits: 0,
    amountDueOnDeliveryMinorUnits: 0,
    valid: false,
    summaryLabel: 'المحافظ الرسمية غير مفعّلة — CONTRACT_TBD.',
    blockingLabel: 'يتطلب ربطًا بـ API لم يُعرَّف بعد.',
    feedbackTone: 'warning',
  };
}

// ─── Store Delivery Finance Preview ──────────────────────────────
// Strictly separated from BThwani captain finance.
// store-delivery-fee: client pays → goes to partner (per delivery policy).
// store-courier-compensation: partner pays their own courier — NOT WLT captain payout.
export function getWltDshStoreDeliveryFinancePreview() {
  const feeRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-delivery-fee');
  const compensationRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-courier-compensation');
  const totalFeeMinorUnits = feeRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const totalCompensationMinorUnits = compensationRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return {
    feeRecords,
    compensationRecords,
    totalFeeMinorUnits,
    totalFeeLabel: formatYer(totalFeeMinorUnits),
    totalCompensationMinorUnits,
    totalCompensationLabel: formatYer(totalCompensationMinorUnits),
    captainPayoutApplies: false as const,
    separationNote: 'تعويض موصل المتجر: المتجر يدفع لموصله — ليس تسوية كابتن بثواني ولا يظهر في محفظة الكابتن',
    isPreview: true as const,
  };
}

// ─── Public label helper (for use in UI components) ───────────────
export { formatYer as formatWltYer };

// ─── Phase 7: Per-mode commission model ──────────────────────────
// UI_PREVIEW_ONLY — WLT owns all real commission/settlement values.
// This model encodes STRUCTURE (which line items apply per mode), not rates.

export type WltDshFulfillmentMode = 'bthwani_delivery' | 'partner_delivery' | 'pickup';

export type WltDshOrderLineItemApplicability =
  | { applies: true; label: string }
  | { applies: false; reason: string };

export type WltDshOrderCommissionBreakdown = {
  fulfillmentMode: WltDshFulfillmentMode;
  fulfillmentModeLabel: string;
  /** deliveryFee: present for bthwani_delivery and partner_delivery; absent for pickup unless policy overrides */
  deliveryFee: WltDshOrderLineItemApplicability;
  platformCommission: WltDshOrderLineItemApplicability;
  /** captainPayout: ONLY for bthwani_delivery — never for partner_delivery or pickup */
  captainPayout: WltDshOrderLineItemApplicability;
  /** partnerCourierCost: ONLY for partner_delivery — preview only */
  partnerCourierCost: WltDshOrderLineItemApplicability;
  partnerNet: WltDshOrderLineItemApplicability;
  /** UI_PREVIEW_ONLY — real commission is per-partner + per-mode, owned by WLT */
  commissionRatePreview: 'UI_PREVIEW_ONLY';
  isPreview: true;
};

export function getWltDshOrderCommissionBreakdown(mode: WltDshFulfillmentMode): WltDshOrderCommissionBreakdown {
  const base = {
    fulfillmentMode: mode,
    commissionRatePreview: 'UI_PREVIEW_ONLY' as const,
    isPreview: true as const,
  };

  if (mode === 'bthwani_delivery') {
    return {
      ...base,
      fulfillmentModeLabel: 'توصيل بثواني',
      deliveryFee: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
      platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
      captainPayout: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
      partnerCourierCost: { applies: false, reason: 'لا ينطبق — كابتن بثواني هو المسؤول عن التوصيل' },
      partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
    };
  }

  if (mode === 'partner_delivery') {
    return {
      ...base,
      fulfillmentModeLabel: 'توصيل المتجر',
      deliveryFee: { applies: true, label: 'UI_PREVIEW_ONLY — حسب سياسة المتجر' },
      platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
      captainPayout: { applies: false, reason: 'لا ينطبق — لا يوجد كابتن بثواني في توصيل المتجر' },
      partnerCourierCost: { applies: true, label: 'UI_PREVIEW_ONLY — حسب اتفاق المتجر' },
      partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
    };
  }

  // pickup
  return {
    ...base,
    fulfillmentModeLabel: 'استلام بنفسي',
    deliveryFee: { applies: false, reason: 'لا رسوم توصيل — العميل يستلم بنفسه (ما لم تنص السياسة على خلاف ذلك)' },
    platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
    captainPayout: { applies: false, reason: 'لا ينطبق — لا يوجد كابتن في الاستلام الذاتي' },
    partnerCourierCost: { applies: false, reason: 'لا ينطبق — لا موصل في الاستلام الذاتي' },
    partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY — WLT' },
  };
}

// Per-partner, per-mode commission rate table — structure only; no hardcoded global rates.
// Real rates: per partner + per mode + optional category/product override — all in WLT engine.
export type WltDshPartnerModeRatePreview = {
  partnerId: string;
  storeLabel: string;
  rates: Readonly<Record<WltDshFulfillmentMode, 'UI_PREVIEW_ONLY'>>;
  isPreview: true;
};

export const WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW: readonly WltDshPartnerModeRatePreview[] = [
  { partnerId: 'partner-saha', storeLabel: 'محمصة الساحة', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-shorouq', storeLabel: 'بوفيه الشروق', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-zawya', storeLabel: 'مخبز الزاوية', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-nokhba', storeLabel: 'تمور النخبة', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
] as const;
