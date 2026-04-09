/**
 * Fixture for captain earnings history (auto_captain_earnings_history).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface EarningsRecord {
  id: string;
  date: string;
  totalEarnings: number;
  deliveriesCount: number;
  bonuses: number;
  deductions: number;
  netEarnings: number;
  details: Array<{
    type: 'delivery' | 'bonus' | 'deduction';
    description: string;
    amount: number;
    orderId?: string;
  }>;
}

export interface SummaryStats {
  totalEarnings: number;
  totalDeliveries: number;
  averagePerDelivery: number;
  bestDay: {
    date: string;
    earnings: number;
  };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-captain.mobile.auto_captain_earnings_history';

export function buildCaptainEarningsHistoryMock(t: TFunction): { earningsHistory: EarningsRecord[]; summaryStats: SummaryStats } {
  return {
    earningsHistory: [
      {
        id: 'earn_001',
        date: '2024-01-15',
        totalEarnings: 180.50,
        deliveriesCount: 8,
        bonuses: 15.00,
        deductions: 5.00,
        netEarnings: 190.50,
        details: [
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l67`) }), amount: 45.00, orderId: 'order_001' },
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l68`) }), amount: 35.50, orderId: 'order_002' },
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l69`) }), amount: 42.00, orderId: 'order_003' },
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l70`) }), amount: 38.00, orderId: 'order_004' },
          { type: 'bonus', description: t('surfaces.dsh_bonus_performance'), amount: 15.00 },
          { type: 'deduction', description: t('surfaces.dsh_penalty_delay'), amount: -5.00 },
        ],
      },
      {
        id: 'earn_002',
        date: '2024-01-14',
        totalEarnings: 165.75,
        deliveriesCount: 7,
        bonuses: 10.00,
        deductions: 0,
        netEarnings: 175.75,
        details: [
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l84`) }), amount: 52.00, orderId: 'order_005' },
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l85`) }), amount: 48.75, orderId: 'order_006' },
          { type: 'delivery', description: t('surfaces.dsh_delivery_restaurant', { name: t(`${NS}.l86`) }), amount: 45.00, orderId: 'order_007' },
          { type: 'bonus', description: t('surfaces.dsh_bonus_daily'), amount: 10.00 },
        ],
      },
    ],
    summaryStats: {
      totalEarnings: 366.25,
      totalDeliveries: 15,
      averagePerDelivery: 24.42,
      bestDay: { date: '2024-01-15', earnings: 190.50 },
    },
  };
}
