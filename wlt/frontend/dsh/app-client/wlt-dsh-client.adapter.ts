// WLT DSH Client Adapter — runtime-bound HTTP bridge.
// DSH stores WLT references/status only; WLT owns wallet balance and payment outcome.

import { createWltDshTypedClient } from '../contracts';

export type WalletAccount = { id: string; name: string };

const DEFAULT_CLIENT_ID = 'client-demo';
const DEFAULT_ORDER_ID = 'dsh-client-runtime-payment';
const DEFAULT_CURRENCY = 'YER';

function getClient(bearerToken?: string, devClientId?: string) {
	return createWltDshTypedClient({ bearerToken, devClientId });
}

function paymentIdempotencyKey(clientId: string, orderId: string, amountMinorUnits: number): string {
	return `dsh-client-payment-${clientId}-${orderId}-${amountMinorUnits}`;
}

function normalizeError(error: unknown): string {
	if (error instanceof Error && error.message) return error.message;
	return 'wlt_runtime_unavailable';
}

export const isLinked = async (clientId?: string, bearerToken?: string): Promise<boolean> => {
	try {
		const cid = clientId || DEFAULT_CLIENT_ID;
		await getClient(bearerToken, cid).getClientWalletSummary(cid);
		return true;
	} catch {
		return false;
	}
};

export const getBalance = async (clientId?: string, bearerToken?: string): Promise<number> => {
	const cid = clientId || DEFAULT_CLIENT_ID;
	const summary = await getClient(bearerToken, cid).getClientWalletSummary(cid);
	// WLT returns float YER; convert to minor units for display layer.
	return Math.round(summary.balance * 100);
};

export const link = async (clientId?: string, bearerToken?: string): Promise<{ success: boolean; account?: WalletAccount; error?: string }> => {
	try {
		const cid = clientId || DEFAULT_CLIENT_ID;
		await getClient(bearerToken, cid).getClientWalletSummary(cid);
		return {
			success: true,
			account: { id: cid, name: 'محفظة WLT' },
		};
	} catch (error) {
		return { success: false, error: normalizeError(error) };
	}
};

export const unlink = async (): Promise<void> => {
	throw new Error('wlt_runtime_link_state_is_read_only_for_dsh');
};

export const requestPayment = async (
	amountMinorUnits: number,
	clientId?: string,
	bearerToken?: string,
	orderId?: string,
): Promise<{ success: boolean; txId?: string; error?: string }> => {
	try {
		const cid = clientId || DEFAULT_CLIENT_ID;
		const oid = orderId || DEFAULT_ORDER_ID;
		const session = await getClient(bearerToken, cid).createClientPaymentSession({
			checkout_intent_id: oid,
			client_id: cid,
			amount: amountMinorUnits / 100,
			currency: DEFAULT_CURRENCY,
			payment_method: 'wallet',
			idempotency_key: paymentIdempotencyKey(cid, oid, amountMinorUnits),
		});

		if (session.status !== 'CONFIRMED') {
			return { success: false, txId: session.id, error: `wlt_payment_${session.status.toLowerCase()}` };
		}

		return { success: true, txId: session.id };
	} catch (error) {
		return { success: false, error: normalizeError(error) };
	}
};

export const listLedgerEntries = async (
	clientId?: string,
	bearerToken?: string,
	limit = 50,
	offset = 0,
) => {
	const cid = clientId || DEFAULT_CLIENT_ID;
	return getClient(bearerToken, cid).listLedgerEntries(cid, limit, offset);
};

export const topUp = async (
	amountMinorUnits: number,
	clientId?: string,
	bearerToken?: string,
): Promise<{ success: boolean; balance?: number; error?: string }> => {
	try {
		const cid = clientId || DEFAULT_CLIENT_ID;
		// Send top up via a mock session confirm or trigger topup logic
		const session = await getClient(bearerToken, cid).createClientPaymentSession({
			checkout_intent_id: `topup-${Date.now()}`,
			client_id: cid,
			amount: amountMinorUnits / 100,
			currency: DEFAULT_CURRENCY,
			payment_method: 'wallet',
			idempotency_key: `topup-idemp-${cid}-${Date.now()}`,
		});
		// In a real flow this redirects, here we simulate confirmed
		await getClient(bearerToken, cid).confirmPaymentSession(session.id, 'mock-topup-ref');
		const newBalance = await getBalance(cid, bearerToken);
		return { success: true, balance: newBalance };
	} catch (error) {
		return { success: false, error: normalizeError(error) };
	}
};

export const createDeepLink = (orderId: string, amountMinorUnits: number): string => {
	return `wlt://pay?order=${encodeURIComponent(orderId)}&amount=${amountMinorUnits}`;
};

const WltDshClientAdapter = { isLinked, getBalance, link, unlink, requestPayment, topUp, createDeepLink, listLedgerEntries };

export default WltDshClientAdapter;
