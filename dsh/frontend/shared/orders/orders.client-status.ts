// Moved from view-models/client/client-order-status.ts
// Canonical location: orders/orders.client-status.ts

const ORDER_STATUS_LABELS: Record<string, string> = {
  CREATED: 'قيد المراجعة',
  ACCEPTED: 'تم القبول',
  READY_FOR_PICKUP: 'جاهز للاستلام',
  ACCEPTED_BY_CAPTAIN: 'الكابتن قبل المهمة',
  PICKED_UP: 'تم الاستلام',
  EN_ROUTE: 'في الطريق',
  ARRIVED: 'وصل الكابتن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'تم الإلغاء',
  REFUNDED: 'تم الاسترداد',
  FAILED_DELIVERY: 'فشل التوصيل',
  RETURNING_TO_STORE: 'عائد للمتجر',
  RETURNED: 'تم الإرجاع',
};

export function getClientOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export const CLIENT_ORDER_TERMINAL_STATUSES = new Set([
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
  'FAILED_DELIVERY',
  'RETURNED',
]);
