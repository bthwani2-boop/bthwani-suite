/**
 * Fixture for CONTROL PANEL partner earnings page.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface EarningsData {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  period: 'today' | 'week' | 'month' | 'year';
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    type: 'order' | 'bonus' | 'penalty' | 'refund';
    description: string;
    status: 'pending' | 'paid' | 'cancelled';
  }>;
  stats: {
    totalOrders: number;
    averageOrderValue: number;
    customerSatisfaction: number;
    deliveryTime: number;
  };
}

export function buildPartnerEarningsMock(
  t: TFunction,
  period: 'today' | 'week' | 'month' | 'year'
): EarningsData {
  const totalEarnings =
    period === 'today' ? 245.5 : period === 'week' ? 1845.75 : period === 'month' ? 7820.25 : 94560;
  const pendingEarnings =
    period === 'today' ? 45.5 : period === 'week' ? 245.75 : period === 'month' ? 820.25 : 2560;
  const paidEarnings =
    period === 'today' ? 200 : period === 'week' ? 1600 : period === 'month' ? 7000 : 92000;
  const totalOrders =
    period === 'today' ? 12 : period === 'week' ? 85 : period === 'month' ? 365 : 4420;

  return {
    totalEarnings,
    pendingEarnings,
    paidEarnings,
    period,
    transactions: [
      {
        id: 'txn_1',
        date: '2026-02-11T14:30:00Z',
        amount: 45.5,
        type: 'order',
        description: t('web.control panel.partner.earnings.page.deliveryOrderAhmed'),
        status: 'pending',
      },
      {
        id: 'txn_2',
        date: '2026-02-11T12:15:00Z',
        amount: 32,
        type: 'order',
        description: t('web.control panel.partner.earnings.page.deliveryOrderFatima'),
        status: 'paid',
      },
      {
        id: 'txn_3',
        date: '2026-02-10T19:45:00Z',
        amount: 78.5,
        type: 'order',
        description: t('web.control panel.partner.earnings.page.deliveryOrderMohammed'),
        status: 'paid',
      },
    ],
    stats: {
      totalOrders,
      averageOrderValue: 65.5,
      customerSatisfaction: 4.8,
      deliveryTime: 28,
    },
  };
}

