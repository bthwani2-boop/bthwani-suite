/**
 * Fixture for KNZ chat message send (auto_knz_chat_message_send).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface ChatMessage {
  id: string;
  message: string;
  senderType: 'user' | 'seller';
  timestamp: string;
  read: boolean;
}

export interface ThreadInfo {
  id: string;
  listingTitle: string;
  sellerName: string;
  sellerVerified: boolean;
}

export interface KnzChatMessageSendMock {
  threadInfo: ThreadInfo;
  messages: ChatMessage[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS_COMMON = 'knz.app-client.mobile.common';

export function buildKnzChatMessageSendMock(t: TFunction, threadId: string): KnzChatMessageSendMock {
  return {
    threadInfo: {
      id: threadId,
      listingTitle: t(`${NS_COMMON}.mockListingTitle`),
      sellerName: t(`${NS_COMMON}.mockSellerDisplay1`),
      sellerVerified: true,
    },
    messages: [
      { id: '1', message: t(`${NS_COMMON}.mockMessage1`), senderType: 'user', timestamp: '2024-02-20T10:30:00Z', read: true },
      { id: '2', message: t(`${NS_COMMON}.mockMessage2`), senderType: 'seller', timestamp: '2024-02-20T10:32:00Z', read: true },
      { id: '3', message: t(`${NS_COMMON}.mockMessage3`), senderType: 'user', timestamp: '2024-02-20T10:35:00Z', read: true },
    ],
  };
}

