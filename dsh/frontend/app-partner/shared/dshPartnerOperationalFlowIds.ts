export const DSH_PARTNER_OPERATIONAL_FLOW_IDS = [
  'order-accept',
  'order-get',
  'order-handoff',
  'order-alerts',
  'order-sla-risk',
  'order-issue-queue',
  'order-issue-required',
  'order-out-for-delivery',
  'order-prepare',
  'order-ready',
  'order-reject',
  'order-store-delivered',
  'order-chat-read-ack',
  'order-chat-send',
  'order-quick-reply-config',
  'order-quick-reply-settings',
  'order-quick-reply-setup',
  'inventory-adjust',
  'inventory-update',
  'items-upsert',
  'doc-upload',
  'intake-start',
  'store-nomination',
  'video-upload',
  'partner-finance-bridge',
  'partner-settlement-summary',
  'partner-commission-summary',
] as const;

// Deprecated/backlog only. Not part of active app-partner UI.
export const DSH_PARTNER_DEPRECATED_OPERATIONAL_FLOW_IDS = [
  'auction-status-update',
] as const;

export type DshPartnerOperationalFlowId = (typeof DSH_PARTNER_OPERATIONAL_FLOW_IDS)[number];
export type DshPartnerDeprecatedOperationalFlowId = (typeof DSH_PARTNER_DEPRECATED_OPERATIONAL_FLOW_IDS)[number];
