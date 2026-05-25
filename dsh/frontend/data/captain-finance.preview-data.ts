export type DshCaptainFinanceScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainFinanceSection = 'cod-balance' | 'earnings' | 'settlement';

/**
 * PREVIEW_ONLY — local display snapshot for captain finance labels.
 * Financial truth (COD, earnings, eligibility, settlement) is owned by WLT.
 * Authoritative type: WltCaptainFinanceSnapshot (wlt/frontend/shared/finance/dshFinancePreview.ts).
 * bthwani_delivery only — partner_delivery (store_courier_mode) is not captain payout.
 */
export type DshCaptainFinanceSnapshot = {
	readonly isPreview: true;
	codBalanceLabel: string;
	earningsLabel: string;
	settlementLabel: string;
	pendingPayoutLabel?: string;
	cycleLabel?: string;
};
