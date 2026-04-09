/**
 * Fixture for DSH subscription sync (auto_dsh_subscription_sync).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Subscription {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'expired';
  lastSync: string;
  nextBilling: string;
  amount: number;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_subscription_sync';

export function buildDshSubscriptionSyncMock(t: TFunction): Subscription[] {
  return [
    { id: '1', name: t(`${NS}.l77`), status: 'active', lastSync: '2024-02-10 14:30', nextBilling: '2024-03-10', amount: 49.99 },
    { id: '2', name: t(`${NS}.l85`), status: 'active', lastSync: '2024-02-10 12:15', nextBilling: '2024-03-10', amount: 29.99 },
    { id: '3', name: t(`${NS}.l93`), status: 'inactive', lastSync: '2024-01-15 09:45', nextBilling: t(`${NS}.l96`), amount: 99.99 },
  ];
}

