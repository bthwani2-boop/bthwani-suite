/**
 * Fixture for ARB home screen (auto_arb_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface ArbBanner {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  action_url?: string;
}

export interface ArbRecentBooking {
  id: string;
  property: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  checkIn: string;
  checkOut: string;
  total: number;
}

export interface FeaturedOffer {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  rating?: number;
  reviews?: number;
}

export interface ArbHomeData {
  active_bookings?: number;
  total_bookings?: number;
  total_spent?: number;
  banners?: ArbBanner[];
  recentBookings?: ArbRecentBooking[];
  featuredOffers?: FeaturedOffer[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildArbHomeMock(t: TFunction): ArbHomeData {
  return {
    active_bookings: 2,
    total_bookings: 18,
    total_spent: 45600,
    banners: [
      {
        id: 'banner_1',
        title: t('surfaces.arb_hero_safe'),
        description: t('surfaces.arb_hero_subtitle'),
        image_url: undefined,
      },
    ],
    recentBookings: [
      {
        id: 'BK-001',
        property: t('surfaces.arb_sample_2'),
        status: 'confirmed',
        checkIn: '2024-02-15',
        checkOut: '2024-02-20',
        total: 2400,
      },
      {
        id: 'BK-002',
        property: t('surfaces.arb_sample_3'),
        status: 'pending',
        checkIn: '2024-02-25',
        checkOut: '2024-03-01',
        total: 1800,
      },
      {
        id: 'BK-003',
        property: t('surfaces.arb_property_studio'),
        status: 'cancelled',
        checkIn: '2024-02-10',
        checkOut: '2024-02-12',
        total: 0,
      },
    ],
    featuredOffers: [
      {
        id: 'OFFER-F1',
        title: t('surfaces.arb_sample_1'),
        location: 'Taif',
        price: `220,000 ${t('surfaces.arb_currency_sar')}`,
        imageUrl: '',
        rating: 4.6,
        reviews: 98,
      },
      {
        id: 'OFFER-F2',
        title: t('surfaces.arb_sample_2'),
        location: 'Jeddah',
        price: `320,000 ${t('surfaces.arb_currency_sar')}`,
        imageUrl: '',
        rating: 4.9,
        reviews: 203,
      },
      {
        id: 'OFFER-F3',
        title: t('surfaces.arb_sample_3'),
        location: 'Riyadh',
        price: `175,000 ${t('surfaces.arb_currency_sar')}`,
        imageUrl: '',
        rating: 4.8,
        reviews: 156,
      },
    ],
  };
}
