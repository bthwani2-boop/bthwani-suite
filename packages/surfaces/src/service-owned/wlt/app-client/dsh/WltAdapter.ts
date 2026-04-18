// Shared WLT adapter wrapper for surface-level wallet integrations.
// Currently delegates to the DSH demo adapter; intended as the single
// place to switch to a real WLT service integration later.
import * as dshAdapter from '../../../dsh/app-client/families/checkout/adapters/DshWalletAdapter';

export type WalletAccount = dshAdapter.WalletAccount;

export const isLinked = async (): Promise<boolean> => dshAdapter.isWalletLinked();
export const getBalance = async (): Promise<number> => dshAdapter.getWalletBalance();
export const link = async (): Promise<{ success: boolean; account?: WalletAccount }> => dshAdapter.linkWallet();
export const unlink = async (): Promise<void> => dshAdapter.unlinkWallet();
export const requestPayment = async (amountHalalas: number): Promise<{ success: boolean; txId?: string; error?: string }> =>
  dshAdapter.requestWalletPayment(amountHalalas);
export const topUp = async (amountHalalas: number): Promise<{ success: boolean; balance: number }> => dshAdapter.topUpWallet(amountHalalas);
export const createDeepLink = (orderId: string, amountHalalas: number): string => dshAdapter.createDeepLinkForPayment(orderId, amountHalalas);

const WltAdapter = { isLinked, getBalance, link, unlink, requestPayment, topUp, createDeepLink };
export default WltAdapter;
