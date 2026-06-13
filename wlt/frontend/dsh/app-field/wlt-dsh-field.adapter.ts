import { createWltDshTypedClient } from '../contracts';
import type { WltLedgerEntry } from '../contracts';
import {
  formatWltYer,
  type WltDshFinanceSummaryRecord,
  type WltFieldFinanceSnapshot,
} from '../shared';

function getClient() {
  return createWltDshTypedClient({});
}

function commissionRecord(entry: WltLedgerEntry): WltDshFinanceSummaryRecord {
  const amount = Math.round(entry.amount * 100);
  const isCompleted = entry.status === 'COMPLETED';
  return {
    id: entry.id,
    actor: 'field',
    kind: isCompleted ? 'field-commission' : 'field-commission-pending',
    currencyCode: entry.currency,
    amountMinorUnits: amount,
    amountLabel: formatWltYer(amount),
    tone: 'positive',
    title: `عمولة ميداني · ${entry.subject}`,
    subtitle: `WLT runtime · ${entry.reference_type}`,
    statusLabel: entry.status,
    statusTone: isCompleted ? 'success' : 'warning',
    timeLabel: entry.created_at,
    sourceFieldAgentId: entry.subject,
    sourceOrderId: entry.order_id,
    settlementCycleId: entry.reference_id,
    isPreview: false,
  };
}

export async function getSnapshot(fieldAgentId: string): Promise<WltFieldFinanceSnapshot> {
  const { entries } = await getClient().listFieldEarnings(fieldAgentId);
  const records = entries.map(commissionRecord);
  const totalCommissionMinorUnits = records
    .filter((r) => r.kind === 'field-commission')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0);
  const pendingCommissionsMinorUnits = records
    .filter((r) => r.kind === 'field-commission-pending')
    .reduce((sum, r) => sum + r.amountMinorUnits, 0);

  return {
    records,
    commissionRecords: records.filter((r) => r.kind === 'field-commission'),
    pendingRecords: records.filter((r) => r.kind === 'field-commission-pending'),
    rejectedRecords: [],
    payoutRecords: [],
    totalCommissionMinorUnits,
    totalCommissionLabel: formatWltYer(totalCommissionMinorUnits),
    pendingCommissionsMinorUnits,
    pendingCommissionsLabel: formatWltYer(pendingCommissionsMinorUnits),
    rejectedCommissionsMinorUnits: 0,
    rejectedCommissionsLabel: formatWltYer(0),
    eligibleFilesCount: records.length,
    lastPayoutMinorUnits: totalCommissionMinorUnits,
    lastPayoutLabel: formatWltYer(totalCommissionMinorUnits),
    lastPayoutDate: '—',
    nextPayoutDate: '—',
    contractState: 'CONTRACT_TBD',
    isPreview: false,
  };
}

export async function getRecords(fieldAgentId: string): Promise<WltDshFinanceSummaryRecord[]> {
  return (await getSnapshot(fieldAgentId)).records;
}

export async function getCommissionRecords(fieldAgentId: string): Promise<WltDshFinanceSummaryRecord[]> {
  return (await getSnapshot(fieldAgentId)).commissionRecords;
}

export async function getPendingCommissionRecords(fieldAgentId: string): Promise<WltDshFinanceSummaryRecord[]> {
  return (await getSnapshot(fieldAgentId)).pendingRecords;
}

export async function getRejectedCommissionRecords(fieldAgentId: string): Promise<WltDshFinanceSummaryRecord[]> {
  return (await getSnapshot(fieldAgentId)).rejectedRecords;
}

export async function getPayoutRecords(fieldAgentId: string): Promise<WltDshFinanceSummaryRecord[]> {
  return (await getSnapshot(fieldAgentId)).payoutRecords;
}

const WltDshFieldAdapter = {
  getSnapshot,
  getRecords,
  getCommissionRecords,
  getPendingCommissionRecords,
  getRejectedCommissionRecords,
  getPayoutRecords,
};

export default WltDshFieldAdapter;
