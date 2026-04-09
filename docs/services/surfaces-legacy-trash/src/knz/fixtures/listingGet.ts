/**
 * Fixture for KNZ listing detail screen (auto_knz_listing_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface KnzListingDetail {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  postedDate: string;
  listingType: 'sale';
  deliveryAvailableFromSeller: boolean;
  description: string;
  images: string[];
  condition: string;
  sellerId: string;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    memberSince: string;
    totalListings: number;
  };
  attributes: Array<{ label: string; value: string }>;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'knz.app-client.mobile.auto_knz_listing_get';
const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzListingGetMock(
  t: TFunction,
  listingId: string,
  sellerUserId: string
): KnzListingDetail {
  return {
    id: listingId,
    title: t(`${NS_COMMON}.mockListingTitle`),
    price: 3800,
    currency: t(`${NS}.currency`),
    category: t(`${NS_COMMON}.categoryElectronics`),
    location: t(`${NS_COMMON}.mockLocationRiyadh`),
    postedDate: '2024-02-08',
    listingType: 'sale',
    deliveryAvailableFromSeller: true,
    description: t(`${NS_COMMON}.mockDescription1`),
    images: ['💻', '📱', '🔌'],
    condition: 'used',
    sellerId: sellerUserId,
    seller: {
      name: t(`${NS_COMMON}.mockSellerDisplay1`),
      rating: 4.8,
      verified: true,
      memberSince: '2022',
      totalListings: 45,
    },
    attributes: [
      { label: t(`${NS}.brand`), value: t(`${NS}.mockBrandValue`) },
      { label: t(`${NS}.model`), value: 'XPS 13' },
      { label: t(`${NS}.processor`), value: 'Intel Core i7' },
      { label: t(`${NS}.memory`), value: '16GB RAM' },
      { label: t(`${NS}.storage`), value: '512GB SSD' },
      { label: t(`${NS}.screen`), value: t(`${NS}.screenSize`) },
    ],
  };
}

