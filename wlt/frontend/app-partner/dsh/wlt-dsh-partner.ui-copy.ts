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

export type WltDshPartnerOperationalModeId = 'pickup' | 'delivery' | 'scheduled';

const operationalModeCommissions = {
  pickup: '0%',
  delivery: '8%',
  scheduled: '15%',
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

export function getWltDshPartnerOperationalModeCommission(modeId: WltDshPartnerOperationalModeId): string {
  return operationalModeCommissions[modeId];
}

export function getWltDshPartnerCommissionLabel(commission: string): string {
  return `عمولة ${commission}`;
}