export type WltPaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
export type WltRefundStatus = 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
export type WltSettlementStatus = 'PENDING' | 'PROCESSING' | 'SETTLED' | 'FAILED';
export type WltPayoutDecisionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export function resolvePaymentStatusLabel(status: WltPaymentStatus): string {
  const map: Record<WltPaymentStatus, string> = {
    PENDING: 'في الانتظار',
    CONFIRMED: 'مكتملة',
    FAILED: 'فشلت',
    EXPIRED: 'انتهت صلاحيتها',
    CANCELLED: 'ملغاة',
  };
  return map[status] ?? status;
}

export function resolveRefundStatusLabel(status: WltRefundStatus): string {
  const map: Record<WltRefundStatus, string> = {
    PENDING: 'معلق',
    PROCESSING: 'قيد المعالجة',
    CONFIRMED: 'مكتمل',
    FAILED: 'فشل',
  };
  return map[status] ?? status;
}

export function resolveSettlementStatusLabel(status: WltSettlementStatus): string {
  const map: Record<WltSettlementStatus, string> = {
    PENDING: 'معلقة',
    PROCESSING: 'قيد المعالجة',
    SETTLED: 'مسواة',
    FAILED: 'فشلت',
  };
  return map[status] ?? status;
}

export function resolvePayoutStatusLabel(status: WltPayoutDecisionStatus): string {
  const map: Record<WltPayoutDecisionStatus, string> = {
    PENDING: 'معلق',
    APPROVED: 'مقبول',
    REJECTED: 'مرفوض',
    PAID: 'مصروف',
  };
  return map[status] ?? status;
}

export type WltStatusTone = 'default' | 'success' | 'warning' | 'danger';

export function resolvePaymentStatusTone(status: WltPaymentStatus): WltStatusTone {
  if (status === 'CONFIRMED') return 'success';
  if (status === 'PENDING') return 'warning';
  if (status === 'FAILED' || status === 'EXPIRED' || status === 'CANCELLED') return 'danger';
  return 'default';
}

export function resolveRefundStatusTone(status: WltRefundStatus): WltStatusTone {
  if (status === 'CONFIRMED') return 'success';
  if (status === 'PENDING' || status === 'PROCESSING') return 'warning';
  if (status === 'FAILED') return 'danger';
  return 'default';
}
