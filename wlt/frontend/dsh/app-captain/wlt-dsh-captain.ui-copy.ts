import { wltDshCaptainPreviewData } from './wlt-dsh-captain.preview-data';

export type WltDshCaptainUiCopy = {
  summaryLabel: string;
  walletBalanceLabel: string;
  financeTitle: string;
  financeSubtitle: string;
  financeBadgeLabel: string;
  topBarLocationLabel: string;
  walletAccessibilityLabel: string;
};

const walletBalanceLabel = wltDshCaptainPreviewData.finance.snapshot.codLiabilityLabel;

export const wltDshCaptainUiCopy = {
  summaryLabel: 'المحفظة',
  walletBalanceLabel,
  financeTitle: 'المالية',
  financeSubtitle: 'المحفظة والأرباح والتسويات في صفحة واحدة.',
  financeBadgeLabel: 'مالي',
  topBarLocationLabel: `المحفظة · ${walletBalanceLabel}`,
  walletAccessibilityLabel: 'المحفظة',
} as const satisfies WltDshCaptainUiCopy;