/**
 * Fixture for ARB offers search (auto_arb_offers_search).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface OfferHit {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  rating?: number;
  reviews?: number;
}

export function buildArbOffersSearchMock(
  t: TFunction,
  resolveDevMediaUrl?: (path: string) => string
): OfferHit[] {
  const baseUrl = typeof resolveDevMediaUrl === 'function' ? resolveDevMediaUrl : () => '';
  return [
    {
      id: 'OFFER-001',
      title: t('surfaces.arb_sample_3'),
      location: 'Riyadh',
      price: `175,000 ${t('surfaces.arb_currency_sar')}`,
      imageUrl: baseUrl('products/arb/prod_0001.jpg') || '',
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 'OFFER-002',
      title: t('surfaces.arb_sample_2'),
      location: 'Jeddah',
      price: `320,000 ${t('surfaces.arb_currency_sar')}`,
      imageUrl: baseUrl('products/general/prod_0002.jpg') || '',
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 'OFFER-003',
      title: t('surfaces.arb_sample_1'),
      location: 'Taif',
      price: `220,000 ${t('surfaces.arb_currency_sar')}`,
      imageUrl: baseUrl('products/arb/prod_0003.jpg') || '',
      rating: 4.6,
      reviews: 98,
    },
  ];
}
