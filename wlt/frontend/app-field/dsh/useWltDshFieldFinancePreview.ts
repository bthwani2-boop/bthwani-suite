import React from 'react';
import { wltDshFieldBridgeDataContract } from './wlt-dsh-field.contract';
import * as WltFieldAdapter from './wlt-dsh-field.adapter';

function createStoreIdsKey(storeIds?: readonly string[]) {
  return storeIds?.join('|') ?? '';
}

export function useWltDshFieldFinancePreview(storeIds?: readonly string[]) {
  const storeIdsKey = createStoreIdsKey(storeIds);

  const snapshot = React.useMemo(() => WltFieldAdapter.getSnapshot(storeIds), [storeIdsKey]);
  const records = React.useMemo(() => WltFieldAdapter.getRecords(storeIds), [storeIdsKey]);
  const commissionRecords = React.useMemo(() => WltFieldAdapter.getCommissionRecords(storeIds), [storeIdsKey]);
  const payoutRecords = React.useMemo(() => WltFieldAdapter.getPayoutRecords(storeIds), [storeIdsKey]);

  return {
    contract: wltDshFieldBridgeDataContract,
    snapshot,
    records,
    commissionRecords,
    payoutRecords,
  } as const;
}

export default useWltDshFieldFinancePreview;
