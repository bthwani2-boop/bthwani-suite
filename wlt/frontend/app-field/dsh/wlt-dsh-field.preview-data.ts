import { getWltFieldFinanceSnapshot } from '../../shared/finance/dshFinancePreview';
import { wltDshFieldBridgeDataContract } from './wlt-dsh-field.contract';
import type { WltDshFieldBridgeState } from './wlt-dsh-field.types';

export function getWltDshFieldPreviewData(storeIds?: readonly string[]) {
  const snapshot = getWltFieldFinanceSnapshot(storeIds ? [...storeIds] : undefined);

  return {
    contract: wltDshFieldBridgeDataContract,
    finance: {
      storeIds,
      snapshot,
      records: snapshot.records,
      commissionRecords: snapshot.commissionRecords,
      pendingRecords: snapshot.pendingRecords,
      rejectedRecords: snapshot.rejectedRecords,
      payoutRecords: snapshot.payoutRecords,
    },
  } as const satisfies WltDshFieldBridgeState & {
    contract: typeof wltDshFieldBridgeDataContract;
  };
}
