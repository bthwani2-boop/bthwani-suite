import {
  getWltCaptainFinanceSnapshot,
  getWltDshFinanceRecordsForActor,
  formatWltYer,
  type WltCaptainFinanceSection,
  type WltDshFinancePreviewRecord,
  type WltCaptainFinanceSnapshot,
} from '../../control-panel/dsh/financeContracts';

const STORAGE_KEY_ELIGIBILITY_BALANCE = 'dsh_captain_eligibility_balance';
const STORAGE_KEY_PENDING_PAYOUT = 'dsh_captain_pending_payout';
const STORAGE_KEY_SETTLED_AMOUNT = 'dsh_captain_settled_amount';
const STORAGE_KEY_SETTLEMENT_STATUS = 'dsh_captain_settlement_status';
const STORAGE_KEY_CUSTOM_RECORDS = 'dsh_captain_custom_records';

function getStorageHandle() {
  try {
    return typeof globalThis !== 'undefined' && 'localStorage' in globalThis ? globalThis.localStorage : null;
  } catch {
    return null;
  }
}

export function readEligibilityBalance(): number {
  const storage = getStorageHandle();
  if (storage) {
    const raw = storage.getItem(STORAGE_KEY_ELIGIBILITY_BALANCE);
    if (raw != null) {
      const num = Number(raw);
      if (Number.isFinite(num)) return num;
    }
  }
  return 800000; // default 8,000 YER (represented as 800000 minor units)
}

export function writeEligibilityBalance(val: number): void {
  const storage = getStorageHandle();
  if (storage) {
    storage.setItem(STORAGE_KEY_ELIGIBILITY_BALANCE, String(val));
  }
}

export function readPendingPayout(): number {
  const storage = getStorageHandle();
  if (storage) {
    const raw = storage.getItem(STORAGE_KEY_PENDING_PAYOUT);
    if (raw != null) {
      const num = Number(raw);
      if (Number.isFinite(num)) return num;
    }
  }
  return 150000; // default 1,500 YER (represented as 150000 minor units)
}

export function writePendingPayout(val: number): void {
  const storage = getStorageHandle();
  if (storage) {
    storage.setItem(STORAGE_KEY_PENDING_PAYOUT, String(val));
  }
}

export function readSettledAmount(): number {
  const storage = getStorageHandle();
  if (storage) {
    const raw = storage.getItem(STORAGE_KEY_SETTLED_AMOUNT);
    if (raw != null) {
      const num = Number(raw);
      if (Number.isFinite(num)) return num;
    }
  }
  return 0; // default 0 YER
}

export function writeSettledAmount(val: number): void {
  const storage = getStorageHandle();
  if (storage) {
    storage.setItem(STORAGE_KEY_SETTLED_AMOUNT, String(val));
  }
}

export function readSettlementStatus(): string {
  const storage = getStorageHandle();
  if (storage) {
    const raw = storage.getItem(STORAGE_KEY_SETTLEMENT_STATUS);
    if (raw != null) return raw;
  }
  return 'idle';
}

export function writeSettlementStatus(val: string): void {
  const storage = getStorageHandle();
  if (storage) {
    storage.setItem(STORAGE_KEY_SETTLEMENT_STATUS, val);
  }
}

export function readCustomRecords(): WltDshFinancePreviewRecord[] {
  const storage = getStorageHandle();
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY_CUSTOM_RECORDS);
      if (raw) return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export function writeCustomRecords(records: WltDshFinancePreviewRecord[]): void {
  const storage = getStorageHandle();
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY_CUSTOM_RECORDS, JSON.stringify(records));
    } catch {
      // ignore
    }
  }
}

export function getSnapshot(): WltCaptainFinanceSnapshot {
  const eligibilityBalanceMinorUnits = readEligibilityBalance();
  const pendingPayoutMinorUnits = readPendingPayout();
  const settlementMinorUnits = readSettledAmount();
  const minimumEligibilityMinorUnits = 1000000;
  const isEligible = eligibilityBalanceMinorUnits >= minimumEligibilityMinorUnits;
  const eligibilityShortfallMinorUnits = Math.max(minimumEligibilityMinorUnits - eligibilityBalanceMinorUnits, 0);
  const hasEligibilityBlock = !isEligible;

  const records = getRecords();
  const codMinorUnits = records.filter((r) => r.kind === 'captain-cod-liability').reduce((acc, r) => acc + r.amountMinorUnits, 0);

  return {
    codLiabilityMinorUnits: codMinorUnits,
    codLiabilityLabel: formatWltYer(codMinorUnits),
    earningsMinorUnits: pendingPayoutMinorUnits + settlementMinorUnits,
    earningsLabel: formatWltYer(pendingPayoutMinorUnits + settlementMinorUnits),
    settlementMinorUnits,
    settlementLabel: formatWltYer(settlementMinorUnits),
    pendingPayoutMinorUnits,
    pendingPayoutLabel: formatWltYer(pendingPayoutMinorUnits),
    cycleLabel: 'الأسبوع الحالي',
    eligibilityBalanceMinorUnits,
    eligibilityBalanceLabel: formatWltYer(eligibilityBalanceMinorUnits),
    minimumEligibilityMinorUnits,
    minimumEligibilityLabel: formatWltYer(minimumEligibilityMinorUnits),
    isEligible,
    eligibilityShortfallMinorUnits,
    eligibilityShortfallLabel: formatWltYer(eligibilityShortfallMinorUnits),
    hasEligibilityBlock,
    eligibilityBlockReason: isEligible
      ? ''
      : `الرصيد الضامن أقل من الحد الأدنى المطلوب — شحن ${formatWltYer(eligibilityShortfallMinorUnits)} إضافية للتأهل`,
    contractState: 'CONTRACT_TBD',
    isPreview: true,
  };
}

