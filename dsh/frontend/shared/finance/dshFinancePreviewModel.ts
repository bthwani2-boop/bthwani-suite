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
    title: 'Order Payment',
    subtitle: 'Order #ORD-2026-X1',
    amountLabel: 'SAR 150.00',
    amountHalalas: 15000,
    tone: 'negative',
    statusLabel: 'Completed',
    statusTone: 'success',
    timeLabel: 'Today, 10:30 AM',
    sourceOrderId: 'ORD-2026-X1',
  },
  // Partner Settlement
  {
    id: 'STL-101',
    actor: 'partner',
    kind: 'partner-settlement',
    title: 'Weekly Settlement',
    subtitle: 'Cycle #CYC-05-01',
    amountLabel: 'SAR 4,250.00',
    amountHalalas: 425000,
    tone: 'positive',
    statusLabel: 'Transferred',
    statusTone: 'success',
    timeLabel: 'Yesterday',
    settlementCycleId: 'CYC-05-01',
    sourceStoreId: 'STORE-99',
  },
  // Captain COD
  {
    id: 'COD-201',
    actor: 'captain',
    kind: 'cash-on-delivery',
    title: 'COD Collected',
    subtitle: 'Order #ORD-2026-X2',
    amountLabel: 'SAR 210.00',
    amountHalalas: 21000,
    tone: 'neutral',
    statusLabel: 'In Wallet',
    statusTone: 'info',
    timeLabel: '2 hours ago',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
  },
  // Captain Earning
  {
    id: 'ERN-202',
    actor: 'captain',
    kind: 'captain-earning',
    title: 'Delivery Fee',
    subtitle: 'Order #ORD-2026-X2',
    amountLabel: 'SAR 15.00',
    amountHalalas: 1500,
    tone: 'positive',
    statusLabel: 'Earned',
    statusTone: 'success',
    timeLabel: '2 hours ago',
    sourceOrderId: 'ORD-2026-X2',
    sourceCaptainId: 'CAP-77',
  },
  // Field Commission
  {
    id: 'FLD-301',
    actor: 'field',
    kind: 'field-commission',
    title: 'Onboarding Commission',
    subtitle: 'Store #STORE-102',
    amountLabel: 'SAR 50.00',
    amountHalalas: 5000,
    tone: 'positive',
    statusLabel: 'Verified',
    statusTone: 'success',
    timeLabel: 'Monday',
    sourceStoreId: 'STORE-102',
    sourceFieldAgentId: 'FLD-88',
  },
  // Field Payout
  {
    id: 'FLD-302',
    actor: 'field',
    kind: 'field-payout',
    title: 'Monthly Payout',
    subtitle: 'April 2026',
    amountLabel: 'SAR 1,200.00',
    amountHalalas: 120000,
    tone: 'negative',
    statusLabel: 'Paid',
    statusTone: 'success',
    timeLabel: '1 May 2026',
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
    totalLabel: `SAR ${(totalHalalas / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    totalHalalas,
  };
}

export function getDshPartnerSettlementPreview() {
  return {
    records: getDshFinanceRecordsForActor('partner'),
    summary: getDshFinanceSummaryForActor('partner'),
    nextSettlementLabel: 'SAR 850.25',
    cycleStatus: 'Active',
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
    codBalanceLabel: `SAR ${(codBalance / 100).toFixed(2)}`,
    earningsLabel: `SAR ${(earnings / 100).toFixed(2)}`,
    settlementLabel: 'SAR 0.00',
    pendingPayoutLabel: 'SAR 15.00',
    cycleLabel: 'Current Week',
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
    totalCommissionLabel: `SAR ${(totalCommission / 100).toFixed(2)}`,
    eligibleFilesCount: stores?.length || 12,
    lastPayoutLabel: 'SAR 1,200.00',
    lastPayoutDate: '2026-05-01',
  };
}
