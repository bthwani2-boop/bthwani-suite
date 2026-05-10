export type DshPartnerOrderAlertId =
  | 'order_needs_accept'
  | 'order_sla_risk'
  | 'order_ready'
  | 'order_handoff_pending'
  | 'order_issue_required'
  | 'order_rejected'
  | 'order_store_delivered';

export type DshPartnerOrderAlertStatus = 'new' | 'seen';

export type DshPartnerOrderAlertItem = {
  id: string;
  orderId: string;
  alertId: DshPartnerOrderAlertId;
  title: string;
  description: string;
  timeLabel: string;
  status: DshPartnerOrderAlertStatus;
  urgent?: boolean;
};
