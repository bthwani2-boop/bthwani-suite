import React from 'react';
import {
  getBalance as getRuntimeBalance,
  isLinked as getRuntimeLinkedState,
  link as linkRuntimeWallet,
  requestPayment as requestRuntimePayment,
} from '../wallet/client-wallet-runtime.adapter';
import {
  createWalletFundingDeepLink,
  createPaymentDeepLink,
  resolveDeepLinkUrl,
} from '../payments/payment-deeplink.policy';

export function useWltDshWalletSession(clientId: string | undefined, bearerToken?: string) {
  const runtimeClientId = (clientId ?? '').trim();
  const [linked, setLinked] = React.useState<boolean>(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [lastError, setLastError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    if (!runtimeClientId) {
      setHydrated(true);
      return;
    }
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
    async (amountMinorUnits: number, orderId: string) => {
      if (!runtimeClientId) return Promise.reject(new Error('wlt:no_client_id'));
      if (!orderId.trim()) return Promise.reject(new Error('wlt:no_order_id'));
      if (amountMinorUnits <= 0) return Promise.reject(new Error('wlt:invalid_amount'));
      return requestRuntimePayment(amountMinorUnits, runtimeClientId, orderId, bearerToken);
    },
    [runtimeClientId, bearerToken],
  );

  const getBalance = React.useCallback(async () => {
    if (!runtimeClientId) return Promise.reject(new Error('wlt:no_client_id'));
    return getRuntimeBalance(runtimeClientId, bearerToken);
  }, [runtimeClientId, bearerToken]);

  const link = React.useCallback(async () => {
    if (!runtimeClientId) return Promise.reject(new Error('wlt:no_client_id'));
    const result = await linkRuntimeWallet(runtimeClientId, bearerToken);
    await refresh();
    return result;
  }, [runtimeClientId, bearerToken, refresh]);

  const createWalletFundingLink = React.useCallback((amountMinorUnits: number) => {
    return resolveDeepLinkUrl(createWalletFundingDeepLink(amountMinorUnits));
  }, []);

  const createOrderPaymentLink = React.useCallback((orderId: string, amountYer: number) => {
    return resolveDeepLinkUrl(createPaymentDeepLink(orderId, amountYer));
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
    createOrderPaymentLink,
  } as const;
}
