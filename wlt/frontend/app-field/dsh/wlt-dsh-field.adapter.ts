import {
  getWltFieldFinanceSnapshot,
  type WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';

export function getSnapshot(storeIds?: readonly string[]) {
  return getWltFieldFinanceSnapshot(storeIds ? [...storeIds] : undefined);
}

export function getRecords(storeIds?: readonly string[]) {
  return getSnapshot(storeIds).records;
}

export function getCommissionRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-commission');
}

export function getPayoutRecords(storeIds?: readonly string[]): WltDshFinancePreviewRecord[] {
  return getRecords(storeIds).filter((record) => record.kind === 'field-payout');
}

const WltDshFieldAdapter = {
  getSnapshot,
  getRecords,
  getCommissionRecords,
  getPayoutRecords,
};

export default WltDshFieldAdapter;
