// Dev/demo fixture for captain_financial_reports. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface FinancialReport {
  period: string;
  totalEarnings: number;
  totalDeductions: number;
  netIncome: number;
  taxAmount: number;
  finalAmount: number;
  breakdown: {
    deliveries: number;
    bonuses: number;
    penalties: number;
    otherIncome: number;
  };
  trends: {
    growth: number;
    averageDaily: number;
    bestMonth: string;
  };
}

type TFunction = (key: string) => string;

export function buildFinancialReportMock(t: TFunction): FinancialReport {
  return {
    period: t('dsh.app-captain.mobile.auto_captain_financial_reports.2024'),
    totalEarnings: 2340.5,
    totalDeductions: 125.0,
    netIncome: 2215.5,
    taxAmount: 110.78,
    finalAmount: 2104.72,
    breakdown: {
      deliveries: 2100.0,
      bonuses: 240.5,
      penalties: -125.0,
      otherIncome: 0,
    },
    trends: {
      growth: 12.5,
      averageDaily: 75.5,
      bestMonth: t('dsh.app-captain.mobile.auto_captain_financial_reports.2024_72'),
    },
  };
}
