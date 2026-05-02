export type DshCaptainFinanceScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainFinanceSection = 'cod-balance' | 'earnings' | 'settlement';

export type DshCaptainFinanceSnapshot = {
  codBalanceLabel: string;
  earningsLabel: string;
  settlementLabel: string;
};
