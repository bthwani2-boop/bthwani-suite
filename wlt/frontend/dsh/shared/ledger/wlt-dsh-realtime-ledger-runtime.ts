import { resolveWltDshApiBaseUrl } from '../../contracts';

export function resolveWltDshRealtimeLedgerWsUrl(): string {
  return `${resolveWltDshApiBaseUrl().replace(/^http/, 'ws')}/payment/sessions/ledger/ws`;
}
