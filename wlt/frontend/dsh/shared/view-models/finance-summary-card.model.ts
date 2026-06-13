export type WltDshFinanceSummaryCardViewModel = {
  readonly title: string;
  readonly amountLabel: string;
  readonly amountYer: number;
  readonly subtitleLabel?: string;
  readonly tone: 'default' | 'success' | 'warning' | 'danger';
  readonly isLoading: boolean;
  readonly errorMessage?: string;
};

export function buildFinanceSummaryCard(
  title: string,
  amountYer: number,
  opts: { subtitle?: string; tone?: WltDshFinanceSummaryCardViewModel['tone']; isLoading?: boolean; error?: string } = {},
): WltDshFinanceSummaryCardViewModel {
  return {
    title,
    amountYer,
    amountLabel: `${amountYer.toLocaleString('ar-YE')} ر.ي`,
    subtitleLabel: opts.subtitle,
    tone: opts.tone ?? 'default',
    isLoading: opts.isLoading ?? false,
    errorMessage: opts.error,
  };
}
