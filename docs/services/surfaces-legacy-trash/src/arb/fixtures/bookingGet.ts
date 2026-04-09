/**
 * Fixture for ARB booking get (auto_arb_booking_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'arb.app-client.mobile.auto_arb_booking_get';

export interface ArbBookingDetail {
  id: string;
  property: {
    name: string;
    type: string;
    location: string;
    image: string;
    rating: number;
    reviews: number;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  pricing: {
    nightlyRate: number;
    total: number;
    serviceFee: number;
    totalWithFees: number;
    currency: string;
  };
  guest: {
    name: string;
    email: string;
    phone: string;
    guests: number;
  };
  status: string;
  bookingDate: string;
  cancellationPolicy: string;
  amenities: string[];
}

export function buildArbBookingGetMock(t: TFunction, bookingId?: string): ArbBookingDetail {
  return {
    id: bookingId ?? 'BK-2024-001',
    property: {
      name: t(`${NS}.l59`),
      type: t(`${NS}.l60`),
      location: t(`${NS}.l61`),
      image: '🏘️',
      rating: 4.8,
      reviews: 124,
    },
    dates: {
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      nights: 5,
    },
    pricing: {
      nightlyRate: 450,
      total: 2250,
      serviceFee: 150,
      totalWithFees: 2400,
      currency: t(`${NS}.l76`),
    },
    guest: {
      name: t(`${NS}.l79`),
      email: 'ahmed@example.com',
      phone: '+966501234567',
      guests: 4,
    },
    status: 'confirmed',
    bookingDate: '2024-02-08',
    cancellationPolicy: t(`${NS}.l86`),
    amenities: [
      t(`${NS}.l88`),
      t(`${NS}.l88`),
      t(`${NS}.l88`),
      'خدمة تنظيف',
      'مطبخ مجهز',
      'واي فاي',
    ],
  };
}

