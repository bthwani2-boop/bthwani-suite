import type {
  WltDshFinanceSummaryRecord,
  WltFieldFinanceSnapshot,
} from '../shared/boundary/dshFinance.types';

export type WltDshFieldFinanceSummaryState = {
  storeIds?: readonly string[];
  snapshot: WltFieldFinanceSnapshot;
  records: readonly WltDshFinanceSummaryRecord[];
  commissionRecords: readonly WltDshFinanceSummaryRecord[];
  pendingRecords: readonly WltDshFinanceSummaryRecord[];
  rejectedRecords: readonly WltDshFinanceSummaryRecord[];
  payoutRecords: readonly WltDshFinanceSummaryRecord[];
};

export type WltDshFieldBridgeState = {
  finance: WltDshFieldFinanceSummaryState;
};
