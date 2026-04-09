/**
 * Fixture for platform home get (auto_platform_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import { BTHWANI_COLORS } from '@bthwani/ui-kit';

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: string;
  color: string;
}

export interface Activity {
  id: string;
  type: 'order' | 'booking' | 'delivery' | 'payment';
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ServiceStats {
  total_orders?: number;
  active_bookings?: number;
  deliveries_completed?: number;
  wallet_balance?: number;
  rating?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  valid_until: string;
}

export interface HomeData {
  service_mode: 'DSH' | 'ESF' | 'KNZ' | 'MRF' | 'WLT';
  user_name: string;
  quick_actions: QuickAction[];
  recent_activity: Activity[];
  stats: ServiceStats;
  promotions?: Promotion[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'platform.app-user.mobile.auto_platform_home_get';

function getQuickActionsForService(t: TFunction, mode: string): QuickAction[] {
  switch (mode) {
    case 'DSH':
      return [
        { id: 'order_food', title: t(`${NS}.l120`), icon: '🍕', action: 'order_food', color: BTHWANI_COLORS.primary },
        { id: 'track_order', title: t(`${NS}.l121`), icon: '📍', action: 'track_order', color: BTHWANI_COLORS.info },
        { id: 'favorites', title: t(`${NS}.l122`), icon: '❤️', action: 'favorites', color: BTHWANI_COLORS.error },
        { id: 'search', title: t(`${NS}.l123`), icon: '🔍', action: 'search', color: BTHWANI_COLORS.secondary },
      ];
    case 'ESF':
      return [
        { id: 'book_service', title: t(`${NS}.l127`), icon: '📅', action: 'book_service', color: BTHWANI_COLORS.primary },
        { id: 'my_bookings', title: t(`${NS}.l128`), icon: '📋', action: 'my_bookings', color: BTHWANI_COLORS.info },
        { id: 'favorites', title: t(`${NS}.l129`), icon: '❤️', action: 'favorites', color: BTHWANI_COLORS.error },
        { id: 'support', title: t(`${NS}.l130`), icon: '💬', action: 'support', color: BTHWANI_COLORS.secondary },
      ];
    case 'KNZ':
      return [
        { id: 'browse_items', title: t(`${NS}.l134`), icon: '🛒', action: 'browse_items', color: BTHWANI_COLORS.primary },
        { id: 'sell_item', title: t(`${NS}.l135`), icon: '💰', action: 'sell_item', color: BTHWANI_COLORS.success },
        { id: 'my_listings', title: t(`${NS}.l136`), icon: '📦', action: 'my_listings', color: BTHWANI_COLORS.info },
        { id: 'favorites', title: t(`${NS}.l137`), icon: '❤️', action: 'favorites', color: BTHWANI_COLORS.error },
      ];
    case 'MRF':
      return [
        { id: 'post_request', title: t(`${NS}.l141`), icon: '📝', action: 'post_request', color: BTHWANI_COLORS.primary },
        { id: 'browse_requests', title: t(`${NS}.l142`), icon: '🔍', action: 'browse_requests', color: BTHWANI_COLORS.info },
        { id: 'my_requests', title: t(`${NS}.l143`), icon: '📋', action: 'my_requests', color: BTHWANI_COLORS.secondary },
        { id: 'support', title: t(`${NS}.l144`), icon: '💬', action: 'support', color: BTHWANI_COLORS.warning },
      ];
    case 'WLT':
      return [
        { id: 'add_money', title: t(`${NS}.l148`), icon: '💳', action: 'add_money', color: BTHWANI_COLORS.success },
        { id: 'transfer', title: t(`${NS}.l149`), icon: '↗️', action: 'transfer', color: BTHWANI_COLORS.primary },
        { id: 'pay_bills', title: t(`${NS}.l150`), icon: '📄', action: 'pay_bills', color: BTHWANI_COLORS.info },
        { id: 'history', title: t(`${NS}.l151`), icon: '📊', action: 'history', color: BTHWANI_COLORS.secondary },
      ];
    default:
      return [];
  }
}

function getRecentActivityForService(t: TFunction, mode: string): Activity[] {
  const baseTime = Date.now();
  switch (mode) {
    case 'DSH':
      return [
        { id: 'act_1', type: 'order', title: t(`${NS}.l163`), subtitle: t(`${NS}.l163`), timestamp: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(), status: 'completed' },
        { id: 'act_2', type: 'order', title: t(`${NS}.l164`), subtitle: t(`${NS}.l164`), timestamp: new Date(baseTime - 30 * 60 * 1000).toISOString(), status: 'pending' },
      ];
    case 'ESF':
      return [
        { id: 'act_1', type: 'booking', title: t(`${NS}.l168`), subtitle: t(`${NS}.l168`), timestamp: new Date(baseTime - 4 * 60 * 60 * 1000).toISOString(), status: 'completed' },
        { id: 'act_2', type: 'booking', title: t(`${NS}.l169`), subtitle: t(`${NS}.l169`), timestamp: new Date(baseTime - 1 * 60 * 60 * 1000).toISOString(), status: 'pending' },
      ];
    case 'KNZ':
      return [
        { id: 'act_1', type: 'delivery', title: t(`${NS}.l173`), subtitle: t(`${NS}.l173`), timestamp: new Date(baseTime - 6 * 60 * 60 * 1000).toISOString(), status: 'completed' },
        { id: 'act_2', type: 'order', title: t(`${NS}.l174`), subtitle: t(`${NS}.l174`), timestamp: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(), status: 'pending' },
      ];
    default:
      return [];
  }
}

function getStatsForService(mode: string): ServiceStats {
  switch (mode) {
    case 'DSH':
      return { total_orders: 47, wallet_balance: 1250.5, rating: 4.8 };
    case 'ESF':
      return { active_bookings: 3, wallet_balance: 890.25, rating: 4.9 };
    case 'KNZ':
      return { deliveries_completed: 23, wallet_balance: 2100.75, rating: 4.7 };
    case 'MRF':
      return { total_orders: 12, wallet_balance: 450.0, rating: 4.6 };
    case 'WLT':
      return { wallet_balance: 3500.0 };
    default:
      return {};
  }
}

export function buildPlatformHomeGetMock(
  t: TFunction,
  serviceMode: 'DSH' | 'ESF' | 'KNZ' | 'MRF' | 'WLT'
): HomeData {
  return {
    service_mode: serviceMode,
    user_name: 'سارة أحمد',
    quick_actions: getQuickActionsForService(t, serviceMode),
    recent_activity: getRecentActivityForService(t, serviceMode),
    stats: getStatsForService(serviceMode),
    promotions:
      serviceMode === 'DSH'
        ? [
            {
              id: 'promo_1',
              title: t(`${NS}.l96`),
              description: t(`${NS}.l97`),
              discount: '20%',
              valid_until: '2026-02-28',
            },
          ]
        : undefined,
  };
}
