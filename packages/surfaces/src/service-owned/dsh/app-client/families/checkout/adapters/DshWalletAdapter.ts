// Mock adapter for integrating "محفظة بثواني" (Bthwani Wallet) with DSH
// Production recommendation:
// - Use server-side session creation + wallet provider SDK or deep link
// - Create order server-side in "pending_payment" state, then hand orderId to wallet for payment
// - After wallet confirms, mark order as paid server-side via webhook or callback

export type WalletAccount = { id: string; name: string };

const STORAGE_KEY_ACCOUNT = 'dsh_bth_wallet_account';
const STORAGE_KEY_BALANCE = 'dsh_bth_wallet_balance';

function ensureBalance() {
  try {
    if (!localStorage.getItem(STORAGE_KEY_BALANCE)) {
      // default demo balance: 100.00 SAR => 10000 halalas
      localStorage.setItem(STORAGE_KEY_BALANCE, String(10000));
    }
  } catch (e) {
    // ignore (server/ssr)
  }
}

export async function isWalletLinked(): Promise<boolean> {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY_ACCOUNT));
  } catch {
    return false;
  }
}

export async function getWalletAccount(): Promise<WalletAccount | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNT);
    if (!raw) return null;
    return JSON.parse(raw) as WalletAccount;
  } catch {
    return null;
  }
}

export async function linkWallet(): Promise<{ success: boolean; account?: WalletAccount }> {
  // Demo link flow: in production open wallet SDK / deep link
  await new Promise((r) => setTimeout(r, 600));
  const account: WalletAccount = { id: `wallet-${Date.now()}`, name: 'محفظة بثواني' };
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(account));
    ensureBalance();
  } catch (e) {
    return { success: false };
  }
  return { success: true, account };
}

export async function unlinkWallet(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  try {
    localStorage.removeItem(STORAGE_KEY_ACCOUNT);
  } catch {}
}

export async function getWalletBalance(): Promise<number> {
  try {
    ensureBalance();
    const raw = localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0';
    return Number(raw);
  } catch {
    return 0;
  }
}

export async function requestWalletPayment(amountHalalas: number): Promise<{ success: boolean; txId?: string; error?: string }> {
  // amount in halalas (integer)
  ensureBalance();
  const balance = Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
  // simulate network
  await new Promise((r) => setTimeout(r, 700));
  if (balance < amountHalalas) {
    return { success: false, error: 'insufficient_funds' };
  }
  const newBal = balance - amountHalalas;
  localStorage.setItem(STORAGE_KEY_BALANCE, String(newBal));
  return { success: true, txId: `tx-${Date.now()}` };
}

export async function topUpWallet(amountHalalas: number): Promise<{ success: boolean; balance: number }> {
  ensureBalance();
  const bal = Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
  const newBal = bal + amountHalalas;
  localStorage.setItem(STORAGE_KEY_BALANCE, String(newBal));
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, balance: newBal };
}

export function createDeepLinkForPayment(orderId: string, amountHalalas: number): string {
  // Production: return a deep link or URL to the wallet app with a payment session
  return `bthwallet://pay?order=${encodeURIComponent(orderId)}&amount=${amountHalalas}`;
}
