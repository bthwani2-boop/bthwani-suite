/**
 * Fixture for KNZ favorites list (auto_knz_favorites_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface FavoriteListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  postedDate: string;
  image: string;
  condition: 'new' | 'used' | 'refurbished';
  seller: { name: string; verified: boolean };
  deliveryAvailableFromSeller?: boolean;
  listingType?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzFavoritesListMock(t: TFunction): FavoriteListing[] {
  return [
    {
      id: 'FAV-001',
      title: t(`${NS_COMMON}.mockListingTitle`),
      price: 3800,
      currency: 'SAR',
      category: t(`${NS_COMMON}.mockCategoryElectronics`),
      location: t(`${NS_COMMON}.mockLocationRiyadh`),
      postedDate: '2024-02-08',
      image: '💻',
      condition: 'used',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay7`), verified: true },
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
    {
      id: 'FAV-002',
      title: t(`${NS_COMMON}.mockListingRentAlMalaz`),
      price: 6500,
      currency: 'SAR',
      category: t(`${NS_COMMON}.categoryRealEstate`),
      location: t(`${NS_COMMON}.mockLocationRiyadh`),
      postedDate: '2024-02-07',
      image: '🏢',
      condition: 'new',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay8`), verified: true },
      deliveryAvailableFromSeller: false,
      listingType: 'rent',
    },
    {
      id: 'FAV-003',
      title: t(`${NS_COMMON}.mockListingTitle6`),
      price: 3200,
      currency: 'SAR',
      category: t(`${NS_COMMON}.mockCategoryElectronics`),
      location: t(`${NS_COMMON}.mockLocationJeddah`),
      postedDate: '2024-02-06',
      image: '📱',
      condition: 'used',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay9`), verified: false },
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
  ];
}

