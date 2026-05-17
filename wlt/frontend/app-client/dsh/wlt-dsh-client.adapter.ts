// Self-contained WLT adapter used by surfaces. Uses localStorage for demo behavior.
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

export const isLinked = async (): Promise<boolean> => {
	return Boolean(readAccountLocal());
};

export const getBalance = async (): Promise<number> => {
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
	ensureBalanceLocal();
	const balance = readBalanceLocal();
	if (balance < amountMinorUnits) return { success: false, error: 'insufficient_balance' };
	writeBalanceLocal(balance - amountMinorUnits);
	await new Promise((resolve) => setTimeout(resolve, 300));
	return { success: true, txId: `tx-${Date.now()}` };
};

export const topUp = async (amountMinorUnits: number): Promise<{ success: boolean; balance: number }> => {
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
