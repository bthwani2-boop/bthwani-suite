// PREVIEW_ONLY — WLT DSH Client Adapter (localStorage simulation, not a real payment runtime).
// All operations (requestPayment, topUp, link, getBalance) use in-memory / localStorage only.
// runtimeTruth=false / backendSource=false — see wlt-dsh-client.contract.ts for the full boundary contract.
// No real ledger entry, no real WLT API call, no real payment mutation from this adapter.
// When a real WLT payment runtime is available, replace this file with the actual SDK bridge.
import { wltBackendClient } from '../../../backend/src/client';

export type WalletAccount = { id: string; name: string };

const STORAGE_KEY_ACCOUNT = 'dsh_bth_wallet_account';
const STORAGE_KEY_BALANCE = 'dsh_bth_wallet_balance';

let walletAccountMemory: WalletAccount | null = null;
let walletBalanceMemory = 10000;

function getStorageHandle() {
	try {
		return typeof globalThis !== 'undefined' && 'localStorage' in globalThis ? globalThis.localStorage : null;
	} catch {
		return null;
	}
}

function readAccountLocal(): WalletAccount | null {
	const storage = getStorageHandle();
	if (storage) {
		try {
			const raw = storage.getItem(STORAGE_KEY_ACCOUNT);
			if (!raw) return walletAccountMemory;
			const parsed = JSON.parse(raw) as WalletAccount;
			walletAccountMemory = parsed;
			return parsed;
		} catch {
			return walletAccountMemory;
		}
	}

	return walletAccountMemory;
}

function writeAccountLocal(account: WalletAccount | null) {
	walletAccountMemory = account;
	const storage = getStorageHandle();
	if (!storage) {
		return;
	}

	try {
		if (account) {
			storage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(account));
		} else {
			storage.removeItem(STORAGE_KEY_ACCOUNT);
		}
	} catch {
		// ignore
	}
}

function readBalanceLocal() {
	const storage = getStorageHandle();
	if (storage) {
		try {
			const raw = storage.getItem(STORAGE_KEY_BALANCE);
			if (raw == null) {
				storage.setItem(STORAGE_KEY_BALANCE, String(walletBalanceMemory));
				return walletBalanceMemory;
			}
			const parsed = Number(raw);
			walletBalanceMemory = Number.isFinite(parsed) ? parsed : walletBalanceMemory;
			return walletBalanceMemory;
		} catch {
			return walletBalanceMemory;
		}
	}

	return walletBalanceMemory;
}

function writeBalanceLocal(nextBalance: number) {
	walletBalanceMemory = nextBalance;
	const storage = getStorageHandle();
	if (!storage) {
		return;
	}

	try {
		storage.setItem(STORAGE_KEY_BALANCE, String(nextBalance));
	} catch {
		// ignore
	}
}

function ensureBalanceLocal() {
	readBalanceLocal();
}

function getBaseUrl(): string | null {
	if (typeof process !== 'undefined') {
		const env = process.env;
		const raw = env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
		return raw?.trim() || null;
	}
	return null;
}

export const isLinked = async (): Promise<boolean> => {
	const baseUrl = getBaseUrl();
	if (baseUrl) {
		try {
			const summary = await wltBackendClient.getClientWalletSummary(baseUrl);
			return summary.linked;
		} catch {
			return false;
		}
	}
	return Boolean(readAccountLocal());
};

export const getBalance = async (): Promise<number> => {
	const baseUrl = getBaseUrl();
	if (baseUrl) {
		const summary = await wltBackendClient.getClientWalletSummary(baseUrl);
		return summary.balanceMinorUnits;
	}
	ensureBalanceLocal();
	return readBalanceLocal();
};

export const link = async (): Promise<{ success: boolean; account?: WalletAccount }> => {
	await new Promise((resolve) => setTimeout(resolve, 300));
	const account = { id: `wallet-${Date.now()}`, name: 'محفظة بثواني' };
	writeAccountLocal(account);
	ensureBalanceLocal();
	return { success: true, account };
};

export const unlink = async (): Promise<void> => {
	await new Promise((resolve) => setTimeout(resolve, 100));
	writeAccountLocal(null);
};

export const requestPayment = async (amountMinorUnits: number): Promise<{ success: boolean; txId?: string; error?: string }> => {
	const baseUrl = getBaseUrl();
	if (baseUrl) {
		try {
			const intent = await wltBackendClient.createClientPaymentIntent(baseUrl, {
				orderId: `ord-gen-${Date.now()}`,
				amountMinorUnits,
				currency: 'YER',
			});
			if (intent.status === 'failed') {
				return { success: false, error: 'insufficient_balance' };
			}
			return { success: true, txId: intent.id };
		} catch {
			return { success: false, error: 'payment_failed' };
		}
	}
	ensureBalanceLocal();
	const balance = readBalanceLocal();
	if (balance < amountMinorUnits) return { success: false, error: 'insufficient_balance' };
	writeBalanceLocal(balance - amountMinorUnits);
	await new Promise((resolve) => setTimeout(resolve, 300));
	return { success: true, txId: `tx-${Date.now()}` };
};

export const topUp = async (amountMinorUnits: number): Promise<{ success: boolean; balance: number }> => {
	const baseUrl = getBaseUrl();
	if (baseUrl) {
		try {
			await wltBackendClient.createClientTopUpIntent(baseUrl, {
				amountMinorUnits,
				currency: 'YER',
			});
			const summary = await wltBackendClient.getClientWalletSummary(baseUrl);
			return { success: true, balance: summary.balanceMinorUnits };
		} catch {
			return { success: false, balance: 0 };
		}
	}
	ensureBalanceLocal();
	const balance = readBalanceLocal();
	const newBalance = balance + amountMinorUnits;
	writeBalanceLocal(newBalance);
	await new Promise((resolve) => setTimeout(resolve, 200));
	return { success: true, balance: newBalance };
};

export const createDeepLink = (orderId: string, amountMinorUnits: number): string => {
	return `wlt://pay?order=${encodeURIComponent(orderId)}&amount=${amountMinorUnits}`;
};

const WltDshClientAdapter = { isLinked, getBalance, link, unlink, requestPayment, topUp, createDeepLink };

export default WltDshClientAdapter;