export function getRecords(): WltDshFinancePreviewRecord[] {
  const seeds = getWltDshFinanceRecordsForActor('captain');
  const custom = readCustomRecords();
  return [...custom, ...seeds];
}

export function getSections() {
  return ['eligibility', 'cod-liability', 'earnings', 'settlement'] as const satisfies readonly WltCaptainFinanceSection[];
}

export function getRecordsForSection(section: WltCaptainFinanceSection): WltDshFinancePreviewRecord[] {
  const records = getRecords();

  if (section === 'eligibility') {
    return records.filter((record) => record.kind === 'captain-eligibility-topup');
  }

  if (section === 'cod-liability') {
    return records.filter((record) => record.kind === 'captain-cod-liability');
  }

  if (section === 'earnings') {
    return records.filter((record) => record.kind === 'captain-earning');
  }

  return [];
}

export function topUp(amountMinorUnits: number): { success: boolean; snapshot: WltCaptainFinanceSnapshot } {
  const current = readEligibilityBalance();
  const next = current + amountMinorUnits;
  writeEligibilityBalance(next);

  const customRecords = readCustomRecords();
  const newRecord: WltDshFinancePreviewRecord = {
    id: `WLT-TOPUP-${Date.now()}`,
    actor: 'captain',
    kind: 'captain-eligibility-topup',
    currencyCode: 'YER',
    amountMinorUnits,
    amountLabel: formatWltYer(amountMinorUnits),
    tone: 'positive',
    title: 'شحن رصيد الضامن',
    subtitle: 'شحن محلي للمحفظة للتأهل لاستقبل الطلبات',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'الآن',
    isPreview: true,
  };
  writeCustomRecords([newRecord, ...customRecords]);

  return { success: true, snapshot: getSnapshot() };
}

export function requestSettlement(): { success: boolean; snapshot: WltCaptainFinanceSnapshot } {
  const pending = readPendingPayout();
  if (pending <= 0) {
    return { success: false, snapshot: getSnapshot() };
  }

  writePendingPayout(0);
  writeSettledAmount(readSettledAmount() + pending);
  writeSettlementStatus('completed');

  const customRecords = readCustomRecords();
  const newRecord: WltDshFinancePreviewRecord = {
    id: `WLT-SETTLE-${Date.now()}`,
    actor: 'captain',
    kind: 'captain-earning', // visible in earnings section
    currencyCode: 'YER',
    amountMinorUnits: pending,
    amountLabel: formatWltYer(pending),
    tone: 'negative', // negative because paid out / debited
    title: 'تسوية المستحقات وصرف الأرباح',
    subtitle: 'تم تحويل المبلغ للحساب البنكي المعتمد',
    statusLabel: 'مكتمل',
    statusTone: 'success',
    timeLabel: 'الآن',
    isPreview: true,
  };
  writeCustomRecords([newRecord, ...customRecords]);

  return { success: true, snapshot: getSnapshot() };
}

export function resetFinance(): { snapshot: WltCaptainFinanceSnapshot } {
  const storage = getStorageHandle();
  if (storage) {
    storage.removeItem(STORAGE_KEY_ELIGIBILITY_BALANCE);
    storage.removeItem(STORAGE_KEY_PENDING_PAYOUT);
    storage.removeItem(STORAGE_KEY_SETTLED_AMOUNT);
    storage.removeItem(STORAGE_KEY_SETTLEMENT_STATUS);
    storage.removeItem(STORAGE_KEY_CUSTOM_RECORDS);
  }
  return { snapshot: getSnapshot() };
}

const WltDshCaptainAdapter = {
  getSnapshot,
  getRecords,
  getSections,
  getRecordsForSection,
  topUp,
  requestSettlement,
  resetFinance,
};

export default WltDshCaptainAdapter;
