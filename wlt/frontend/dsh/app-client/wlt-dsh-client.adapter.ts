export {
  default,
  isLinked,
  getBalance,
  link,
  unlink,
  requestPayment,
  topUp,
  createDeepLink,
  listLedgerEntries,
} from '../shared/adapters/client-wallet-runtime.adapter';
export type { WltDshWalletAccount as WalletAccount } from '../shared/adapters/client-wallet-runtime.adapter';
