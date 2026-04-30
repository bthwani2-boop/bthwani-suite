/**
 * Fixture for KNZ my listings screen (auto_knz_my_listings).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import { KNZ_YEMEN_CITY_KEYS } from '../shared/knz-constants';

export interface MyListingItem {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  status: 'active' | 'closed';
  image_url?: string;
  postedDate: string;
  deliveryAvailableFromSeller?: boolean;
  listingType?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzMyListingsMock(t: TFunction): MyListingItem[] {
  return [
    {
      id: '1',
      title: t(`${NS_COMMON}.mockListingTitle`),
      price: 3800,
      category: 'electronics',
      location: t(KNZ_YEMEN_CITY_KEYS[0]),
      status: 'active',
      image_url: undefined,
      postedDate: '2024-02-10',
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
    {
      id: '2',
      title: t(`${NS_COMMON}.mockListingTitle6`),
      price: 3200,
      category: 'electronics',
      location: t(KNZ_YEMEN_CITY_KEYS[1]),
      status: 'active',
      image_url: undefined,
      postedDate: '2024-02-08',
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
    {
      id: '3',
      title: t(`${NS_COMMON}.mockListingTitle7`),
      price: 1200,
      category: 'home_garden',
      location: t(KNZ_YEMEN_CITY_KEYS[0]),
      status: 'closed',
      image_url: undefined,
      postedDate: '2024-02-01',
      deliveryAvailableFromSeller: true,
      listingType: 'sale',
    },
  ];
}

