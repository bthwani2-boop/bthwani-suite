import React from 'react';
import * as WltAdapter from './wlt-dsh-client.adapter';

export function useWltDshWalletSession(clientId?: string, bearerToken?: string) {
	const [linked, setLinked] = React.useState<boolean>(false);
	const [balance, setBalance] = React.useState<number | null>(null);
	const [hydrated, setHydrated] = React.useState<boolean>(false);
	const [refreshing, setRefreshing] = React.useState<boolean>(false);
	const [lastError, setLastError] = React.useState<string | null>(null);

	const refresh = React.useCallback(async () => {
		setRefreshing(true);
		try {
			const isLinked = await WltAdapter.isLinked(clientId, bearerToken);
			setLinked(Boolean(isLinked));

			if (isLinked) {
				const walletBalance = await WltAdapter.getBalance(clientId, bearerToken);
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
	}, [clientId, bearerToken]);

	React.useEffect(() => {
		void refresh();
	}, [refresh]);

	const requestPayment = React.useCallback(async (amountMinorUnits: number, orderId?: string) => {
		return WltAdapter.requestPayment(amountMinorUnits, clientId, bearerToken, orderId);
	}, [clientId, bearerToken]);

	const getBalance = React.useCallback(async () => {
		return WltAdapter.getBalance(clientId, bearerToken);
	}, [clientId, bearerToken]);

	const link = React.useCallback(async () => {
		const result = await WltAdapter.link(clientId, bearerToken);
		await refresh();
		return result;
	}, [clientId, bearerToken, refresh]);

	const topUp = React.useCallback(async (amountMinorUnits: number) => {
		const result = await WltAdapter.topUp(amountMinorUnits, clientId, bearerToken);
		await refresh();
		return result;
	}, [clientId, bearerToken, refresh]);

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

export default useWltDshWalletSession;
