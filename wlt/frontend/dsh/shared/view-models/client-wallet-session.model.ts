import React from 'react';
import {
  createDeepLink,
  getBalance as getRuntimeBalance,
  isLinked as getRuntimeLinkedState,
  link as linkRuntimeWallet,
  requestPayment as requestRuntimePayment,
} from '../adapters/client-wallet-runtime.adapter';

export function useWltDshWalletSession(clientId?: string, bearerToken?: string) {
  const runtimeClientId = clientId?.trim() || 'client-dev-001';
  const [linked, setLinked] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const isLinked = await getRuntimeLinkedState(runtimeClientId, bearerToken);
      setLinked(Boolean(isLinked));
      if (isLinked) {
        const walletBalance = await getRuntimeBalance(runtimeClientId, bearerToken);
        setBalance(walletBalance);
      } else {
        setBalance(null);
      }
      setLastError(null);
    } catch {
      setLinked(false);
      setBalance(null);
      setLastError('wallet_refresh_failed');
    } finally {
      setHydrated(true);
      setRefreshing(false);
    }
  }, [runtimeClientId, bearerToken]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const requestPayment = React.useCallback(
    async (amountMinorUnits: number, orderId?: string) => {
      return requestRuntimePayment(amountMinorUnits, runtimeClientId, orderId ?? 'dsh-checkout', bearerToken);
    },
    [runtimeClientId, bearerToken],
  );

  const getBalance = React.useCallback(async () => {
    return getRuntimeBalance(runtimeClientId, bearerToken);
  }, [runtimeClientId, bearerToken]);

  const link = React.useCallback(async () => {
    const result = await linkRuntimeWallet(runtimeClientId, bearerToken);
    await refresh();
    return result;
  }, [runtimeClientId, bearerToken, refresh]);

  const createWalletFundingLink = React.useCallback((amountMinorUnits: number) => {
    return createDeepLink('wallet-funding', amountMinorUnits);
  }, []);

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
    createWalletFundingLink,
    createDeepLink,
  } as const;
}
