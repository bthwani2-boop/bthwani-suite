// WLT DSH Client Adapter — runtime-bound HTTP bridge.
// DSH stores WLT references/status only; WLT owns wallet balance and payment outcome.

import { createWltDshTypedClient } from '../../contracts';

export type WalletAccount = { id: string; name: string };

const DEFAULT_CLIENT_ID = 'client-demo';
const DEFAULT_ORDER_ID = 'dsh-client-runtime-payment';
const DEFAULT_CURRENCY = 'YER';

function getClient() {
	return createWltDshTypedClient({});
}

function paymentIdempotencyKey(amountMinorUnits: number): string {
	return `dsh-client-payment-${DEFAULT_CLIENT_ID}-${DEFAULT_ORDER_ID}-${amountMinorUnits}`;
}

function normalizeError(error: unknown): string {
	if (error instanceof Error && error.message) return error.message;
	return 'wlt_runtime_unavailable';
}

export const isLinked = async (): Promise<boolean> => {
	// Wallet is considered linked if WLT returns a summary (200) — no explicit linked field.
	try {
		await getClient().getClientWalletSummary(DEFAULT_CLIENT_ID);
		return true;
	} catch {
		return false;
	}
};

export const getBalance = async (): Promise<number> => {
	const summary = await getClient().getClientWalletSummary(DEFAULT_CLIENT_ID);
	// WLT returns float YER; convert to minor units for display layer.
	return Math.round(summary.balance * 100);
};

export const link = async (): Promise<{ success: boolean; account?: WalletAccount; error?: string }> => {
	try {
		await getClient().getClientWalletSummary(DEFAULT_CLIENT_ID);
		return {
			success: true,
			account: { id: DEFAULT_CLIENT_ID, name: 'محفظة WLT' },
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
): Promise<{ success: boolean; txId?: string; error?: string }> => {
	try {
		const session = await getClient().createClientPaymentSession({
			checkout_intent_id: DEFAULT_ORDER_ID,
			client_id: DEFAULT_CLIENT_ID,
			amount: amountMinorUnits / 100,
			currency: DEFAULT_CURRENCY,
			payment_method: 'wallet',
			idempotency_key: paymentIdempotencyKey(amountMinorUnits),
		});

		if (session.status !== 'CONFIRMED') {
			return { success: false, txId: session.id, error: `wlt_payment_${session.status.toLowerCase()}` };
		}

		return { success: true, txId: session.id };
	} catch (error) {
		return { success: false, error: normalizeError(error) };
	}
};

export const topUp = async (): Promise<{ success: boolean; balance?: number; error?: string }> => {
	return { success: false, error: 'wlt_top_up_out_of_scope_for_dsh_runtime_slice' };
};

export const createDeepLink = (orderId: string, amountMinorUnits: number): string => {
	return `wlt://pay?order=${encodeURIComponent(orderId)}&amount=${amountMinorUnits}`;
};

const WltDshClientAdapter = { isLinked, getBalance, link, unlink, requestPayment, topUp, createDeepLink };

export default WltDshClientAdapter;
