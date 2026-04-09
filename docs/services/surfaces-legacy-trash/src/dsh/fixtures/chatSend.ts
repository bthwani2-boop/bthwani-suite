/**
 * Fixture for DSH chat send (auto_dsh_chat_send) — order info + initial messages.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface ChatMessage {
  id: string;
  message: string;
  senderType: 'customer' | 'captain';
  timestamp: string;
  read: boolean;
}

export interface OrderInfo {
  id: string;
  restaurantName: string;
  status: string;
  captainName?: string;
}

export interface DshChatSendMock {
  orderInfo: OrderInfo;
  messages: ChatMessage[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_chat_send';

export function buildDshChatSendMock(t: TFunction, orderId: string): DshChatSendMock {
  return {
    orderInfo: {
      id: orderId,
      restaurantName: t(`${NS}.l85`),
      status: 'preparing',
      captainName: t(`${NS}.l87`),
    },
    messages: [
      { id: '1', message: t(`${NS}.l94`), senderType: 'customer', timestamp: '2024-02-20T10:30:00Z', read: true },
      { id: '2', message: t(`${NS}.l101`), senderType: 'captain', timestamp: '2024-02-20T10:32:00Z', read: true },
      { id: '3', message: t(`${NS}.l108`), senderType: 'customer', timestamp: '2024-02-20T10:33:00Z', read: true },
    ],
  };
}

