/**
 * Fixture for AMN home screen (auto_amn_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface AmnBanner {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  action_url?: string;
}

export interface AmnQuickAction {
  id: string;
  name: string;
  icon: string;
  screen: string;
  color: string;
}

export interface AmnRecentTrip {
  id: string;
  pickupLocation: string;
  destination: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  date: string;
  driverName?: string;
  fare?: number;
}

export interface AmnHomeData {
  active_trips?: number;
  total_trips?: number;
  total_spent?: number;
  banners?: AmnBanner[];
  quickActions?: AmnQuickAction[];
  recentTrips?: AmnRecentTrip[];
}

export interface AmnHomeRoles {
  info: string;
  error: string;
  warning: string;
  accentStrong: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_AMN = 'amn.app-client.mobile.auto_amn_home_get';

export function buildAmnHomeMock(t: TFunction, roles: AmnHomeRoles): AmnHomeData {
  return {
    active_trips: 1,
    total_trips: 47,
    total_spent: 2340,
    banners: [
      {
        id: 'banner_1',
        title: t('surfaces.hero_amn_safe'),
        description: t('surfaces.hero_amn_women'),
        image_url: undefined,
      },
    ],
    quickActions: [
      { id: '2', name: t(`${NS_AMN}.l109`), icon: '📋', screen: 'AmnTripsList', color: roles.info },
      { id: '6', name: t(`${NS_AMN}.l110`), icon: '🚨', screen: 'AmnSosTrigger', color: roles.error },
      { id: '4', name: t(`${NS_AMN}.l111`), icon: '💰', screen: 'AmnQuoteCreate', color: roles.warning },
      { id: '5', name: t(`${NS_AMN}.l112`), icon: '👥', screen: 'AmnCaptainsNearby', color: roles.accentStrong },
      { id: '7', name: t(`${NS_AMN}.l113`), icon: '📅', screen: 'AmnBookingCreate', color: roles.info },
    ],
    recentTrips: [
      {
        id: 'TRIP-001',
        pickupLocation: t(`${NS_AMN}.l118`),
        destination: t(`${NS_AMN}.l119`),
        status: 'completed',
        date: '2024-02-10',
        driverName: t(`${NS_AMN}.l122`),
        fare: 45,
      },
      {
        id: 'TRIP-002',
        pickupLocation: t(`${NS_AMN}.l127`),
        destination: t(`${NS_AMN}.l128`),
        status: 'in_progress',
        date: '2024-02-11',
        driverName: t(`${NS_AMN}.l131`),
        fare: 35,
      },
      {
        id: 'TRIP-003',
        pickupLocation: t(`${NS_AMN}.l136`),
        destination: t(`${NS_AMN}.l137`),
        status: 'cancelled',
        date: '2024-02-09',
        driverName: t(`${NS_AMN}.l140`),
        fare: 0,
      },
    ],
  };
}

