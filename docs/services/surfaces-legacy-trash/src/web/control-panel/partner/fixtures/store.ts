/**
 * Fixture for CONTROL PANEL partner store page.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface StoreInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  isOpen: boolean;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  deliveryZones: Array<{ name: string; fee: number; minOrder: number }>;
  cuisine: string[];
  rating: number;
  totalOrders: number;
}

export function buildPartnerStoreMock(t: TFunction): StoreInfo {
  return {
    id: 'store_123',
    name: 'مطعم الرياض',
    description: t('web.control panel.partner.store.page.taglineCuisine'),
    address: t('surfaces.شارع_الملك_فيصل،_الرياض'),
    phone: '+966501234567',
    email: 'info@alriyadh-restaurant.com',
    isOpen: true,
    openingHours: {
      sunday: { open: '11:00', close: '23:00', closed: false },
      monday: { open: '11:00', close: '23:00', closed: false },
      tuesday: { open: '11:00', close: '23:00', closed: false },
      wednesday: { open: '11:00', close: '23:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '12:00', close: '24:00', closed: false },
      saturday: { open: '12:00', close: '24:00', closed: false },
    },
    deliveryZones: [
      { name: 'الرياض', fee: 5, minOrder: 30 },
      { name: t('surfaces.الملقا'), fee: 10, minOrder: 40 },
      { name: t('surfaces.العوالي'), fee: 15, minOrder: 50 },
    ],
    cuisine: [t('surfaces.عربية'), t('surfaces.إيطالية'), t('surfaces.أمريكية')],
    rating: 4.8,
    totalOrders: 1250,
  };
}

