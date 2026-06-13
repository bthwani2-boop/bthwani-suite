import type { DshRuntimeOrderRow } from '../api/dsh-order-lifecycle-client';

type PartnerOrderStatus =
  | 'new'
  | 'needs_accept'
  | 'preparation_started'
  | 'preparing'
  | 'items_ready'
  | 'ready'
  | 'handoff'
  | 'captain_assigned'
  | 'captain_arriving'
  | 'delivering'
  | 'completed'
  | 'cancelled';

const statusMap: Record<string, PartnerOrderStatus> = {
  CREATED: 'needs_accept',
  ACCEPTED: 'preparation_started',
  READY_FOR_PICKUP: 'ready',
  ACCEPTED_BY_CAPTAIN: 'captain_assigned',
  PICKED_UP: 'handoff',
  EN_ROUTE: 'delivering',
  ARRIVED: 'delivering',
  DELIVERED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'cancelled',
  FAILED_DELIVERY: 'cancelled',
  RETURNING_TO_STORE: 'cancelled',
  RETURNED: 'cancelled',
};

const nextActionMap: Record<PartnerOrderStatus, string> = {
  new: 'قبول الطلب',
  needs_accept: 'قبول الطلب',
  preparation_started: 'بدء التحضير',
  preparing: 'جاري التحضير',
  items_ready: 'جاهز',
  ready: 'جاهز للاستلام',
  handoff: 'تم التسليم للكابتن',
  captain_assigned: 'الكابتن في الطريق',
  captain_arriving: 'الكابتن يقترب',
  delivering: 'قيد التوصيل',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export function mapRuntimeRowToPartnerOrderItem(row: DshRuntimeOrderRow) {
  const partnerStatus = statusMap[row.status] ?? 'needs_accept';
  const created = new Date(row.createdAt);
  const elapsed = Math.max(0, Math.floor((Date.now() - created.getTime()) / 60000));
  return {
    id: row.id,
    orderCode: `#${row.id.slice(-6).toUpperCase()}`,
    branchLabel: row.storeId,
    status: partnerStatus,
    priority: 'normal' as const,
    orderTypeLabel: 'توصيل بثواني',
    orderMode: 'bthwani_delivery' as const,
    itemsCountLabel: '—',
    amountLabel: `${row.totalPrice.toFixed(2)} ر.س`,
    createdAtLabel: created.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    elapsedLabel: elapsed < 60 ? `${elapsed} د` : `${Math.floor(elapsed / 60)} س`,
    nextActionLabel: nextActionMap[partnerStatus],
  };
}
