import React from 'react';
import { wltDshFieldBridgeDataContract } from './wlt-dsh-field.contract';
import * as WltFieldAdapter from './wlt-dsh-field.adapter';
import {
  getWltFieldFinanceSnapshot,
  type WltDshFinancePreviewRecord,
  type WltFieldFinanceSnapshot,
} from '../../control-panel/dsh/financeContracts';

function createStoreIdsKey(storeIds?: readonly string[]) {
  return storeIds?.join('|') ?? '';
}

export function useWltDshFieldFinancePreview(storeIds?: readonly string[]) {
  const storeIdsKey = createStoreIdsKey(storeIds);
  const [snapshot, setSnapshot] = React.useState<WltFieldFinanceSnapshot>(() => getWltFieldFinanceSnapshot(storeIds ? [...storeIds] : undefined));
  const [lastError, setLastError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void WltFieldAdapter.getSnapshot(storeIds?.[0] ?? undefined)
      .then((nextSnapshot) => {
        if (cancelled) return;
        setSnapshot(nextSnapshot);
        setLastError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        setLastError(error instanceof Error ? error.message : 'wlt_field_runtime_unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [storeIdsKey, storeIds]);

  const records = React.useMemo<readonly WltDshFinancePreviewRecord[]>(() => snapshot.records, [snapshot]);
  const commissionRecords = React.useMemo(() => snapshot.commissionRecords, [snapshot]);
  const pendingRecords = React.useMemo(() => snapshot.pendingRecords, [snapshot]);
  const rejectedRecords = React.useMemo(() => snapshot.rejectedRecords, [snapshot]);
  const payoutRecords = React.useMemo(() => snapshot.payoutRecords, [snapshot]);

  return {
    contract: wltDshFieldBridgeDataContract,
    snapshot,
    records,
    commissionRecords,
    pendingRecords,
    rejectedRecords,
    payoutRecords,
    lastError,
  } as const;
}

export default useWltDshFieldFinancePreview;
