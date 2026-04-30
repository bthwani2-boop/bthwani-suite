/**
 * Fixture for UserNotificationsListScreen (notifications).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'support';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: {
    orderId?: string;
    promotionId?: string;
    ticketId?: string;
  };
}

export function buildNotificationsListMock(t: TFunction, ns: string): Notification[] {
  return [
    { id: '1', title: t(`${ns}.notification1Title`), message: t(`${ns}.notification1Body`), type: 'order', isRead: false, timestamp: '2024-02-10T10:30:00Z', actionUrl: 'DshOrderGet', metadata: { orderId: '12345' } },
    { id: '2', title: t(`${ns}.notification2Title`), message: t(`${ns}.notification2Body`), type: 'promotion', isRead: false, timestamp: '2024-02-10T09:15:00Z', actionUrl: 'DshStoreGet', metadata: { promotionId: 'PROMO30' } },
    { id: '3', title: t(`${ns}.notification3Title`), message: t(`${ns}.notification3Body`), type: 'system', isRead: true, timestamp: '2024-02-09T16:45:00Z' },
    { id: '4', title: t(`${ns}.notification4Title`), message: t(`${ns}.notification4Body`), type: 'support', isRead: true, timestamp: '2024-02-09T14:20:00Z', actionUrl: 'SupportTickets', metadata: { ticketId: '67890' } },
    { id: '5', title: t(`${ns}.notification5Title`), message: t(`${ns}.notification5Body`), type: 'promotion', isRead: true, timestamp: '2024-02-08T11:00:00Z' },
    { id: '6', title: t(`${ns}.notification6Title`), message: t(`${ns}.notification6Body`), type: 'system', isRead: true, timestamp: '2024-02-07T08:30:00Z' },
  ];
}
