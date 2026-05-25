import type { DshFulfillmentDeliveryMode } from '../shared/dsh-delivery-mode.model';

/**
 * UI_PREVIEW_ONLY: app-partner order alerts + conversation fixtures.
 * Merged from: partner-order-alert.preview-data.ts + partner-order-conversation.preview-data.ts
 */
export const dshPartnerOrdersPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

// --- Order Alerts ---

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

// --- Order Conversation ---

export type DshPartnerOrderConversationMode = DshFulfillmentDeliveryMode;

export type DshPartnerOrderConversationMessage = {
  id: string;
  authorLabel: string;
  body: string;
  timestampLabel: string;
  acknowledged?: boolean;
};

export type DshPartnerOrderConversationVisibility = 'enabled' | 'disabled-for-mode';

export function shouldShowDshPartnerOrderConversation(
  mode: DshPartnerOrderConversationMode
): DshPartnerOrderConversationVisibility {
  // bthwani_delivery: the platform manages tracking; partner-to-captain chat is out of scope here
  return mode === 'bthwani_delivery' ? 'disabled-for-mode' : 'enabled';
}
