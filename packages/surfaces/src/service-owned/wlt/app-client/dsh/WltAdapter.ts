// Self-contained WLT adapter used by surfaces. Uses localStorage for demo behavior.
export type WalletAccount = { id: string; name: string };

const STORAGE_KEY_ACCOUNT = 'dsh_bth_wallet_account';
const STORAGE_KEY_BALANCE = 'dsh_bth_wallet_balance';

function ensureBalanceLocal() {
  try {
    if (!localStorage.getItem(STORAGE_KEY_BALANCE)) {
      localStorage.setItem(STORAGE_KEY_BALANCE, String(10000));
    }
  } catch (e) {
    // ignore (SSR/native)
  }
}

export const isLinked = async (): Promise<boolean> => {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY_ACCOUNT));
  } catch {
    return false;
  }
};

export const getBalance = async (): Promise<number> => {
  try {
    ensureBalanceLocal();
    const raw = localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0';
    return Number(raw);
  } catch {
    return 0;
  }
};

export const link = async (): Promise<{ success: boolean; account?: WalletAccount }> => {
  await new Promise((r) => setTimeout(r, 300));
  const account = { id: `wallet-${Date.now()}`, name: 'محفظة بثواني' };
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(account));
    ensureBalanceLocal();
    return { success: true, account };
  } catch {
    return { success: false };
  }
};

export const unlink = async (): Promise<void> => {
  await new Promise((r) => setTimeout(r, 100));
  try { localStorage.removeItem(STORAGE_KEY_ACCOUNT); } catch {}
};

export const requestPayment = async (amountHalalas: number): Promise<{ success: boolean; txId?: string; error?: string }> => {
  try {
    ensureBalanceLocal();
    const bal = Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
    if (bal < amountHalalas) return { success: false, error: 'insufficient_balance' };
    const newBal = bal - amountHalalas;
    localStorage.setItem(STORAGE_KEY_BALANCE, String(newBal));
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, txId: `tx-${Date.now()}` };
  } catch (e) {
    return { success: false, error: 'unknown' };
  }
};

export const topUp = async (amountHalalas: number): Promise<{ success: boolean; balance: number }> => {
  ensureBalanceLocal();
  const bal = Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
  const newBal = bal + amountHalalas;
  localStorage.setItem(STORAGE_KEY_BALANCE, String(newBal));
  await new Promise((r) => setTimeout(r, 200));
  return { success: true, balance: newBal };
};

export const createDeepLink = (orderId: string, amountHalalas: number): string => {
  return `wlt://pay?order=${encodeURIComponent(orderId)}&amount=${amountHalalas}`;
};

const WltAdapter = { isLinked, getBalance, link, unlink, requestPayment, topUp, createDeepLink };
export default WltAdapter;
