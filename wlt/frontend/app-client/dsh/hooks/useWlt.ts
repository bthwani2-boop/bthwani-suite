import React from 'react';
import * as WltAdapter from '../WltAdapter';

export function useWlt() {
  const [linked, setLinked] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const l = await WltAdapter.isLinked();
      setLinked(Boolean(l));
      if (l) {
        const bal = await WltAdapter.getBalance();
        setBalance(bal);
      } else {
        setBalance(null);
      }
      setLastError(null);
    } catch (e) {
      setLinked(false);
      setBalance(null);
      setLastError('wallet_refresh_failed');
    } finally {
      setHydrated(true);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const requestPayment = React.useCallback(async (amountHalalas: number) => {
    return WltAdapter.requestPayment(amountHalalas);
  }, []);

  const getBalance = React.useCallback(async () => {
    return WltAdapter.getBalance();
  }, []);

  const link = React.useCallback(async () => {
    const r = await WltAdapter.link();
    await refresh();
    return r;
  }, [refresh]);

  const topUp = React.useCallback(async (amountHalalas: number) => {
    const r = await WltAdapter.topUp(amountHalalas);
    await refresh();
    return r;
  }, [refresh]);

  return {
    linked,
    balance,
    hydrated,
    refreshing,
    lastError,
    refresh,
    requestPayment,
    getBalance,
    link,
    topUp,
    createDeepLink: WltAdapter.createDeepLink,
  } as const;
}

export default useWlt;
