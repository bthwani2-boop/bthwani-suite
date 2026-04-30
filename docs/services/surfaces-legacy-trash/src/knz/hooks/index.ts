/**
 * KNZ Hooks - Data layer for KNZ service screens
 * 
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - الآن: تستخدم fixtures (بيانات تجريبية)
 * - لاحقاً: تستخدم api-clients (API حقيقي)
 */

// ============================================
// Hooks
// ============================================
export { useKnzHome } from './useKnzHome';
export type { UseKnzHomeResult } from './useKnzHome';

export { useKnzListingGet } from './useKnzListingGet';
export type { UseKnzListingGetResult } from './useKnzListingGet';

export { useKnzListingsList } from './useKnzListingsList';
export type { UseKnzListingsListResult, UseKnzListingsListOptions } from './useKnzListingsList';

export { useKnzMyListings } from './useKnzMyListings';
export type { UseKnzMyListingsResult, UseKnzMyListingsOptions } from './useKnzMyListings';

export { useKnzListingUpdate } from './useKnzListingUpdate';
export type { UseKnzListingUpdateResult, KnzListingUpdateData } from './useKnzListingUpdate';

export { useKnzAuctionGet } from './useKnzAuctionGet';
export type { UseKnzAuctionGetResult } from './useKnzAuctionGet';

export { useKnzCartGet } from './useKnzCartGet';
export type { UseKnzCartGetResult } from './useKnzCartGet';

export { useKnzCart } from './useKnzCart';
export type { UseKnzCartResult } from './useKnzCart';

export { useKnzFavoritesList } from './useKnzFavoritesList';
export type { UseKnzFavoritesListResult } from './useKnzFavoritesList';

export { useKnzChatThreadList } from './useKnzChatThreadList';
export type { UseKnzChatThreadListResult } from './useKnzChatThreadList';

export { useKnzChatMessageSend } from './useKnzChatMessageSend';
export type { UseKnzChatMessageSendResult } from './useKnzChatMessageSend';

// ============================================
// Fixture Builders (re-exported for migration)
// ============================================
export { buildKnzHomeMockData } from '../fixtures/home';

export {
  buildKnzListingGetMock,
  type KnzListingDetail,
} from '../fixtures/listingGet';

export {
  buildKnzListingsListMock,
  type Listing,
} from '../fixtures/listingsList';

export {
  buildKnzMyListingsMock,
  type MyListingItem,
} from '../fixtures/myListings';

export { buildKnzListingUpdateMock } from '../fixtures/listingUpdate';

export {
  buildKnzAuctionGetMock,
  type AuctionDetail,
} from '../fixtures/auctionGet';

export {
  buildKnzCartGetMockItems,
  type CartItem,
} from '../fixtures/cartGet';

export { buildKnzCartMockListing } from '../fixtures/cart';

export {
  buildKnzFavoritesListMock,
  type FavoriteListing,
} from '../fixtures/favoritesList';

export {
  buildKnzChatThreadListMock,
  type ChatThread,
} from '../fixtures/chatThreadList';

export {
  buildKnzChatMessageSendMock,
  type ChatMessage,
  type ThreadInfo,
} from '../fixtures/chatMessageSend';
