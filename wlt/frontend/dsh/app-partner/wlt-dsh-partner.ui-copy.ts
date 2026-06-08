export type WltDshPartnerUiCopy = {
  walletHubTitle: string;
  walletSubscriptionLabel: string;
  walletSettlementSummaryLabel: string;
  walletCloseLabel: string;
  walletSectionTitle: string;
  walletSectionDescription: string;
  financeNotificationTitle: string;
  financeNotificationSubtitle: string;
};

// Canonical delivery mode IDs — aligned with DshFulfillmentDeliveryMode.
export type WltDshPartnerOperationalModeId = 'pickup' | 'partner_delivery' | 'bthwani_delivery';

// PREVIEW_ONLY — placeholder values for UI display.
// Real rates are per-partner + per-mode and owned by WLT ledger.
// Do NOT use for financial accounting or settlement logic.
const operationalModeCommissionsPreview = {
  pickup: 'PREVIEW',
  partner_delivery: 'PREVIEW',
  bthwani_delivery: 'PREVIEW',
} as const satisfies Record<WltDshPartnerOperationalModeId, string>;

export const wltDshPartnerUiCopy = {
  walletHubTitle: 'المحفظة',
  walletSubscriptionLabel: 'الاشتراك',
  walletSettlementSummaryLabel: 'ملخص التسويات',
  walletCloseLabel: 'إغلاق',
  walletSectionTitle: 'المحفظة والحسابات المالية',
  walletSectionDescription: 'الرصيد، المستحقات، التسويات، وآخر حركة.',
  financeNotificationTitle: 'التسويات والتنبيهات المالية',
  financeNotificationSubtitle: 'المستحقات، التسويات، والتنبيهات ذات الأثر المالي.',
} as const satisfies WltDshPartnerUiCopy;

// Returns a PREVIEW placeholder. WLT will provide real per-partner per-mode rates.
export function getWltDshPartnerOperationalModeCommission(modeId: WltDshPartnerOperationalModeId): string {
  return operationalModeCommissionsPreview[modeId];
}

export function getWltDshPartnerCommissionLabel(commission: string): string {
  if (commission === 'PREVIEW') return 'عمولة قيد التحديد';
  return `عمولة ${commission}`;
}
