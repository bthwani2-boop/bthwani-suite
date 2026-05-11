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
      commissionRecords: snapshot.records.filter((record) => record.kind === 'field-commission'),
      payoutRecords: snapshot.records.filter((record) => record.kind === 'field-payout'),
    },
  } as const satisfies WltDshFieldBridgeState & {
    contract: typeof wltDshFieldBridgeDataContract;
  };
}
