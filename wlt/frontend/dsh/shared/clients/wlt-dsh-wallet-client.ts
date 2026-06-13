import { createWltDshTypedClient, resolveWltDshApiBaseUrl } from '../../contracts/wlt-dsh-client';
import type { WltWalletSummary, WltListLedgerResponse } from '../../contracts/wlt-dsh-client';

export type WltDshWalletClientOptions = {
  readonly bearerToken: string;
  readonly subject: string;
};

export async function getWalletSummary(opts: WltDshWalletClientOptions): Promise<WltWalletSummary> {
  const client = createWltDshTypedClient({ bearerToken: opts.bearerToken });
  return client.getClientWalletSummary(opts.subject);
}

export async function getLedgerEntries(
  opts: WltDshWalletClientOptions,
  limit = 50,
  offset = 0,
): Promise<WltListLedgerResponse> {
  const client = createWltDshTypedClient({ bearerToken: opts.bearerToken });
  return client.listLedgerEntries(opts.subject, limit, offset);
}

export { resolveWltDshApiBaseUrl };
