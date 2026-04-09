import type { ListingInfo } from '../app-client/mobile/auto_knz_cart_item_add';

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzCartMockListing(t: TFunction, listingId: string): ListingInfo {
  return {
    id: listingId,
    title: t(`${NS_COMMON}.mockListingTitle`),
    price: 3800,
    image_url: undefined,
    seller: { name: t(`${NS_COMMON}.mockSellerDisplay1`), verified: true },
  };
}


