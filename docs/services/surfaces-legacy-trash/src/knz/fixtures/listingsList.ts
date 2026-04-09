/**
 * Fixture for KNZ listings list screen (auto_knz_listings_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import { KNZ_YEMEN_CITY_KEYS } from '../shared/knz-constants';

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  categoryLabelAr?: string;
  location: string;
  area?: string;
  condition: 'new' | 'used' | 'refurbished';
  image_url?: string;
  postedDate: string;
  seller: { name: string; verified: boolean };
  rating?: number;
  deliveryAvailableFromSeller?: boolean;
  listingType?: string;
  isPromoted?: boolean;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzListingsListMock(t: TFunction): Listing[] {
  return [
    {
      id: '1',
      title: t(`${NS_COMMON}.mockListingTitle`),
      price: 3800,
      category: 'electronics',
      categoryLabelAr: t(`${NS_COMMON}.categoryElectronics`),
      location: t(KNZ_YEMEN_CITY_KEYS[0]),
      area: t('surfaces.جدر'),
      condition: 'used',
      image_url: undefined,
      postedDate: '2024-02-10',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay1`), verified: true },
      rating: 4.8,
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
      isPromoted: true,
    },
    {
      id: '2',
      title: t(`${NS_COMMON}.mockListingTitle4`),
      price: 75000,
      category: 'vehicles',
      categoryLabelAr: t(`${NS_COMMON}.categoryVehicles`),
      location: t(KNZ_YEMEN_CITY_KEYS[1]),
      area: t('surfaces.الدرين'),
      condition: 'used',
      image_url: undefined,
      postedDate: '2024-02-09',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay3`), verified: true },
      rating: 4.9,
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
      isPromoted: true,
    },
    {
      id: '3',
      title: t(`${NS_COMMON}.mockListingTitle5`),
      price: 1200000,
      category: 'real_estate',
      categoryLabelAr: t(`${NS_COMMON}.categoryRealEstate`),
      location: t(KNZ_YEMEN_CITY_KEYS[0]),
      area: t('surfaces.الاصبحي'),
      condition: 'new',
      image_url: undefined,
      postedDate: '2024-02-08',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay4`), verified: true },
      rating: 5.0,
      deliveryAvailableFromSeller: false,
      listingType: 'rent',
    },
    {
      id: '4',
      title: t(`${NS_COMMON}.mockListingTitle6`),
      price: 3200,
      category: 'electronics',
      categoryLabelAr: t(`${NS_COMMON}.categoryElectronics`),
      location: t(KNZ_YEMEN_CITY_KEYS[2]),
      area: t('surfaces.مديرية_التعزية'),
      condition: 'used',
      image_url: undefined,
      postedDate: '2024-02-07',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay5`), verified: true },
      rating: 4.7,
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
    {
      id: '5',
      title: t(`${NS_COMMON}.mockListingTitle7`),
      price: 1200,
      category: 'home_garden',
      categoryLabelAr: t(`${NS_COMMON}.categoryHomeGarden`),
      location: t(KNZ_YEMEN_CITY_KEYS[0]),
      area: t('surfaces.الجراف_الشرقي'),
      condition: 'used',
      image_url: undefined,
      postedDate: '2024-02-06',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay6`), verified: false },
      rating: 4.5,
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
    {
      id: '6',
      title: t(`${NS_COMMON}.mockListingTitle3`),
      price: 8500,
      category: 'vehicles',
      categoryLabelAr: t(`${NS_COMMON}.categoryVehicles`),
      location: t(KNZ_YEMEN_CITY_KEYS[1]),
      area: t('surfaces.شيخ_عثمان'),
      condition: 'used',
      image_url: undefined,
      postedDate: '2024-02-05',
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay7`), verified: true },
      rating: 4.6,
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
  ];
}

