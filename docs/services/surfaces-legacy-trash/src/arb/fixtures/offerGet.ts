/**
 * Fixture for ARB offer get (auto_arb_offer_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'arb.app-client.mobile.auto_arb_offer_get';

export interface ArbOfferDetail {
  id: string;
  property: {
    title: string;
    type: string;
    location: string;
    price: number;
    currency: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
  };
  offerDetails: {
    offeredPrice: number;
    originalPrice: number;
    discount: number;
    discountPercentage: number;
    offeredBy: string;
    offerDate: string;
    expiryDate: string;
    conditions: string[];
  };
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    responseTime: string;
    totalListings: number;
  };
  negotiationHistory: Array<{
    date: string;
    price: number;
    by: string;
    note: string;
  }>;
}

export function buildArbOfferGetMock(t: TFunction, offerId?: string): ArbOfferDetail {
  return {
    id: offerId ?? 'OFFER-001',
    property: {
      title: t('surfaces.arb_sample_3'),
      type: t('surfaces.arb_property_apartment'),
      location: t(`${NS}.l71`),
      price: 180000,
      currency: t(`${NS}.l73`),
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      image: '🏢',
    },
    offerDetails: {
      offeredPrice: 175000,
      originalPrice: 180000,
      discount: 5000,
      discountPercentage: 2.8,
      offeredBy: t(`${NS}.l84`),
      offerDate: '2024-02-10 10:30',
      expiryDate: '2024-02-12 10:30',
      conditions: [
        t(`${NS}.l88`),
        t(`${NS}.l89`),
        t(`${NS}.l90`),
      ],
    },
    seller: {
      name: t(`${NS}.l94`),
      rating: 4.8,
      verified: true,
      responseTime: t(`${NS}.l97`),
      totalListings: 25,
    },
    negotiationHistory: [
      {
        date: '2024-02-10 10:30',
        price: 175000,
        by: t(`${NS}.l104`),
        note: t(`${NS}.l105`),
      },
      {
        date: '2024-02-09 16:45',
        price: 178000,
        by: t(`${NS}.l110`),
        note: t(`${NS}.l111`),
      },
    ],
  };
}

