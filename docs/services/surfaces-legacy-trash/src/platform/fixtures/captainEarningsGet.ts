/**
 * Fixture for platform captain earnings get (auto_platform_captain_earnings_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface EarningsData {
  total_earnings: number;
  monthly_earnings: number;
  weekly_earnings: number;
  today_earnings: number;
  pending_payments: number;
  transaction_count: number;
  average_rating: number;
  service_mode: 'DSH' | 'AMN';
  currency: string;
  last_updated: string;
}

export interface RecentTransaction {
  id: string;
  amount: number;
  type: 'trip' | 'delivery' | 'bonus' | 'penalty';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'platform.app-captain.mobile.auto_platform_captain_earnings_get';

export function buildPlatformCaptainEarningsGetMock(
  t: TFunction,
  serviceMode: 'DSH' | 'AMN'
): { earnings: EarningsData; transactions: RecentTransaction[] } {
  return {
    earnings: {
      total_earnings: serviceMode === 'DSH' ? 18200.0 : 15420.5,
      monthly_earnings: serviceMode === 'DSH' ? 3850.0 : 3240.0,
      weekly_earnings: serviceMode === 'DSH' ? 920.0 : 780.5,
      today_earnings: serviceMode === 'DSH' ? 165.0 : 145.0,
      pending_payments: serviceMode === 'DSH' ? 380.0 : 320.0,
      transaction_count: serviceMode === 'DSH' ? 1450 : 1247,
      average_rating: 4.7,
      service_mode: serviceMode,
      currency: 'SAR',
      last_updated: new Date().toISOString(),
    },
    transactions: [
      {
        id: 'txn_001',
        amount: serviceMode === 'DSH' ? 28.5 : 45.0,
        type: serviceMode === 'DSH' ? 'delivery' : 'trip',
        description: t(`${NS}.l93`),
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
      },
      {
        id: 'txn_002',
        amount: serviceMode === 'DSH' ? 32.75 : 52.5,
        type: serviceMode === 'DSH' ? 'delivery' : 'trip',
        description: t(`${NS}.l101`),
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
      },
      {
        id: 'txn_003',
        amount: 25.0,
        type: 'bonus',
        description: t(`${NS}.l109`),
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
      },
    ],
  };
}
