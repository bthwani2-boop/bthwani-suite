import type {
  WltDshFinancePreviewRecord,
  WltFieldFinanceSnapshot,
} from '../control-panel/financeContracts';

export type WltDshFieldFinancePreviewState = {
  storeIds?: readonly string[];
  snapshot: WltFieldFinanceSnapshot;
  records: readonly WltDshFinancePreviewRecord[];
  commissionRecords: readonly WltDshFinancePreviewRecord[];
  pendingRecords: readonly WltDshFinancePreviewRecord[];
  rejectedRecords: readonly WltDshFinancePreviewRecord[];
  payoutRecords: readonly WltDshFinancePreviewRecord[];
};

export type WltDshFieldBridgeState = {
  finance: WltDshFieldFinancePreviewState;
};
