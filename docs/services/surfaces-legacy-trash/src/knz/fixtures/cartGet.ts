/**
 * Fixture for KNZ cart screen (auto_knz_cart_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface CartItem {
  id: string;
  listingId: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
  seller: { name: string; verified: boolean };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzCartGetMockItems(t: TFunction): CartItem[] {
  return [
    {
      id: '1',
      listingId: 'LST-001',
      title: t(`${NS_COMMON}.mockListingTitle`),
      price: 3800,
      quantity: 1,
      image_url: undefined,
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay1`), verified: true },
    },
    {
      id: '2',
      listingId: 'LST-002',
      title: t(`${NS_COMMON}.mockListingTitle6`),
      price: 3200,
      quantity: 1,
      image_url: undefined,
      seller: { name: t(`${NS_COMMON}.mockSellerDisplay2`), verified: true },
    },
  ];
}

