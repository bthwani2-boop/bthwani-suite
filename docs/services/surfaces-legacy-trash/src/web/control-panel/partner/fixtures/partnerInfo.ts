/**
 * Fixture for CONTROL PANEL partner dashboard (page.tsx).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface PartnerInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  joinedAt: string;
  stats: {
    totalOrders: number;
    activeOrders: number;
    totalRevenue: number;
    rating: number;
  };
}

export function buildPartnerInfoMock(t: TFunction): PartnerInfo {
  return {
    id: 'partner_123',
    name: t('surfaces.مطعم_الرياض'),
    type: 'DSH',
    status: 'active',
    joinedAt: '2023-01-15',
    stats: {
      totalOrders: 1250,
      activeOrders: 5,
      totalRevenue: 125000,
      rating: 4.8,
    },
  };
}

