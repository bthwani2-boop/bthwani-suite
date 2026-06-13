import { createWltDshTypedClient } from '../clients';

export type WltDshWalletAccount = { id: string; name: string };

const DEFAULT_CURRENCY = 'YER';

function getClient(bearerToken?: string) {
  return createWltDshTypedClient({ bearerToken });
}

function paymentIdempotencyKey(clientId: string, orderId: string, amountYer: number): string {
  return `dsh-client-payment-${clientId}-${orderId}-${amountYer}`;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'wlt_runtime_unavailable';
}

export const isLinked = async (clientId: string, bearerToken?: string): Promise<boolean> => {
  try {
    await getClient(bearerToken).getClientWalletSummary(clientId);
    return true;
  } catch {
    return false;
  }
};

export const getBalance = async (clientId: string, bearerToken?: string): Promise<number> => {
  const summary = await getClient(bearerToken).getClientWalletSummary(clientId);
  const rawBalance = typeof summary.balance === 'number' && !Number.isNaN(summary.balance)
    ? summary.balance
    : ((summary as Record<string, unknown>)['balanceMinorUnits'] as number ?? 0) / 100;
  return Math.round(rawBalance);
};

export const link = async (
  clientId: string,
  bearerToken?: string,
): Promise<{ success: boolean; account?: WltDshWalletAccount; error?: string }> => {
  try {
    await getClient(bearerToken).getClientWalletSummary(clientId);
    return { success: true, account: { id: clientId, name: 'محفظة WLT' } };
  } catch (error) {
    return { success: false, error: normalizeError(error) };
  }
};

export const unlink = async (): Promise<void> => {
  throw new Error('wlt_runtime_link_state_is_read_only_for_dsh');
};

export const requestPayment = async (
  amountYer: number,
  clientId: string,
  orderId: string,
  bearerToken?: string,
): Promise<{ success: boolean; txId?: string; error?: string }> => {
  try {
    const session = await getClient(bearerToken).createClientPaymentSession({
      checkout_intent_id: orderId,
      client_id: clientId,
      amount: amountYer,
      currency: DEFAULT_CURRENCY,
      payment_method: 'wallet',
      idempotency_key: paymentIdempotencyKey(clientId, orderId, amountYer),
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
  clientId: string,
  bearerToken?: string,
  limit = 50,
  offset = 0,
) => getClient(bearerToken).listLedgerEntries(clientId, limit, offset);

export const topUp = async (): Promise<never> => {
  throw new Error('wlt_topup_must_be_initiated_via_wlt_ui: use createDeepLink and redirect');
};

export const createDeepLink = (orderId: string, amountYer: number): string => {
  return `wlt://pay?order=${encodeURIComponent(orderId)}&amount=${amountYer}`;
};

const WltDshClientWalletRuntimeAdapter = {
  isLinked,
  getBalance,
  link,
  unlink,
  requestPayment,
  topUp,
  createDeepLink,
  listLedgerEntries,
};

export default WltDshClientWalletRuntimeAdapter;
