/**
 * Fixture for KNZ chat thread list (auto_knz_chat_thread_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * listingImage: raw path; screen may resolve via resolveDevMediaUrl when rendering.
 */

export interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  sellerName: string;
  sellerVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzChatThreadListMock(t: TFunction): ChatThread[] {
  return [
    {
      id: 'THR-001',
      listingId: 'LST-001',
      listingTitle: t(`${NS_COMMON}.mockListingTitle`),
      listingImage: 'products/knz/prod_0001.jpg',
      sellerName: t(`${NS_COMMON}.mockSellerDisplay1`),
      sellerVerified: true,
      lastMessage: t(`${NS_COMMON}.mockMessage2`),
      lastMessageTime: '2024-02-20T10:32:00Z',
      unreadCount: 2,
    },
    {
      id: 'THR-002',
      listingId: 'LST-002',
      listingTitle: t(`${NS_COMMON}.mockListingTitle4`),
      listingImage: 'products/knz/prod_0002.jpg',
      sellerName: t(`${NS_COMMON}.mockSellerDisplay3`),
      sellerVerified: true,
      lastMessage: t(`${NS_COMMON}.mockMessage4Short`),
      lastMessageTime: '2024-02-19T15:20:00Z',
      unreadCount: 0,
    },
    {
      id: 'THR-003',
      listingId: 'LST-003',
      listingTitle: t(`${NS_COMMON}.mockListingTitle5`),
      listingImage: 'products/knz/prod_0003.jpg',
      sellerName: t(`${NS_COMMON}.mockSellerDisplay4`),
      sellerVerified: true,
      lastMessage: t(`${NS_COMMON}.mockMessageVisit`),
      lastMessageTime: '2024-02-18T09:15:00Z',
      unreadCount: 1,
    },
  ];
}

