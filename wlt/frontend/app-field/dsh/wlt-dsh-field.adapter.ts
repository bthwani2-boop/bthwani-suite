import {
  getWltFieldFinanceSnapshot,
  type WltDshFinancePreviewRecord,
} from '../../control-panel/dsh/financeContracts';

export function getSnapshot(storeIds?: readonly string[]) {
  return getWltFieldFinanceSnapshot(storeIds ? [...storeIds] : undefined);
}

export function getRecords(storeIds?: readonly string[]) {
  return getSnapshot(storeIds).records;
}

export function getCommissionRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-commission');
}

export function getPendingCommissionRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-commission-pending');
}

export function getRejectedCommissionRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-commission-rejected');
}

export function getPayoutRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-payout');
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
