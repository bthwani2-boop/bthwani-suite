export type DshFinanceActor = 'client' | 'partner' | 'captain' | 'field';

export type DshFinanceEventKind =
  | 'client-payment'
  | 'wallet-payment'
  | 'cash-on-delivery'
  | 'partner-settlement'
  | 'captain-earning'
  | 'captain-cod-balance'
  | 'field-commission'
  | 'field-payout'
  | 'platform-commission'
  | 'refund-adjustment';

export interface DshFinancePreviewRecord {
  id: string;
  actor: DshFinanceActor;
  kind: DshFinanceEventKind;
  title: string;
  subtitle: string;
  amountLabel: string;
  amountHalalas?: number;
  tone: 'positive' | 'negative' | 'neutral';
  statusLabel: string;
  statusTone: 'success' | 'warning' | 'info' | 'error';
  timeLabel: string;
  sourceOrderId?: string;
  sourceStoreId?: string;
  sourceCaptainId?: string;
  sourceFieldAgentId?: string;
  settlementCycleId?: string;
}

const SEEDS: DshFinancePreviewRecord[] = [
  // Client Payment
  {
    id: 'TXN-001',
    actor: 'client',
    kind: 'client-payment',
    title: 'دفع طلب',
    subtitle: 'طلب رقم #ORD-2026-X1',
    amountLabel: '150.00 ر.س',
    amountHalalas: 15000,
    tone: 'negative',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'اليوم، 10:30 ص',
    sourceOrderId: 'ORD-2026-X1',
  },
  // Partner Settlement
  {
    id: 'STL-101',
    actor: 'partner',
    kind: 'partner-settlement',
    title: 'تسوية أسبوعية',
    subtitle: 'دورة رقم #CYC-05-01',
    amountLabel: '4,250.00 ر.س',
    amountHalalas: 425000,
    tone: 'positive',
    statusLabel: 'تم التحويل',
    statusTone: 'success',
    timeLabel: 'أمس',
    settlementCycleId: 'CYC-05-01',
    sourceStoreId: 'STORE-99',
  },
  // Captain COD
  {
    id: 'COD-201',
    actor: 'captain',
    kind: 'cash-on-delivery',
    title: 'تحصيل كاش',
    subtitle: 'طلب رقم #ORD-2026-X2',
    amountLabel: '210.00 ر.س',
    amountHalalas: 21000,
    tone: 'neutral',
    statusLabel: 'في المحفظة',
    statusTone: 'info',
    timeLabel: 'منذ ساعتين',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
  },
  // Captain Earning
  {
    id: 'ERN-202',
    actor: 'captain',
    kind: 'captain-earning',
    title: 'رسوم توصيل',
    subtitle: 'طلب رقم #ORD-2026-X2',
    amountLabel: '15.00 ر.س',
    amountHalalas: 1500,
    tone: 'positive',
    statusLabel: 'تم الكسب',
    statusTone: 'success',
    timeLabel: 'منذ ساعتين',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
  },
  // Field Commission
  {
    id: 'FLD-301',
    actor: 'field',
    kind: 'field-commission',
    title: 'عمولة استقطاب',
    subtitle: 'متجر #STORE-102',
    amountLabel: '50.00 ر.س',
    amountHalalas: 5000,
    tone: 'positive',
    statusLabel: 'تم التحقق',
    statusTone: 'success',
    timeLabel: 'الاثنين',
    sourceStoreId: 'STORE-102',
    sourceFieldAgentId: 'FLD-88',
  },
  // Field Payout
  {
    id: 'FLD-302',
    actor: 'field',
    kind: 'field-payout',
    title: 'صرف شهري',
    subtitle: 'أبريل 2026',
    amountLabel: '1,200.00 ر.س',
    amountHalalas: 120000,
    tone: 'negative',
    statusLabel: 'تم الصرف',
    statusTone: 'success',
    timeLabel: '1 مايو 2026',
    sourceFieldAgentId: 'FLD-88',
  },
];

export function getDshFinanceRecordsForActor(actor: DshFinanceActor): DshFinancePreviewRecord[] {
  return SEEDS.filter((r) => r.actor === actor);
}

export function getDshFinanceSummaryForActor(actor: DshFinanceActor) {
  const records = getDshFinanceRecordsForActor(actor);
  const totalHalalas = records.reduce((acc, r) => {
    if (r.tone === 'positive') return acc + (r.amountHalalas || 0);
    if (r.tone === 'negative') return acc - (r.amountHalalas || 0);
    return acc;
  }, 0);

  return {
    count: records.length,
    totalLabel: `${(totalHalalas / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} ر.س`,
    totalHalalas,
  };
}

export function getDshPartnerSettlementPreview() {
  return {
    records: getDshFinanceRecordsForActor('partner'),
    summary: getDshFinanceSummaryForActor('partner'),
    nextSettlementLabel: '850.25 ر.س',
    cycleStatus: 'نشطة',
  };
}

export function getDshCaptainFinancePreview() {
  const records = getDshFinanceRecordsForActor('captain');
  const codBalance = records
    .filter((r) => r.kind === 'cash-on-delivery')
    .reduce((acc, r) => acc + (r.amountHalalas || 0), 0);
  const earnings = records
    .filter((r) => r.kind === 'captain-earning')
    .reduce((acc, r) => acc + (r.amountHalalas || 0), 0);

  return {
    records,
    codBalanceLabel: `${(codBalance / 100).toFixed(2)} ر.س`,
    earningsLabel: `${(earnings / 100).toFixed(2)} ر.س`,
    settlementLabel: '0.00 ر.س',
    pendingPayoutLabel: '15.00 ر.س',
    cycleLabel: 'الأسبوع الحالي',
  };
}

export function getDshFieldFinancePreview(stores?: string[]) {
  const records = getDshFinanceRecordsForActor('field');
  // If stores provided, filter by sourceStoreId (mock logic)
  const filteredRecords = stores
    ? records.filter(r => !r.sourceStoreId || stores.includes(r.sourceStoreId))
    : records;

  const totalCommission = filteredRecords
    .filter(r => r.kind === 'field-commission')
    .reduce((acc, r) => acc + (r.amountHalalas || 0), 0);

  return {
    records: filteredRecords,
    totalCommissionLabel: `${(totalCommission / 100).toFixed(2)} ر.س`,
    eligibleFilesCount: stores?.length || 12,
    lastPayoutLabel: '1,200.00 ر.س',
    lastPayoutDate: '2026-05-01',
  };
}

export function resolveDshFinanceEventKindForPayment(method: 'cod' | 'wallet' | 'mixed' | 'official-wallets'): DshFinanceEventKind {
  if (method === 'cod') {
    return 'cash-on-delivery';
  }

  if (method === 'wallet' || method === 'mixed' || method === 'official-wallets') {
    return 'wallet-payment';
  }

  return 'client-payment';
}
