/**
 * WLT-owned DSH Finance Preview Model.
 *
 * PREVIEW ONLY — not a real ledger, not a real payment, not a real settlement.
 * All amounts are in halalas (integer, never float). Currency: YER unless noted.
 * WLT owns all financial artifacts. DSH owns order/delivery context only.
 */

export type WltDshFinanceActor = 'client' | 'partner' | 'captain' | 'field' | 'control-panel';

export type WltDshFinanceEventKind =
  | 'client-payment'
  | 'wallet-payment'
  | 'cash-on-delivery'
  | 'partner-settlement'
  | 'captain-earning'
  | 'captain-cod-balance'
  | 'field-commission'
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
  amountHalalas: number;
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
  isPreview: true;
}

function halalasToLabel(halalas: number, currency = 'ر.س'): string {
  const major = Math.trunc(Math.abs(halalas)) / 100;
  return `${major.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ${currency}`;
}

const PREVIEW_SEEDS: WltDshFinancePreviewRecord[] = [
  // ─── Client Payment ───────────────────────────────────────────
  {
    id: 'WLT-TXN-001',
    actor: 'client',
    kind: 'client-payment',
    currencyCode: 'YER',
    amountHalalas: 15000,
    amountLabel: halalasToLabel(15000),
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
    amountHalalas: 8500,
    amountLabel: halalasToLabel(8500),
    tone: 'negative',
    title: 'دفع بالمحفظة',
    subtitle: 'طلب رقم #ORD-2026-X3',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'اليوم، 12:10 م',
    sourceOrderId: 'ORD-2026-X3',
    isPreview: true,
  },
  // ─── Partner Settlement ───────────────────────────────────────
  {
    id: 'WLT-STL-101',
    actor: 'partner',
    kind: 'partner-settlement',
    currencyCode: 'YER',
    amountHalalas: 425000,
    amountLabel: halalasToLabel(425000),
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
  // ─── Captain COD Balance ──────────────────────────────────────
  {
    id: 'WLT-COD-201',
    actor: 'captain',
    kind: 'cash-on-delivery',
    currencyCode: 'YER',
    amountHalalas: 21000,
    amountLabel: halalasToLabel(21000),
    tone: 'neutral',
    title: 'تحصيل كاش',
    subtitle: 'طلب رقم #ORD-2026-X2',
    statusLabel: 'في المحفظة',
    statusTone: 'info',
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
    amountHalalas: 1500,
    amountLabel: halalasToLabel(1500),
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
  // ─── Field Commission ─────────────────────────────────────────
  {
    id: 'WLT-FLD-301',
    actor: 'field',
    kind: 'field-commission',
    currencyCode: 'YER',
    amountHalalas: 5000,
    amountLabel: halalasToLabel(5000),
    tone: 'positive',
    title: 'عمولة استقطاب',
    subtitle: 'متجر #STORE-102',
    statusLabel: 'تم التحقق',
    statusTone: 'success',
    timeLabel: 'الاثنين',
    sourceStoreId: 'STORE-102',
    sourceFieldAgentId: 'FLD-88',
    isPreview: true,
  },
  // ─── Field Payout ─────────────────────────────────────────────
  {
    id: 'WLT-FLD-302',
    actor: 'field',
    kind: 'field-payout',
    currencyCode: 'YER',
    amountHalalas: 120000,
    amountLabel: halalasToLabel(120000),
    tone: 'negative',
    title: 'صرف شهري',
    subtitle: 'أبريل 2026',
    statusLabel: 'تم الصرف',
    statusTone: 'success',
    timeLabel: '1 مايو 2026',
    sourceFieldAgentId: 'FLD-88',
    isPreview: true,
  },
  // ─── Refund Adjustment ────────────────────────────────────────
  {
    id: 'WLT-REF-401',
    actor: 'client',
    kind: 'refund-adjustment',
    currencyCode: 'YER',
    amountHalalas: 3000,
    amountLabel: halalasToLabel(3000),
    tone: 'positive',
    title: 'استرداد جزئي',
    subtitle: 'طلب رقم #ORD-2026-X1',
    statusLabel: 'تمت المعالجة',
    statusTone: 'info',
    timeLabel: 'اليوم، 11:00 ص',
    sourceOrderId: 'ORD-2026-X1',
    isPreview: true,
  },
  // ─── Platform Commission ──────────────────────────────────────
  {
    id: 'WLT-COM-501',
    actor: 'control-panel',
    kind: 'platform-commission',
    currencyCode: 'YER',
    amountHalalas: 63750,
    amountLabel: halalasToLabel(63750),
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
    amountHalalas: 0,
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

function sumPositiveHalalas(records: WltDshFinancePreviewRecord[]): number {
  return records.reduce((acc, r) => {
    if (r.tone === 'positive') return acc + r.amountHalalas;
    if (r.tone === 'negative') return acc - r.amountHalalas;
    return acc;
  }, 0);
}

export function getWltDshFinanceSummaryForActor(actor: WltDshFinanceActor) {
  const records = getWltDshFinanceRecordsForActor(actor);
  const totalHalalas = sumPositiveHalalas(records);
  return {
    count: records.length,
    totalHalalas,
    totalLabel: halalasToLabel(Math.abs(totalHalalas)),
  };
}

// ─── Per-actor preview helpers ────────────────────────────────────

export function getWltPartnerSettlementPreview() {
  const records = getWltDshFinanceRecordsForActor('partner');
  const summary = getWltDshFinanceSummaryForActor('partner');
  return {
    records,
    summary,
    nextSettlementHalalas: 85025,
    nextSettlementLabel: halalasToLabel(85025),
    cycleStatus: 'نشطة',
    isPreview: true as const,
  };
}

export function getWltCaptainFinancePreview() {
  const records = getWltDshFinanceRecordsForActor('captain');
  const codHalalas = records
    .filter((r) => r.kind === 'cash-on-delivery')
    .reduce((acc, r) => acc + r.amountHalalas, 0);
  const earningHalalas = records
    .filter((r) => r.kind === 'captain-earning')
    .reduce((acc, r) => acc + r.amountHalalas, 0);
  return {
    records,
    codBalanceHalalas: codHalalas,
    codBalanceLabel: halalasToLabel(codHalalas),
    earningsHalalas: earningHalalas,
    earningsLabel: halalasToLabel(earningHalalas),
    settlementHalalas: 0,
    settlementLabel: halalasToLabel(0),
    pendingPayoutHalalas: 1500,
    pendingPayoutLabel: halalasToLabel(1500),
    cycleLabel: 'الأسبوع الحالي',
    isPreview: true as const,
  };
}

export function getWltFieldFinancePreview(stores?: string[]) {
  const records = getWltDshFinanceRecordsForActor('field');
  const filtered = stores
    ? records.filter((r) => !r.sourceStoreId || stores.includes(r.sourceStoreId))
    : records;
  const totalCommissionHalalas = filtered
    .filter((r) => r.kind === 'field-commission')
    .reduce((acc, r) => acc + r.amountHalalas, 0);
  return {
    records: filtered,
    totalCommissionHalalas,
    totalCommissionLabel: halalasToLabel(totalCommissionHalalas),
    eligibleFilesCount: stores?.length ?? 12,
    lastPayoutHalalas: 120000,
    lastPayoutLabel: halalasToLabel(120000),
    lastPayoutDate: '2026-05-01',
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
  const totalInflowHalalas = allRecords
    .filter((r) => r.tone === 'positive')
    .reduce((acc, r) => acc + r.amountHalalas, 0);
  const totalOutflowHalalas = allRecords
    .filter((r) => r.tone === 'negative')
    .reduce((acc, r) => acc + r.amountHalalas, 0);
  return {
    allRecords,
    platformRecords,
    clientRecords,
    partnerRecords,
    captainRecords,
    fieldRecords,
    totalInflowHalalas,
    totalInflowLabel: halalasToLabel(totalInflowHalalas),
    totalOutflowHalalas,
    totalOutflowLabel: halalasToLabel(totalOutflowHalalas),
    netHalalas: totalInflowHalalas - totalOutflowHalalas,
    netLabel: halalasToLabel(Math.abs(totalInflowHalalas - totalOutflowHalalas)),
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

// ─── F3: Partner / Captain / Field Finance Preview ───────────────
// PREVIEW ONLY. No real settlement, no real payout, no API.

export type WltCaptainFinanceSection = 'cod-balance' | 'earnings' | 'settlement';

export type WltCaptainFinanceSnapshot = {
  codBalanceHalalas: number;
  codBalanceLabel: string;
  earningsHalalas: number;
  earningsLabel: string;
  settlementHalalas: number;
  settlementLabel: string;
  pendingPayoutHalalas: number;
  pendingPayoutLabel: string;
  cycleLabel: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export type WltPartnerFinanceSnapshot = {
  settlementRecords: WltDshFinancePreviewRecord[];
  nextSettlementHalalas: number;
  nextSettlementLabel: string;
  totalLabel: string;
  cycleStatus: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export type WltFieldFinanceSnapshot = {
  records: WltDshFinancePreviewRecord[];
  totalCommissionHalalas: number;
  totalCommissionLabel: string;
  eligibleFilesCount: number;
  lastPayoutHalalas: number;
  lastPayoutLabel: string;
  lastPayoutDate: string;
  contractState: 'CONTRACT_TBD';
  isPreview: true;
};

export function getWltCaptainFinanceSnapshot(): WltCaptainFinanceSnapshot {
  const p = getWltCaptainFinancePreview();
  return {
    codBalanceHalalas: p.codBalanceHalalas,
    codBalanceLabel: p.codBalanceLabel,
    earningsHalalas: p.earningsHalalas,
    earningsLabel: p.earningsLabel,
    settlementHalalas: p.settlementHalalas,
    settlementLabel: p.settlementLabel,
    pendingPayoutHalalas: p.pendingPayoutHalalas,
    pendingPayoutLabel: p.pendingPayoutLabel,
    cycleLabel: p.cycleLabel,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

export function getWltPartnerFinanceSnapshot(): WltPartnerFinanceSnapshot {
  const p = getWltPartnerSettlementPreview();
  return {
    settlementRecords: p.records,
    nextSettlementHalalas: p.nextSettlementHalalas,
    nextSettlementLabel: p.nextSettlementLabel,
    totalLabel: p.summary.totalLabel,
    cycleStatus: p.cycleStatus,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

export function getWltFieldFinanceSnapshot(stores?: string[]): WltFieldFinanceSnapshot {
  const p = getWltFieldFinancePreview(stores);
  return {
    records: p.records,
    totalCommissionHalalas: p.totalCommissionHalalas,
    totalCommissionLabel: p.totalCommissionLabel,
    eligibleFilesCount: p.eligibleFilesCount,
    lastPayoutHalalas: p.lastPayoutHalalas,
    lastPayoutLabel: p.lastPayoutLabel,
    lastPayoutDate: p.lastPayoutDate,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

// ─── F2: Client Payment Preview Binding ──────────────────────────
// PREVIEW ONLY — no real payment, no real balance mutation, no API.

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
  orderTotalHalalas: number;
  walletBalanceHalalas: number;
  walletLinked: boolean;
  walletAmountHalalas: number;
  amountDueOnDeliveryHalalas: number;
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
  orderTotalHalalas: number,
  walletBalanceHalalas: number,
  walletLinked: boolean,
): WltDshPaymentPreviewState {
  const base = {
    method,
    orderTotalHalalas,
    walletBalanceHalalas,
    walletLinked,
    contractState: 'CONTRACT_TBD' as const,
    financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(method),
    isPreview: true as const,
  };

  if (method === 'cod') {
    return {
      ...base,
      walletAmountHalalas: 0,
      amountDueOnDeliveryHalalas: orderTotalHalalas,
      valid: true,
      summaryLabel: `ستدفع ${halalasToLabel(orderTotalHalalas)} عند الاستلام.`,
      feedbackTone: 'info',
    };
  }

  if (method === 'wallet') {
    if (!walletLinked) {
      return {
        ...base,
        walletAmountHalalas: 0,
        amountDueOnDeliveryHalalas: orderTotalHalalas,
        valid: false,
        summaryLabel: 'المحفظة غير مرتبطة.',
        blockingLabel: 'اربط محفظة WLT أولًا لتفعيل هذا الخيار.',
        feedbackTone: 'warning',
      };
    }
    if (walletBalanceHalalas < orderTotalHalalas) {
      return {
        ...base,
        walletAmountHalalas: walletBalanceHalalas,
        amountDueOnDeliveryHalalas: orderTotalHalalas - walletBalanceHalalas,
        valid: false,
        summaryLabel: `الرصيد ${halalasToLabel(walletBalanceHalalas)} أقل من إجمالي الطلب.`,
        blockingLabel: `تحتاج شحن ${halalasToLabel(orderTotalHalalas - walletBalanceHalalas)} إضافيًا.`,
        feedbackTone: 'warning',
      };
    }
    return {
      ...base,
      walletAmountHalalas: orderTotalHalalas,
      amountDueOnDeliveryHalalas: 0,
      valid: true,
      summaryLabel: `الرصيد يكفي — سيُخصم ${halalasToLabel(orderTotalHalalas)} من المحفظة.`,
      feedbackTone: 'success',
    };
  }

  if (method === 'mixed') {
    if (!walletLinked || walletBalanceHalalas <= 0) {
      return {
        ...base,
        walletAmountHalalas: 0,
        amountDueOnDeliveryHalalas: orderTotalHalalas,
        valid: false,
        summaryLabel: 'الدفع المدمج يحتاج رصيدًا في المحفظة.',
        blockingLabel: 'لا يوجد رصيد متاح لتفعيل الدفع المدمج.',
        feedbackTone: 'warning',
      };
    }
    if (walletBalanceHalalas >= orderTotalHalalas) {
      return {
        ...base,
        walletAmountHalalas: orderTotalHalalas,
        amountDueOnDeliveryHalalas: 0,
        valid: false,
        summaryLabel: 'الرصيد يكفي للدفع الكامل من المحفظة.',
        blockingLabel: 'استخدم خيار "رصيد المحفظة" بدلًا من الدفع المدمج.',
        feedbackTone: 'info',
      };
    }
    return {
      ...base,
      walletAmountHalalas: walletBalanceHalalas,
      amountDueOnDeliveryHalalas: orderTotalHalalas - walletBalanceHalalas,
      valid: true,
      summaryLabel: `${halalasToLabel(walletBalanceHalalas)} من المحفظة + ${halalasToLabel(orderTotalHalalas - walletBalanceHalalas)} عند الاستلام.`,
      feedbackTone: 'info',
    };
  }

  // official-wallets — always CONTRACT_TBD blocked
  return {
    ...base,
    walletAmountHalalas: 0,
    amountDueOnDeliveryHalalas: 0,
    valid: false,
    summaryLabel: 'المحافظ الرسمية غير مفعّلة — CONTRACT_TBD.',
    blockingLabel: 'يتطلب ربطًا بـ API لم يُعرَّف بعد.',
    feedbackTone: 'warning',
  };
}
